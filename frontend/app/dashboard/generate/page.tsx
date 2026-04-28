"use client";

import { useEffect, useMemo, useState } from "react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { HistoryTable } from "@/components/HistoryTable";
import { UsageCard } from "@/components/UsageCard";
import { createGeneration, getHistory, getJob } from "@/lib/api";
import { VOICES } from "@/lib/constants";
import { HistoryItem } from "@/lib/types";

const MAX_CHARS = 1000;

export default function GeneratePage() {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [selectedSpeed, setSelectedSpeed] = useState(1.0);
  const [status, setStatus] = useState<"idle" | "queued" | "processing" | "completed" | "failed">("idle");
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [quality, setQuality] = useState<"standard" | "emotional">("standard");

  const remaining = useMemo(() => MAX_CHARS - text.length, [text.length]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getHistory();
        setHistoryItems(data.items.slice(0, 5));
      } catch {
        setHistoryItems([]);
      }
    }
    loadHistory();
  }, [status]);

  async function pollJob(jobId: string) {
    const started = Date.now();
    while (Date.now() - started < 20000) {
      const job = await getJob(jobId);
      setStatus(job.status);
      if (job.status === "completed" && job.audio_url) {
        setAudioUrl(job.audio_url);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    throw new Error("Generation timed out.");
  }

  async function onGenerate() {
    try {
      setError("");
      setAudioUrl("");
      setStatus("queued");
      const created = await createGeneration(text, selectedVoice, selectedSpeed);
      setStatus(created.status);
      await pollJob(created.job_id);
    } catch (generationError) {
      setStatus("failed");
      setError(generationError instanceof Error ? generationError.message : "Unable to generate audio.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-white">Text to Speech Generator</h1>
        <span className="rounded border border-white/10 bg-[#1d2632] px-3 py-1 text-xs text-slate-300">
          Привет, Mustafa!
        </span>
      </div>
      <UsageCard used={18340 + text.length} limit={100000} unlimited />

      <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Качество генерации</p>
        <div className="flex rounded-md border border-white/10 bg-[#151d27] p-1">
          <button
            onClick={() => setQuality("standard")}
            className={`w-full rounded py-1.5 text-xs ${
              quality === "standard" ? "bg-[#2b3642] text-white" : "text-slate-400"
            }`}
          >
            Стандартная
          </button>
          <button
            onClick={() => setQuality("emotional")}
            className={`w-full rounded py-1.5 text-xs ${
              quality === "emotional" ? "bg-[#2b3642] text-[#f4de63]" : "text-slate-400"
            }`}
          >
            Эмоциональная
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          {quality === "emotional"
            ? "Больше выразительности и акцентов в голосе."
            : "Стабильная нейтральная озвучка для любого контента."}
        </p>

        <label className="mb-2 mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-400">Голос</label>
        <select
          value={selectedVoice}
          onChange={(event) => setSelectedVoice(event.target.value)}
          className="w-full rounded-md border border-white/10 bg-[#121922] px-3 py-2 text-sm text-white"
        >
          {VOICES.map((voice) => (
            <option key={voice.id} value={voice.id}>
              {voice.name} ({voice.accent} - {voice.tone})
            </option>
          ))}
        </select>

        <label className="mb-2 mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-400">Скорость</label>
        <div className="rounded-md border border-white/10 bg-[#121922] px-3 py-3">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>0.50</span>
            <span className="font-semibold text-[#f4de63]">{selectedSpeed.toFixed(2)}</span>
            <span>1.50</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.05}
            value={selectedSpeed}
            onChange={(event) => setSelectedSpeed(Number(event.target.value))}
            className="h-2 w-full cursor-pointer accent-[#f4de63]"
          />
        </div>
        <input
          type="number"
          min={0.5}
          max={1.5}
          step={0.05}
          value={selectedSpeed}
          onChange={(event) => {
            const value = Number(event.target.value);
            if (!Number.isNaN(value)) {
              setSelectedSpeed(Math.min(1.5, Math.max(0.5, value)));
            }
          }}
          className="w-full rounded-md border border-white/10 bg-[#121922] px-3 py-2 text-sm text-white"
        />
      </div>

      <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm text-slate-300">Текст для озвучки</label>
          <p className="text-xs text-slate-400">{text.length} символов</p>
        </div>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, MAX_CHARS))}
          className="h-44 w-full rounded-md border border-white/10 bg-[#11161f] p-3 text-white"
          placeholder="Введите текст, система сама расставит знаки и озвучит его..."
        />
        <p className="mt-2 text-xs text-slate-400">{remaining} characters remaining</p>
      </div>

      <button
        disabled={!text.trim() || status === "queued" || status === "processing"}
        onClick={onGenerate}
        className="w-full rounded-md bg-[#f4de63] px-5 py-3 font-semibold text-[#1e2229] disabled:cursor-not-allowed disabled:bg-slate-500"
      >
        {status === "queued" || status === "processing" ? "Generating..." : "Озвучить"}
      </button>

      <p className="text-sm capitalize text-slate-300">Status: {status}</p>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {audioUrl && <AudioPlayer url={audioUrl} />}

      <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
        <p className="mb-3 text-xl font-semibold text-white">История озвучек</p>
        <HistoryTable items={historyItems} />
      </div>
    </div>
  );
}
