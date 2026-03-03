export function Table({ columns, rows, rowKey }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 text-left font-semibold">
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.map((r) => (
            <tr key={rowKey(r)} className="border-t border-line">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-slate-800 align-top">
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
