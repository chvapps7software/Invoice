import React from 'react';

export const ModernTemplate = ({ data, total }: { data: any; total: number }) => {
    const subtotal = data.items.reduce(
        (acc: number, item: any) => acc + (item.cost || 0) * (item.quantity || 1),
        0
    );
    const tax = subtotal * 0.18;
    const addressLine = data.companyAddress?.split?.('\n')?.[0] || data.companyAddress || '';

    return (
        <div className="font-sans text-[15px] leading-relaxed text-slate-800 space-y-10">
            <header className="glass-panel space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-2xl bg-white/60 shadow-inner shadow-white/40 flex items-center justify-center">
                            {data.logoSrc ? (
                                <img src={data.logoSrc} alt="Company Logo" className="h-12 w-12 object-contain" />
                            ) : (
                                <span className="text-xs uppercase tracking-[0.4em] text-slate-500">Logo</span>
                            )}
                        </div>
                        <div>
                            <p className="section-label mb-1">Issued By</p>
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                                {data.companyName || 'Your Company'}
                            </h1>
                            <p className="text-sm text-slate-500">Your vision, our innovation</p>
                        </div>
                    </div>
                    <div className="text-right space-y-2">
                        <p className="section-label">Quotation</p>
                        <p className="text-2xl font-semibold text-slate-900">{data.invoiceTitle || 'Project Quotation'}</p>
                        <div className="text-sm text-slate-600 space-y-1">
                            <p>
                                <span className="text-slate-500 mr-2">Date</span>
                                {data.date || 'YYYY-MM-DD'}
                            </p>
                            <p>
                                <span className="text-slate-500 mr-2">Quote #</span>
                                {data.quotationNumber || '001'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="soft-divider" />
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                    {addressLine && <span>{addressLine}</span>}
                    {data.companyPhone && <span>{data.companyPhone}</span>}
                    {data.companyEmail && <span>{data.companyEmail}</span>}
                </div>
            </header>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-5">
                <div className="glass-panel-soft md:col-span-3 space-y-4">
                    <p className="section-label">Invoice To</p>
                    <div>
                        <p className="text-2xl font-semibold text-slate-900">{data.clientName || 'Client Name'}</p>
                        {data.clientCompany && <p className="text-sm text-slate-500">{data.clientCompany}</p>}
                        {data.clientAddress && (
                            <p className="mt-3 whitespace-pre-line text-sm text-slate-500/90">{data.clientAddress}</p>
                        )}
                    </div>
                </div>
                <div className="glass-panel-soft md:col-span-2 space-y-3">
                    <p className="section-label">Project</p>
                    <div className="space-y-2">
                        <p className="text-base font-semibold text-slate-900">{data.projectSubject || 'Project Subject'}</p>
                        {data.notes && (
                            <p className="text-sm text-slate-500 whitespace-pre-line">{data.notes}</p>
                        )}
                    </div>
                </div>
            </section>

            {data.customFields?.length > 0 && (
                <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {data.customFields.map((field: any) => (
                        <div key={field.id || field.label} className="muted-card">
                            <p className="section-label">{field.label || 'Highlight'}</p>
                            <p className="text-lg font-semibold text-slate-900">{field.value || '—'}</p>
                        </div>
                    ))}
                </section>
            )}

            <section className="glass-panel-soft space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="section-label">Scope Of Services</p>
                        <h3 className="text-xl font-semibold text-slate-900">Deliverables & Investment</h3>
                    </div>
                    <p className="text-sm text-slate-500">Values are inclusive of all service efforts.</p>
                </div>
                <div className="space-y-3">
                    {data.items.map((item: any, i: number) => {
                        const lineTotal = (item.cost || 0) * (item.quantity || 1);
                        return (
                            <div
                                key={i}
                                className="rounded-2xl bg-white/75 px-5 py-4 shadow-inner shadow-white/40 flex flex-col gap-3 md:flex-row md:items-start"
                            >
                                <div className="flex-1 space-y-2">
                                    <p className="text-lg font-semibold text-slate-900">{item.service || 'Service'}</p>
                                    {item.description && (
                                        <p className="text-sm text-slate-500 whitespace-pre-line">{item.description}</p>
                                    )}
                                    <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
                                        Qty {item.quantity || 1} · Rate ₹{(item.cost || 0).toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div className="text-right md:w-40">
                                    <p className="text-2xl font-semibold text-slate-900">
                                        ₹{lineTotal.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-5">
                <div className="glass-panel-soft md:col-span-3 space-y-4">
                    <p className="section-label">Engagement Notes</p>
                    <p className="text-sm text-slate-500 whitespace-pre-line">
                        {data.notes ||
                            'We appreciate the opportunity to partner with you. Acceptance of this quotation confirms the commencement timeline and deliverable milestones indicated above.'}
                    </p>
                </div>
                <div className="glass-panel-soft md:col-span-2 space-y-4">
                    <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center justify-between">
                            <span>Subtotal</span>
                            <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>GST (18%)</span>
                            <span className="font-semibold text-slate-900">₹{tax.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="soft-divider" />
                    </div>
                    <div className="total-highlight text-center">
                        <p className="uppercase text-xs tracking-[0.5em] text-white/70">Total Investment</p>
                        <p className="text-4xl font-semibold leading-tight">₹{total.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </section>

            <footer className="no-print-footer text-center text-xs text-slate-500/80">
                <p>
                    {addressLine && `${addressLine} · `}
                    {data.companyPhone} · {data.companyEmail}
                </p>
            </footer>
        </div>
    );
};