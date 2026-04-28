import { HistoryItem } from "@/lib/types";

type HistoryTableProps = {
  items: HistoryItem[];
};

export function HistoryTable({ items }: HistoryTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1b2430]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#252f3b] text-slate-300">
          <tr>
            <th className="px-4 py-3">Text</th>
            <th className="px-4 py-3">Voice</th>
            <th className="px-4 py-3">Speed</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Audio</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td className="px-4 py-5 text-slate-400" colSpan={5}>
                No generations yet.
              </td>
            </tr>
          )}
          {items.map((item) => (
            <tr key={item.job_id} className="border-t border-white/10 text-slate-200">
              <td className="max-w-xs truncate px-4 py-3">{item.text}</td>
              <td className="px-4 py-3">{item.voice}</td>
              <td className="px-4 py-3">{item.speed.toFixed(2)}x</td>
              <td className="px-4 py-3 capitalize">{item.status}</td>
              <td className="px-4 py-3">
                {item.audio_url ? (
                  <a href={item.audio_url} className="text-[#f4de63] hover:text-[#f0d749]">
                    Listen
                  </a>
                ) : (
                  <span className="text-slate-500">Pending</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
