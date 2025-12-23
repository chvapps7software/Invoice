import React, { useState, useEffect, useRef, useMemo } from 'react';

// Import all your new, separated components and services
import Notification from './components/Notification';
import InvoiceItem from './components/InvoiceItem';
import InvoicePreview from './components/InvoicePreview';
import { loadPdfScripts, generatePdf } from './services/pdfGenerator';

// --- Helper Functions & Constants ---
// We keep constants that App.tsx *needs* here.
// You could also move these to a new 'constants.ts' file.
const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm: string | number = today.getMonth() + 1; // Months start at 0!
    let dd: string | number = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return `${yyyy}-${mm}-${dd}`;
};

export const VISUAL_TEMPLATES = {
    DIGITAL_MARKETING: 'Digital Marketing Style',
    AGREEMENT: 'Service Agreement Style',
    MODERN: 'Modern Red Style',
    FORMAL: 'Formal Classic Style',
    WEBSITE_DESIGN: 'Website Design Style',
};

const defaultLogoUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABJCAMAAAB8a8NCAAAAmVBMVEVHcEz/gwD/gQD/gwD/gQD/gwD/gQD/gwD/gQD/gwD/gQD/gQD/gwD/gQD/gwD/gQD/gwD/gQD/gQD/gQD/gQD/gwD/gQD/gQD/gQD/gQD/gQD/gwD/gQD/gQD/gQD/gQD/gQD/gQD/gwD/gQD/gQD/gQD/gQD/gwD/gwD/gQD/gwD/gwD/gQD/gwD/gwC12B/lAAAAJnRSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHx/d32f4AAAApElEQVRYw+3WSQqAMAwEUdJg3B0b3f+sDgjvRzIJDk/i4Q4uW+q5iK+S2Kq1pUUtR9iU4LdFk6F/6S91g1rC1fS8hYq4o00v+R5T9+7w2k9h8H91pBvR1D/f0oI+8tH/iP+8v2C/fK92f+7f3vCjR/9u/vXG/9jP2f94f6C/Xn2C/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c7config+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c7S9+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c7Good9+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c79+ffy2/c7-..";

type CustomField = {
    id: string;
    label: string;
    value: string;
};

const createFieldId = () => `cf-${Math.random().toString(36).slice(2, 9)}-${Date.now()}`;

const mapTemplateFields = (fields?: Array<Pick<CustomField, 'label' | 'value'>>): CustomField[] =>
    (fields || []).map((field) => ({
        id: createFieldId(),
        label: field.label || '',
        value: field.value || '',
    }));

// --- Content Template Data ---
const APP_DEV_TEMPLATE = {
    name: "App Development Invoice",
    data: {
    companyName: 'CHVApps LLP',
    companyAddress: 'Ganesh theatre, opposite building,\nTagarapuvalasa (531163), Visakhapatnam',
    companyEmail: 'chvapps7@gmail.com',
    companyPhone: '+917075531402',
        clientName: 'Organics (Client)',
        clientCompany: '',
        clientAddress: '',
        projectSubject: 'App Development Agreement',
        invoiceTitle: 'Agreement',
        date: getCurrentDate(),
        quotationNumber: '',
        items: [
            { service: 'UI/UX Design', description: "Digital solution for digital life will design the user interface and user experience according to the Client's specifications.", cost: 0, quantity: 1 },
            { service: 'App Development', description: 'Development of three separate applications: User App, Delivery Partner App, and Admin/Restaurant App.', cost: 0, quantity: 1 },
            { service: 'Backend Development', description: 'An efficient backend system will be developed to facilitate seamless data communication between the apps.', cost: 0, quantity: 1 },
            { service: 'Monthly Maintenance', description: 'Post-project monthly maintenance services to ensure the smooth operation of the apps.', cost: 7000, quantity: 1 },
        ],
        notes: 'If Digital solutions for digital life fails to complete the project or discontinues the work, a full refund of the amount paid by the Client will be provided.',
        template: VISUAL_TEMPLATES.AGREEMENT,
        logoSrc: defaultLogoUrl,
        customFields: [
            { label: 'Delivery Window', value: '12 weeks · 4 releases' },
            { label: 'Support', value: '3 Months complimentary AMC' },
        ],
    }
};

