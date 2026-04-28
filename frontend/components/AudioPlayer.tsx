type AudioPlayerProps = {
  url: string;
};

export function AudioPlayer({ url }: AudioPlayerProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
      <p className="mb-3 text-sm font-medium text-white">Generated audio</p>
      <audio controls className="w-full">
        <source src={url} />
      </audio>
      <a
        href={url}
        download
        className="mt-3 inline-block rounded-md bg-[#f4de63] px-4 py-2 text-sm font-semibold text-[#1e2229] transition hover:bg-[#f0d749]"
      >
        Download audio
      </a>
    </div>
  );
}
