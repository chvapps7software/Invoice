import React from 'react';

export const WebsiteTemplate = ({ data, subtotal, tax, total }: { data: any; subtotal: number; tax: number; total: number }) => {
	const addressLine = data.companyAddress?.split?.('\n')?.[0] || data.companyAddress || '';

	return (
		<div className="font-sans text-[15px] leading-relaxed text-slate-800 space-y-10">
			<header className="glass-panel space-y-6">
				<div className="flex flex-wrap items-center justify-between gap-6">
					<div>
						<p className="section-label">Studio</p>
						<h1 className="text-4xl font-semibold text-slate-900">{data.companyName}</h1>
						<p className="text-sm text-slate-500">Crafting web experiences & platforms</p>
					</div>
					<div className="text-right">
						<p className="section-label">Quotation</p>
						<p className="text-4xl font-semibold text-slate-900">{data.invoiceTitle || 'Website Proposal'}</p>
						<p className="text-sm text-slate-600 mt-2">
							Subject · {data.projectSubject || 'Project Subject'}
						</p>
						<p className="text-sm text-slate-600">
							Date · {data.date || 'YYYY-MM-DD'}
						</p>
						<p className="text-sm text-slate-600">Quote #{data.quotationNumber || '-'}</p>
					</div>
				</div>
				<div className="soft-divider" />
				<div className="flex flex-wrap justify-between gap-3 text-sm text-slate-500">
					{addressLine && <span>{addressLine}</span>}
					<span>{data.companyPhone}</span>
					<span>{data.companyEmail}</span>
				</div>
			</header>

			{data.customFields?.length > 0 && (
				<section className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{data.customFields.map((field: any) => (
						<div key={field.id || field.label} className="muted-card">
							<p className="section-label">{field.label || 'Detail'}</p>
							<p className="text-lg font-semibold text-slate-900">{field.value || '—'}</p>
						</div>
					))}
				</section>
			)}

			<section className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div className="glass-panel-soft space-y-3">
					<p className="section-label">Client</p>
					<p className="text-2xl font-semibold">{data.clientName}</p>
					{data.clientCompany && <p className="text-sm text-slate-500">{data.clientCompany}</p>}
					{data.clientAddress && (
						<p className="whitespace-pre-line text-sm text-slate-600">{data.clientAddress}</p>
					)}
				</div>
				<div className="glass-panel-soft space-y-3">
					<p className="section-label">Experience Goals</p>
					<p className="text-sm text-slate-600 whitespace-pre-line">
						{data.notes || 'Responsive layout, lightning-fast performance, and immersive storytelling across every touchpoint.'}
					</p>
				</div>
			</section>

			<section className="glass-panel-soft space-y-5">
				<div>
					<p className="section-label">Modules</p>
					<h3 className="text-2xl font-semibold">Scope & Investment</h3>
				</div>
				<table className="w-full border-separate border-spacing-y-3 text-sm">
					<thead>
						<tr className="text-left text-[11px] uppercase tracking-[0.35em] text-slate-500">
							<th className="py-2 pr-3">Service</th>
							<th className="py-2 text-right">Amount</th>
						</tr>
					</thead>
					<tbody>
						{data.items.map((item: any, i: number) => (
							<tr key={i}>
								<td className="rounded-l-2xl bg-white/75 px-4 py-4 align-top shadow-md shadow-black/5">
									<p className="text-base font-semibold text-slate-900">{item.service}</p>
									{item.description && (
										<p className="text-xs text-slate-500 whitespace-pre-line">{item.description}</p>
									)}
								</td>
								<td className="rounded-r-2xl bg-white/75 px-4 py-4 text-right text-lg font-semibold text-slate-900 shadow-md shadow-black/5">
									₹{(item.cost || 0).toLocaleString('en-IN')}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>

			<section className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div className="glass-panel-soft space-y-4">
					<p className="section-label">Timeline</p>
					<p className="text-sm text-slate-600">
						Design & prototyping · 3 weeks · Development & QA · 4 weeks · Launch & optimization · 2 weeks.
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
					{data.companyName} · {addressLine}
				</p>
				<p>
					{data.companyPhone} · {data.companyEmail}
				</p>
			</footer>
		</div>
	);
};