const DIGITAL_MARKETING_TEMPLATE = {
    name: "Digital Marketing Invoice",
    data: {
    companyName: 'CHVApps LLP',
    companyAddress: 'Ganesh theatre, opposite building,\nTagarapuvalasa (531163), Visakhapatnam',
    companyEmail: 'chvapps7@gmail.com',
    companyPhone: '+917075531402',
        clientName: '',
        clientCompany: '',
        clientAddress: '',
        projectSubject: 'Quotation for Social Media and Google Ads Services',
        invoiceTitle: 'Quotation',
        date: '2025-10-05',
        quotationNumber: '139',
        items: [
            { service: 'Social Media Management (1 Month)', description: 'Platform: Facebook, Instagram. Includes: 4 videos making & editing, 25 Posters design & posting, Content creation, Scheduling and publishing, Leads, Promotions.', cost: 14950, quantity: 1 },
            { service: 'Look Walker Advertising - Ad Amount', description: 'Per day advertising campaign cost in Vizianagaram, AP.', cost: 0, quantity: 1 },
            { service: 'Look Walker Advertising - Board Fee', description: 'Per board rental/usage fee.', cost: 2000, quantity: 1 },
        ],
        notes: '',
        template: VISUAL_TEMPLATES.DIGITAL_MARKETING,
        logoSrc: defaultLogoUrl,
        customFields: [
            { label: 'Engagement Window', value: '90 days' },
            { label: 'Reporting Cadence', value: 'Weekly pulse · Monthly deep dive' },
        ],
    }
};

const WEBSITE_DESIGN_TEMPLATE = {
    name: "Website Design Quotation",
    data: {
        companyName: 'CHVApps LLP',
        companyAddress: 'Ganesh theatre, opposite building, Tagarapuvalasa (531163), Visakhapatnam',
        companyEmail: 'chvapps7@gmail.com',
        companyPhone: '+917075531402',
        clientName: 'Adwitha Agros',
        clientCompany: '',
        clientAddress: '',
        projectSubject: 'Website & Admin Panel',
        invoiceTitle: 'PRICE QUOTATION',
        date: getCurrentDate(),
        quotationNumber: '',
        items: [
            {
                service: 'Website (Static)',
                description:
                    'Includes: Home, About Us, Products, Services, Gallery, Contact Us. Showcases machinery, builds trust, and enables inquiries.',
                cost: 45000,
                quantity: 1,
            },
            {
                service: 'Website & Admin (Dynamic)',
                description:
                    'All Static features + Admin CMS, Dynamic Lead Forms (file upload), AI Chatbot, 360 Product View, Dark Mode, and Enhanced Security.',
                cost: 80000,
                quantity: 1,
            },
            {
                service: '3 Months Maintenance & Minor Updates (6months)',
                description: 'Free 3 Months Maintenance & Minor Updates (6months)',
                cost: 0,
                quantity: 1,
            },
        ],
        notes:
            'The amount will be refunded if CHV Apps is unable to provide the service. Additional feature requests beyond scope will be charged separately. Timely inputs from the client are required to meet the timeline. Database & hosting fees must be paid directly by the client.',
        template: VISUAL_TEMPLATES.WEBSITE_DESIGN,
        logoSrc: defaultLogoUrl,
        customFields: [
            { label: 'Launch Window', value: '9 weeks' },
            { label: 'Care Plan', value: '3 Months maintenance included' },
        ],
    },
};

const CONTENT_TEMPLATES = [APP_DEV_TEMPLATE, DIGITAL_MARKETING_TEMPLATE, WEBSITE_DESIGN_TEMPLATE];

