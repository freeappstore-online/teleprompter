
import { useState } from "react";

interface HomeProps {
  onStart: (script: string) => void;
  onSettings: () => void;
}

export default function Home({ onStart, onSettings }: HomeProps) {
  const [script, setScript] = useState("");

  const wordCount = script.trim()
    ? script.trim().split(/\s+/).length
    : 0;

  const characterCount = script.length;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setScript((previous) => previous + text);
      }
    } catch {
      alert("Unable to access clipboard. Please paste your text manually.");
    }
  };

  return (
    <main className="flex h-full min-h-0 flex-col overflow-hidden bg-[#111217] px-5 py-3 text-white">
      <div className="mx-auto flex w-full max-w-md min-h-0 flex-1 flex-col">

        {/* App Header */}
        <header className="mb-4 flex shrink-0 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#29233f] text-[#a78bfa]">
              ☰
            </div>
            <span className="text-sm font-medium">Teleprompter</span>
          </div>

          <button
            onClick={onSettings}
            aria-label="Open settings"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#20212a] text-lg text-gray-300 hover:bg-[#30303d]"
          >
            ⚙
          </button>
        </header>

        {/* Introduction */}
        <section className="mb-4 shrink-0">
          <h1 className="mb-2 text-xl font-medium tracking-tight">
            Ready to record?
          </h1>

          <p className="text-xs leading-relaxed text-gray-400">
            Find your words. Set your pace.
            <br />
            Speak with confidence.
          </p>
        </section>

        {/* Script Label */}
        <div className="mb-2 flex shrink-0 items-center justify-between">
          <label htmlFor="script" className="text-xs font-medium text-gray-200">
            Your script
          </label>

          <button
            onClick={() => setScript("")}
            disabled={!script}
            className="text-[11px] text-gray-500 transition hover:text-white disabled:opacity-40"
          >
            Clear script
          </button>
        </div>

        {/* Script Editor */}
        <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-[#292b34] bg-[#1d2028] p-3">
          <textarea
            id="script"
            value={script}
            onChange={(event) => setScript(event.target.value)}
            placeholder="Write or paste your script here..."
            className="min-h-0 w-full flex-1 resize-none bg-transparent text-sm leading-relaxed text-gray-200 outline-none placeholder:text-gray-500"
          />

          {!script && (
            <div className="shrink-0 pt-2 text-[11px] leading-relaxed text-gray-500">
              An opening line, a big idea, or your next story.
              <br />
              This is your space.

              <button
                onClick={handlePaste}
                className="mt-3 block rounded-md border border-[#39304f] px-2 py-1 text-[10px] text-[#b69aff] hover:bg-[#29233f]"
              >
                ▢ Paste text
              </button>
            </div>
          )}
        </div>

        {/* Word and Character Count */}
        <div className="my-2 flex shrink-0 justify-between text-[10px] text-gray-500">
          <span>{wordCount} words</span>
          <span>{characterCount} characters</span>
        </div>

        {/* Start Button */}
        <div className="shrink-0">
          <button
            onClick={() => onStart(script)}
            disabled={!script.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#a58af0] py-3 text-sm font-medium text-[#171321] transition hover:bg-[#b69df9] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>▷</span>
            Start Teleprompter
          </button>

          <p className="mt-2 text-center text-[10px] text-gray-500">
            Add a script to begin your next take.
          </p>
        </div>
      </div>
    </main>
  );
}
