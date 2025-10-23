import React from 'react';
import { VISUAL_TEMPLATES } from '../App'; // We'll export this from App.tsx

// Import your separated template components
import { DigitalMarketingTemplate } from './DigitalMarketingTemplate';
import { FormalTemplate } from './FormalTemplate';
import { AgreementTemplate } from './AgreementTemplates';
import { ModernTemplate } from './ModernTemplate';

interface InvoicePreviewProps {
    data: any;
}

const InvoicePreview = React.forwardRef<HTMLDivElement, InvoicePreviewProps>(({ data }, ref) => {
    const { items, template } = data;
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.cost || 0) * (item.quantity || 1), 0);
    const tax = subtotal * 0.18; 
    const total = subtotal + tax;

    const renderTemplate = () => {
        switch (template) {
            case VISUAL_TEMPLATES.DIGITAL_MARKETING:
                return <DigitalMarketingTemplate data={data} total={total} />;
            case VISUAL_TEMPLATES.FORMAL:
                return <FormalTemplate data={data} subtotal={subtotal} tax={tax} total={total} />;
            case VISUAL_TEMPLATES.AGREEMENT:
                return <AgreementTemplate data={data} total={total} />;
            case VISUAL_TEMPLATES.MODERN:
            default:
                return <ModernTemplate data={data} total={total} />;
        }
    };

    return (
        <div ref={ref} className="p-8 bg-white shadow-lg rounded-xl">
            {renderTemplate()}
        </div>
    );
});

export default InvoicePreview;