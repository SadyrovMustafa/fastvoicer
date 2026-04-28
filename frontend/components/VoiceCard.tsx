import { VoiceOption } from "@/lib/types";

type VoiceCardProps = {
  voice: VoiceOption;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function VoiceCard({ voice, selected, onSelect }: VoiceCardProps) {
  return (
    <button
      onClick={() => onSelect(voice.id)}
      className={`rounded-xl border p-3 text-left transition ${
        selected
          ? "border-brand-500 bg-brand-500/10"
          : "border-white/10 bg-[#0f1526] hover:border-white/25"
      }`}
    >
      <p className="font-medium text-white">{voice.name}</p>
      <p className="mt-1 text-xs text-slate-400">
        {voice.accent} • {voice.tone}
      </p>
    </button>
  );
}
