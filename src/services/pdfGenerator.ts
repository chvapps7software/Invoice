import { RefObject } from 'react';

// --- Type declaration for window properties ---
// This tells TypeScript that jspdf and html2canvas will be available on the window
declare global {
    interface Window {
        jspdf: any;
        html2canvas: any;
    }
}

// --- Script Loader ---
export const loadPdfScripts = (onSuccess: () => void, onError: (msg: string) => void) => {
    const jspdfURL = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    const html2canvasURL = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

    const loadScript = (src: string): Promise<void> => new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.body.appendChild(script);
    });

    Promise.all([loadScript(jspdfURL), loadScript(html2canvasURL)])
        .then(onSuccess)
        .catch(error => {
            console.error(error);
            onError("Failed to load necessary PDF scripts.");
        });
};

// --- Watermark Function ---
const addWatermark = (pdf: any, logo: string, pageCount: number) => {
    try {
        // Some jspdf builds may not expose GState or setGState; guard accordingly
        if (!pdf || typeof pdf.addImage !== 'function') return;

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const img = new Image();
        img.src = logo;

        const logoWidth = 80;
        const aspectRatio = img.naturalHeight && img.naturalWidth ? img.naturalHeight / img.naturalWidth : 1;
        const logoHeight = logoWidth * aspectRatio;
        const x = (pdfWidth - logoWidth) / 2;
        const y = (pdfHeight - logoHeight) / 2;

        // Try to set low opacity if API exists; otherwise just draw the image normally
        try {
            if (pdf.GState && pdf.setGState) {
                pdf.setGState(new pdf.GState({ opacity: 0.08 }));
                pdf.addImage(logo, 'PNG', x, y, logoWidth, logoHeight);
                pdf.setGState(new pdf.GState({ opacity: 1.0 }));
            } else {
                // Fallback: draw image without changing state
                pdf.addImage(logo, 'PNG', x, y, logoWidth, logoHeight);
            }
        } catch (e) {
            // If anything fails while trying to watermark, skip watermarking but don't abort PDF creation
            console.warn('Watermark skipped due to:', e);
        }
    } catch (err) {
        console.warn('addWatermark error:', err);
    }
};

// --- PDF Generation ---
export const generatePdf = async (
    previewRef: RefObject<HTMLDivElement>, 
    clientName: string, 
    date: string,
    logoSrc: string,
    footerText: string,
    onError: (msg: string) => void
) => {
    if (!window.jspdf || !window.html2canvas) {
        onError("PDF libraries are not loaded.");
        return;
    }

    // Try to resolve jsPDF constructor from known global locations
    const html2canvas = window.html2canvas || (window as any).html2canvas;
    const jsPDFCtor = (window.jspdf && (window.jspdf.jsPDF || (window.jspdf as any).default?.jsPDF)) || (window as any).jsPDF;

    if (!jsPDFCtor) {
        onError('Could not locate jsPDF constructor on window.');
        return;
    }
    const input = previewRef.current;

    if (!input) {
        onError("Preview element not found.");
        return;
    }

    try {
        const canvas = await html2canvas(input, { 
            scale: 2, 
            useCORS: true,
            // ignoreElements may be called with nodes that don't have classList
            ignoreElements: (el: Element) => !!(el && 'classList' in el && (el as Element).classList.contains('no-print-footer'))
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDFCtor('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;

        let width = pdfWidth;
        let height = width / ratio;
        let position = 0;
        let heightLeft = height;

        // Add the first page image
        pdf.addImage(imgData, 'PNG', 0, position, width, height);
        
    // Add watermark to the first page (best-effort)
    try { addWatermark(pdf, logoSrc, 1); } catch(e) { console.warn('watermark error page 1', e); }
        
        heightLeft -= pdfHeight;

        let pageNumber = 2;
        while (heightLeft > 0) {
            position = heightLeft - height;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, width, height);
            
            // Add watermark to each additional page (best-effort)
            try { addWatermark(pdf, logoSrc, pageNumber); } catch(e) { console.warn('watermark error page', pageNumber, e); }
            
            heightLeft -= pdfHeight;
            pageNumber++;
        }
        
        // --- START FOOTER LOGIC ---
        const pageCount = pdf.internal.getNumberOfPages();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageWidth = pdf.internal.pageSize.getWidth();

        // Add footer to all pages
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            
            // Set text styles
            pdf.setFontSize(9);
            pdf.setTextColor(128, 128, 128); // Set text to gray
            
            // Draw the footer text, centered, 10 units from the bottom
            pdf.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }
        // --- END FOOTER LOGIC ---
        
        pdf.save(`${clientName || 'invoice'}-${date}.pdf`);

    } catch (err) {
        console.error("PDF generation error:", err);
        onError("Could not generate PDF.");
    }
};