import React from 'react';

export const DigitalMarketingTemplate = ({ data, total }: { data: any; total: number }) => {
    const subtotal = data.items.reduce(
        (acc: number, item: any) => acc + (item.cost || 0) * (item.quantity || 1),
        0
    );
    const tax = subtotal * 0.18;
    const addressLine = data.companyAddress?.split?.('\n')?.[0] || data.companyAddress || '';

    return (
        <div className="font-sans text-[15px] leading-relaxed text-slate-800 space-y-10">
            <header className="glass-panel bg-gradient-to-br from-emerald-50 via-cyan-50 to-indigo-50">
                <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            {data.logoSrc && (
                                <div className="h-14 w-14 rounded-2xl bg-white/70 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                                    <img src={data.logoSrc} alt="Company Logo" className="h-10 object-contain" />
                                </div>
                            )}
                            <div>
                                <p className="section-label text-emerald-500/80">Studio</p>
                                <h1 className="text-3xl font-semibold text-slate-900">{data.companyName}</h1>
                                <p className="text-sm text-slate-500">Growth & integrated campaigns</p>
                            </div>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                            {addressLine && <p>{addressLine}</p>}
                            <p>
                                {data.companyPhone} · {data.companyEmail}
                            </p>
                        </div>
                    </div>
                    <div className="text-right space-y-3">
                        <p className="section-label text-cyan-600">Proposal</p>
                        <p className="text-3xl font-semibold">{data.invoiceTitle || 'Campaign Quotation'}</p>
                        <div className="text-sm text-slate-600 space-y-1">
                            <p>
                                <span className="text-slate-500 mr-2">Date</span>
                                {data.date || 'YYYY-MM-DD'}
                            </p>
                            <p>
                                <span className="text-slate-500 mr-2">Quote #</span>
                                {data.quotationNumber || ' '}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="soft-divider mt-6" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
                    <div>
                        <p className="section-label text-emerald-500/80">Client</p>
                        <p className="text-2xl font-semibold text-slate-900">{data.clientName || 'Client Name'}</p>
                        {data.clientCompany && <p className="text-sm text-slate-500">{data.clientCompany}</p>}
                        {data.clientAddress && (
                            <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{data.clientAddress}</p>
                        )}
                    </div>
                    <div>
                        <p className="section-label text-cyan-600">Campaign</p>
                        <p className="text-base font-semibold text-slate-900">{data.projectSubject || 'Project Subject'}</p>
                        {data.notes && (
                            <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">{data.notes}</p>
                        )}
                    </div>
                </div>
            </header>

            {data.customFields?.length > 0 && (
                <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {data.customFields.map((field: any) => (
                        <div key={field.id || field.label} className="glass-panel-soft">
                            <p className="section-label text-emerald-500/80">{field.label || 'Detail'}</p>
                            <p className="text-lg font-semibold text-slate-900">{field.value || '—'}</p>
                        </div>
                    ))}
                </section>
            )}

            <section className="glass-panel-soft space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="section-label text-emerald-500/80">Scope & Channels</p>
                    <span className="rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold text-emerald-700">
                        Full Funnel
                    </span>
                </div>
                <div className="space-y-3">
                    {data.items.map((item: any, i: number) => {
                        const lineTotal = (item.cost || 0) * (item.quantity || 1);
                        return (
                            <div
                                key={i}
                                className="rounded-3xl border border-white/60 bg-white/80 px-5 py-4 shadow-lg shadow-emerald-500/5"
                            >
                                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                                    <div className="flex-1">
                                        <p className="text-lg font-semibold text-slate-900">{item.service}</p>
                                        {item.description && (
                                            <p className="text-sm text-slate-600 whitespace-pre-line">{item.description}</p>
                                        )}
                                    </div>
                                    <div className="text-right min-w-[160px]">
                                        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Retainer</p>
                                        <p className="text-2xl font-semibold text-slate-900">
                                            ₹{lineTotal.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="glass-panel-soft space-y-4">
                    <p className="section-label text-cyan-600">Success Metrics</p>
                    <p className="text-sm text-slate-600">
                        We pair creative experimentation with data-backed optimization to increase qualified leads, conversion rate,
                        and retention. Reporting cadence: weekly pulse + monthly deep dive.
                    </p>
                </div>
                <div className="glass-panel-soft space-y-4">
                    <div className="space-y-3 text-sm text-slate-600">
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
                    <div className="total-highlight bg-gradient-to-br from-emerald-600 via-emerald-700 to-cyan-700">
                        <p className="text-xs uppercase tracking-[0.5em] text-white/70">Total Commitment</p>
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