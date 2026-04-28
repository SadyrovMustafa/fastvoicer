"use client";

import { useEffect, useState } from "react";
import { HistoryTable } from "@/components/HistoryTable";
import { UsageCard } from "@/components/UsageCard";
import { getHistory } from "@/lib/api";
import { HistoryItem } from "@/lib/types";

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [usage, setUsage] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await getHistory();
        setItems(response.items);
        setUsage(response.total_characters);
      } catch (historyError) {
        setError(historyError instanceof Error ? historyError.message : "Failed to load history.");
      }
    }
    loadHistory();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-white">Audio history</h1>
      <UsageCard used={usage} limit={100000} unlimited />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
        <HistoryTable items={items} />
      </div>
    </div>
  );
}
