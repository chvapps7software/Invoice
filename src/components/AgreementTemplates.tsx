import React from 'react';

export const AgreementTemplate = ({ data, total }: { data: any; total: number }) => {
    const subtotal = data.items.reduce(
        (acc: number, item: any) => acc + (item.cost || 0) * (item.quantity || 1),
        0
    );
    const tax = subtotal * 0.18;
    const addressLine = data.companyAddress?.split?.('\n')?.[0] || data.companyAddress || '';

    return (
        <div className="font-serif text-[15px] leading-relaxed text-slate-800 space-y-8">
            <header className="glass-panel space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {data.logoSrc && <img src={data.logoSrc} alt="Company Logo" className="h-16 object-contain" />}
                        <div>
                            <p className="section-label">Agreement</p>
                            <h1 className="text-3xl font-semibold text-slate-900">{data.companyName}</h1>
                        </div>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                        <p>Date · {data.date || 'YYYY-MM-DD'}</p>
                        <p>Reference · {data.quotationNumber || '001'}</p>
                    </div>
                </div>
                <div className="soft-divider" />
                <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                    {addressLine && <span>{addressLine}</span>}
                    <span>{data.companyPhone}</span>
                    <span>{data.companyEmail}</span>
                </div>
            </header>

            <section className="glass-panel-soft space-y-4">
                <p className="section-label">Parties</p>
                <p>
                    This agreement is made on <strong>{data.date || 'Date'}</strong> between <strong>{data.companyName}</strong> (“Company”) and{' '}
                    <strong>{data.clientName || 'Client'}</strong> (“Client”).
                </p>
            </section>

            <section className="glass-panel-soft space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">1. Scope of Work</h2>
                <p>
                    The Company will deliver services for <strong>{data.projectSubject || 'Project Subject'}</strong>, covering the modules listed
                    below.
                </p>
                <div className="space-y-2">
                    {data.items.map((item: any, i: number) => (
                        <div key={i} className="rounded-2xl bg-white/70 px-4 py-3 shadow-inner shadow-white/40">
                            <p className="font-semibold text-slate-900">{item.service}</p>
                            {item.description && (
                                <p className="text-sm text-slate-600 whitespace-pre-line">{item.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="glass-panel-soft space-y-5">
                <h2 className="text-xl font-semibold text-slate-900">2. Payment</h2>
                <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                        <span>Subtotal</span>
                        <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')} INR</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>GST (18%)</span>
                        <span className="font-semibold text-slate-900">₹{tax.toLocaleString('en-IN')} INR</span>
                    </div>
                    <div className="soft-divider" />
                </div>
                <div className="total-highlight">
                    <p className="text-xs uppercase tracking-[0.5em] text-white/70">Total Value</p>
                    <p className="text-4xl font-semibold leading-tight">₹{total.toLocaleString('en-IN')} INR</p>
                </div>
                <p>
                    The total investment for the services described is <strong>₹{total.toLocaleString('en-IN')} INR</strong>, inclusive of GST.
                </p>
            </section>

            {data.customFields?.length > 0 && (
                <section className="glass-panel-soft space-y-3">
                    <h2 className="text-xl font-semibold text-slate-900">Additional Highlights</h2>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {data.customFields.map((field: any) => (
                            <div key={field.id || field.label} className="muted-card">
                                <p className="section-label">{field.label || 'Detail'}</p>
                                <p className="text-base font-semibold text-slate-900">{field.value || '—'}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="glass-panel-soft space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">3. Maintenance & Support</h2>
                <p>{data.notes || 'Maintenance windows and SLAs will be confirmed post-launch and documented as an addendum if required.'}</p>
            </section>

            <section className="glass-panel-soft grid grid-cols-1 gap-10 md:grid-cols-2">
                <div className="space-y-6">
                    <p className="section-label">For Company</p>
                    <div className="soft-divider" />
                    <p className="text-sm text-slate-600">{data.companyName}</p>
                    <p className="text-sm text-slate-400">Authorised Signatory</p>
                </div>
                <div className="space-y-6">
                    <p className="section-label">For Client</p>
                    <div className="soft-divider" />
                    <p className="text-sm text-slate-600">{data.clientName || 'Client Name'}</p>
                    <p className="text-sm text-slate-400">Authorised Signatory</p>
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