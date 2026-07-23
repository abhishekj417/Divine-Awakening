export function Select({ label, value, options, onChange }: any) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1">{label}</label>
      <select className="w-full border rounded px-2 py-1" value={value} onChange={e => onChange(e.target.value)}>
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
export function Text({ label, value, onChange, area }: any) {
  return (
    <div className={area ? "col-span-2" : ""}>
      <label className="text-xs font-semibold block mb-1">{label}</label>
      {area
        ? <textarea className="w-full border rounded px-2 py-1" value={value} onChange={(e:any) => onChange(e.target.value)} />
        : <input className="w-full border rounded px-2 py-1" value={value} onChange={(e:any) => onChange(e.target.value)} />}
    </div>
  );
}
export function NumberInput({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1">{label}</label>
      <input type="number" min={1} max={5} className="w-full border rounded px-2 py-1" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
export function DateInput({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1">{label}</label>
      <input type="date" className="w-full border rounded px-2 py-1" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