// The main application component
export default function App() {
    const initialItem = { service: '', description: '', cost: 0, quantity: 1 };
    
    // --- All State Management ---
    const [companyName, setCompanyName] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyPhone, setCompanyPhone] = useState('');
    const [clientName, setClientName] = useState('');
    const [clientCompany, setClientCompany] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [projectSubject, setProjectSubject] = useState('');
    const [date, setDate] = useState(getCurrentDate());
    const [quotationNumber, setQuotationNumber] = useState('');
    const [invoiceTitle, setInvoiceTitle] = useState('');
    const [logoSrc, setLogoSrc] = useState(defaultLogoUrl);
    const [items, setItems] = useState<any[]>([]);
    const [notes, setNotes] = useState('');
    const [template, setTemplate] = useState(VISUAL_TEMPLATES.DIGITAL_MARKETING);
    const [customFields, setCustomFields] = useState<CustomField[]>([]);
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    const [isFormPopulated, setIsFormPopulated] = useState(false);

    const previewRef = useRef<HTMLDivElement>(null);

    const showNotification = (message: string, type = 'error') => {
        setNotification({ message, type });
    };

    // --- Effect for loading scripts ---
    useEffect(() => {
        // Load PDF scripts
        loadPdfScripts(
            () => setScriptsLoaded(true),
            (errorMsg) => showNotification(errorMsg, 'error')
        );
        
        // No DB listeners anymore
        return () => {};
    }, []);

    // --- Form Handlers ---
    const addItem = () => setItems([...items, { ...initialItem }]);
    
    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };
    
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const addCustomField = () =>
        setCustomFields((prev) => [...prev, { id: createFieldId(), label: '', value: '' }]);

    const updateCustomField = (
        fieldId: string,
        key: Exclude<keyof CustomField, 'id'>,
        value: string
    ) => {
        setCustomFields((prev) =>
            prev.map((field) => (field.id === fieldId ? { ...field, [key]: value } : field))
        );
    };

    const removeCustomField = (fieldId: string) =>
        setCustomFields((prev) => prev.filter((field) => field.id !== fieldId));

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoSrc(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const resetForm = () => {
        setCompanyName(''); setCompanyAddress(''); setCompanyEmail(''); setCompanyPhone('');
        setClientName(''); setClientCompany(''); setClientAddress('');
        setProjectSubject(''); setDate(getCurrentDate()); setQuotationNumber('');
        setItems([]); setNotes(''); setInvoiceTitle(''); setLogoSrc(defaultLogoUrl);
        setTemplate(Object.values(VISUAL_TEMPLATES)[0]);
        setCustomFields([]);
        setIsFormPopulated(false);
    };
    
    const loadContentTemplate = (templateConfig: (typeof CONTENT_TEMPLATES)[number]) => {
        const templateData = templateConfig.data;
        setCompanyName(templateData.companyName);
        setCompanyAddress(templateData.companyAddress);
        setCompanyEmail(templateData.companyEmail);
        setCompanyPhone(templateData.companyPhone);
        setClientName(templateData.clientName);
        setClientCompany(templateData.clientCompany);
        setClientAddress(templateData.clientAddress);
        setProjectSubject(templateData.projectSubject);
        setDate(templateData.date);
        setQuotationNumber(templateData.quotationNumber);
        setInvoiceTitle(templateData.invoiceTitle);
        setItems(templateData.items.map((item: any) => ({...item}))); // Deep copy
        setNotes(templateData.notes);
        setTemplate(templateData.template);
        setLogoSrc(templateData.logoSrc);
        setCustomFields(mapTemplateFields(templateData.customFields));
        setIsFormPopulated(true);
        showNotification(`${templateConfig.name} loaded!`, 'success');
    };

    // Removed loadInvoice - no database
    
    // --- Data for the preview component ---
    const previewData = useMemo(
        () => ({
            companyName,
            companyAddress,
            companyEmail,
            companyPhone,
            clientName,
            clientCompany,
            clientAddress,
            projectSubject,
            date,
            quotationNumber,
            items,
            notes,
            template,
            invoiceTitle,
            logoSrc,
            customFields,
        }),
        [
            companyName,
            companyAddress,
            companyEmail,
            companyPhone,
            clientName,
            clientCompany,
            clientAddress,
            projectSubject,
            date,
            quotationNumber,
            items,
            notes,
            template,
            invoiceTitle,
            logoSrc,
            customFields,
        ]
    );

    // --- Main Logic Handlers --- (no database writes)
    
    const handleGeneratePdf = async () => {
        if (isGenerating) return;
        setIsGenerating(true);

        const addressLine = (companyAddress?.split?.('\n')?.[0] || companyAddress || '').trim();
        const footerSegments = [addressLine, companyPhone.trim(), companyEmail.trim()].filter(Boolean);
        const footerLine = footerSegments.join(' • ') || 'CHV APPS · chvapps7@gmail.com';
        const invoiceMeta = {
            clientName,
            quotationNumber,
            invoiceNumber: quotationNumber,
            date,
            footerDetails: footerLine,
        };

        try {
            await generatePdf(
                previewRef,
                invoiceMeta,
                logoSrc,
                footerLine,
                undefined,
                (errorMsg) => showNotification(errorMsg, 'error')
            );
        } finally {
            setIsGenerating(false);
        }
    };
    
    const isButtonDisabled = isGenerating || !scriptsLoaded;

    const editorControlClass = 'w-full rounded-2xl border border-white/15 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition';
    const editorTextAreaClass = `${editorControlClass} min-h-[90px]`;

    const EditorSection = ({
        title,
        description,
        children,
    }: {
        title: string;
        description?: string;
        children: React.ReactNode;
    }) => (
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.45)]">
            <div className="mb-3 space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-300">{title}</p>
                {description && <p className="text-xs text-slate-400">{description}</p>}
            </div>
            <div className="space-y-3">{children}</div>
        </section>
    );

    // --- Main JSX Layout ---
    return (
        <>
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
            />
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
                <header className="border-b border-white/10 bg-black/30 backdrop-blur">
                    <div className="container mx-auto flex flex-col gap-2 px-4 py-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-cyan-400">CHV APPS</p>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Craft invoices inside the preview</h1>
                        <p className="text-sm text-slate-400 sm:text-base">
                            Load a storytelling template, edit inside the live canvas, and export a PDF with an automatic watermark.
                        </p>
                    </div>
                </header>
                <main className="container mx-auto px-4 py-10 space-y-10">
                    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.45)]">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-400">Start fast</p>
                                <h2 className="text-2xl font-semibold text-white">Pick a template narrative</h2>
                                <p className="text-sm text-slate-400">Each preset fills the canvas with sample content, styling, and highlights.</p>
                            </div>
                            {isFormPopulated && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="text-sm font-semibold text-red-300 transition hover:text-red-200"
                                >
                                    Clear current details
                                </button>
                            )}
                        </div>
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            {CONTENT_TEMPLATES.map((ct) => (
                                <button
                                    key={ct.name}
                                    type="button"
                                    onClick={() => loadContentTemplate(ct)}
                                    className="group rounded-2xl border border-white/15 bg-slate-900/40 p-4 text-left transition hover:border-cyan-400/60 hover:bg-slate-900/70"
                                >
                                    <p className="text-[10px] uppercase tracking-[0.5em] text-slate-500">{ct.data.invoiceTitle || 'Template'}</p>
                                    <p className="mt-3 text-lg font-semibold text-white">{ct.name}</p>
                                    <p className="mt-1 text-xs text-slate-400">{ct.data.projectSubject}</p>
                                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-cyan-300">
                                        Load preset →
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {isFormPopulated ? (
                        <section className="rounded-[40px] border border-white/10 bg-white/[0.08] p-6 shadow-[0_55px_160px_rgba(15,23,42,0.65)]">
                            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                                <div className="space-y-6">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-slate-400">Live preview</p>
                                            <h2 className="text-2xl font-semibold text-white">Edit and see changes instantly</h2>
                                        </div>
                                        <span className="rounded-full border border-cyan-300/40 px-3 py-1 text-xs font-semibold text-cyan-200">
                                            A4 · 210 × 297mm
                                        </span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <div className="mx-auto w-[210mm] min-h-[297mm]">
                                            <InvoicePreview ref={previewRef} data={previewData} />
                                        </div>
                                    </div>
                                </div>
                                <aside className="w-full">
                                    <div className="flex h-full flex-col rounded-[32px] border border-white/10 bg-slate-950/80 p-5 shadow-[0_45px_120px_rgba(2,6,23,0.9)]">
                                        <div className="mb-5 flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-[11px] uppercase tracking-[0.45em] text-slate-400">Live controls</p>
                                                <h3 className="text-xl font-semibold text-white">Edit details</h3>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-4 overflow-y-auto pr-1 sm:pr-2">
                                            <EditorSection title="Brand & Identity" description="Update logo and issuer details.">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                                                        <img src={logoSrc} alt="Brandmark" className="h-full w-full object-contain" />
                                                    </div>
                                                    <label className="inline-flex cursor-pointer items-center rounded-2xl border border-white/15 px-3 py-2 text-xs font-semibold text-white transition hover:border-cyan-300/60">
                                                        Change logo
                                                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                                                    </label>
                                                </div>
                                                <input className={editorControlClass} type="text" placeholder="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                                                <textarea className={editorTextAreaClass} placeholder="Company address" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} rows={2}></textarea>
                                                <input className={editorControlClass} type="email" placeholder="Email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
                                                <input className={editorControlClass} type="tel" placeholder="Phone" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
                                            </EditorSection>

                                            <EditorSection title="Client" description="Recipient and destination details.">
                                                <input className={editorControlClass} type="text" placeholder="Client name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                                                <input className={editorControlClass} type="text" placeholder="Client company" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} />
                                                <textarea className={editorTextAreaClass} placeholder="Client address" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} rows={2}></textarea>
                                            </EditorSection>

                                            <EditorSection title="Document" description="Title, project, schedule, and style.">
                                                <input className={editorControlClass} type="text" placeholder="Invoice title" value={invoiceTitle} onChange={(e) => setInvoiceTitle(e.target.value)} />
                                                <input className={editorControlClass} type="text" placeholder="Project subject" value={projectSubject} onChange={(e) => setProjectSubject(e.target.value)} />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input className={editorControlClass} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                                    <input className={editorControlClass} type="text" placeholder="Quote #" value={quotationNumber} onChange={(e) => setQuotationNumber(e.target.value)} />
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.values(VISUAL_TEMPLATES).map((style) => (
                                                        <button
                                                            key={style}
                                                            type="button"
                                                            onClick={() => setTemplate(style)}
                                                            className={`rounded-2xl border px-3 py-1 text-xs font-semibold transition ${
                                                                template === style
                                                                    ? 'border-cyan-300 bg-cyan-500/20 text-white'
                                                                    : 'border-white/10 text-slate-300 hover:border-cyan-200/40'
                                                            }`}
                                                        >
                                                            {style}
                                                        </button>
                                                    ))}
                                                </div>
                                            </EditorSection>

                                            <EditorSection title="Items & pricing" description="Line items power totals automatically.">
                                                <div className="space-y-3">
                                                    {items.length ? (
                                                        items.map((item, index) => (
                                                            <InvoiceItem
                                                                key={index}
                                                                item={item}
                                                                index={index}
                                                                updateItem={updateItem as any}
                                                                removeItem={removeItem}
                                                            />
                                                        ))
                                                    ) : (
                                                        <p className="text-xs text-slate-500">No services yet—add your first line item.</p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={addItem}
                                                    className="w-full rounded-2xl border border-dashed border-cyan-300/50 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200"
                                                >
                                                    + Add service line
                                                </button>
                                            </EditorSection>

                                            <EditorSection title="Narrative & highlights" description="Terms plus bespoke info cards shown in preview.">
                                                <textarea className={editorTextAreaClass} placeholder="Notes / terms" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}></textarea>
                                                <div className="space-y-3">
                                                    {customFields.length ? (
                                                        customFields.map((field) => (
                                                            <div key={field.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        className={editorControlClass}
                                                                        type="text"
                                                                        placeholder="Label"
                                                                        value={field.label}
                                                                        onChange={(e) => updateCustomField(field.id, 'label', e.target.value)}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeCustomField(field.id)}
                                                                        className="rounded-2xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-red-400 hover:text-red-200"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                                <input
                                                                    className={`${editorControlClass} mt-2`}
                                                                    type="text"
                                                                    placeholder="Value"
                                                                    value={field.value}
                                                                    onChange={(e) => updateCustomField(field.id, 'value', e.target.value)}
                                                                />
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-xs text-slate-500">Add quick highlights such as timelines, payment terms, or support windows.</p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={addCustomField}
                                                    className="w-full rounded-2xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/60"
                                                >
                                                    + Add highlight
                                                </button>
                                            </EditorSection>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleGeneratePdf}
                                            disabled={isButtonDisabled}
                                            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-cyan-400 px-6 py-3 text-sm font-bold uppercase tracking-[0.4em] text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isGenerating ? 'Generating…' : !scriptsLoaded ? 'Loading libs…' : 'Download PDF'}
                                        </button>
                                    </div>
                                </aside>
                            </div>
                        </section>
                    ) : (
                        <section className="rounded-[36px] border border-dashed border-white/20 bg-white/5 p-12 text-center shadow-[0_30px_90px_rgba(15,23,42,0.35)]">
                            <p className="text-2xl font-semibold text-white">Select a template to unlock inline editing.</p>
                            <p className="mt-2 text-sm text-slate-400">All configuration now happens beside the preview so every tweak stays in context.</p>
                        </section>
                    )}
                </main>
            </div>
        </>
    );
}