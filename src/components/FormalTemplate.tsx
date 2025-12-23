import React from 'react';

export const FormalTemplate = ({ data, subtotal, tax, total }: { data: any; subtotal: number; tax: number; total: number }) => {
    const addressLine = data.companyAddress?.split?.('\n')?.[0] || data.companyAddress || '';

    return (
        <div className="font-serif text-[15px] leading-relaxed text-slate-900 space-y-10">
            <header className="glass-panel text-center space-y-3">
                <p className="section-label">Official Quotation</p>
                <h1 className="text-4xl font-semibold tracking-wide">{data.invoiceTitle || 'Price Quotation'}</h1>
                <p className="text-sm text-slate-500">
                    {data.companyName} · {data.companyPhone} · {data.companyEmail}
                </p>
            </header>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="glass-panel-soft space-y-3">
                    <p className="section-label">Client</p>
                    <div>
                        <p className="text-2xl font-semibold">{data.clientName || 'Client Name'}</p>
                        {data.clientCompany && <p className="text-sm text-slate-500">{data.clientCompany}</p>}
                        {data.clientAddress && (
                            <p className="mt-3 whitespace-pre-line text-sm text-slate-600">{data.clientAddress}</p>
                        )}
                    </div>
                </div>
                <div className="glass-panel-soft space-y-3">
                    <p className="section-label">Details</p>
                    <div className="space-y-2 text-sm text-slate-600">
                        <p>
                            <span className="text-slate-500 mr-2">Date</span>
                            {data.date || 'YYYY-MM-DD'}
                        </p>
                        <p>
                            <span className="text-slate-500 mr-2">Quote #</span>
                            {data.quotationNumber || '001'}
                        </p>
                        <p className="text-base font-semibold text-slate-900">
                            {data.projectSubject || 'Project Subject'}
                        </p>
                    </div>
                </div>
            </section>

            {data.customFields?.length > 0 && (
                <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {data.customFields.map((field: any) => (
                        <div key={field.id || field.label} className="muted-card">
                            <p className="section-label">{field.label || 'Detail'}</p>
                            <p className="text-base font-semibold text-slate-900">{field.value || '—'}</p>
                        </div>
                    ))}
                </section>
            )}

            <section className="glass-panel-soft space-y-6">
                <div>
                    <p className="section-label">Line Items</p>
                    <h3 className="text-2xl font-semibold">Scope & Investment</h3>
                </div>
                <table className="w-full border-separate border-spacing-y-3 text-sm">
                    <thead>
                        <tr className="text-left text-[11px] uppercase tracking-[0.35em] text-slate-500">
                            <th className="py-2 pr-3">Service</th>
                            <th className="py-2 pr-3 text-right">Qty</th>
                            <th className="py-2 pr-3 text-right">Rate</th>
                            <th className="py-2 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item: any, i: number) => (
                            <tr key={i} className="text-base">
                                <td className="rounded-l-2xl bg-white/80 px-4 py-4 align-top shadow-md shadow-black/5">
                                    <p className="font-semibold text-slate-900">{item.service}</p>
                                    {item.description && (
                                        <p className="text-xs text-slate-500 whitespace-pre-line">{item.description}</p>
                                    )}
                                </td>
                                <td className="bg-white/80 px-4 py-4 text-right shadow-md shadow-black/5">
                                    {item.quantity || 1}
                                </td>
                                <td className="bg-white/80 px-4 py-4 text-right shadow-md shadow-black/5">
                                    ₹{(item.cost || 0).toLocaleString('en-IN')}
                                </td>
                                <td className="rounded-r-2xl bg-white/80 px-4 py-4 text-right font-semibold text-slate-900 shadow-md shadow-black/5">
                                    ₹{((item.cost || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="glass-panel-soft space-y-3">
                    <p className="section-label">Observations</p>
                    <p className="text-sm text-slate-600 whitespace-pre-line">
                        {data.notes || 'Pricing valid for 15 days from the issue date. Work commences upon formal approval and initial onboarding payment.'}
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
                    <div className="total-highlight">
                        <p className="text-xs uppercase tracking-[0.5em] text-white/70">Total</p>
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