import React from 'react';

interface Item {
    service: string;
    description: string;
    cost: number;
    quantity: number;
}

interface InvoiceItemProps {
    item: Item;
    index: number;
    updateItem: (index: number, field: keyof Item, value: any) => void;
    removeItem: (index: number) => void;
}

const InvoiceItem: React.FC<InvoiceItemProps> = ({ item, index, updateItem, removeItem }) => {
    const handleNumberChange = (value: string, field: 'cost' | 'quantity') => {
        const parsed = field === 'quantity' ? parseInt(value, 10) : parseFloat(value);
        const safeValue = Number.isFinite(parsed) ? parsed : 0;
        updateItem(index, field, safeValue);
    };

    return (
        <div className="rounded-2xl border border-white/15 bg-slate-950/40 p-4 text-slate-100 shadow-[0_12px_30px_rgba(2,6,23,0.6)]">
            <div className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                    <input
                        type="text"
                        placeholder="Service"
                        value={item.service}
                        onChange={(e) => updateItem(index, 'service', e.target.value)}
                        className="w-full rounded-2xl border border-white/15 bg-transparent px-3 py-2 text-sm font-semibold text-white placeholder-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                    />
                    <textarea
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full min-h-[72px] rounded-2xl border border-white/15 bg-transparent px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                    ></textarea>
                </div>
                <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded-2xl border border-white/15 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-red-400 hover:text-red-200"
                >
                    Remove
                </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Rate</p>
                    <input
                        type="number"
                        placeholder="0"
                        value={item.cost}
                        onChange={(e) => handleNumberChange(e.target.value, 'cost')}
                        className="mt-1 w-full rounded-2xl border border-white/15 bg-transparent px-3 py-2 text-sm text-slate-100 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                    />
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Qty</p>
                    <input
                        type="number"
                        placeholder="1"
                        value={item.quantity}
                        onChange={(e) => handleNumberChange(e.target.value, 'quantity')}
                        className="mt-1 w-full rounded-2xl border border-white/15 bg-transparent px-3 py-2 text-sm text-slate-100 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                    />
                </div>
            </div>
        </div>
    );
};

export default InvoiceItem;