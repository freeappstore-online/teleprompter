
import { useEffect, useRef, useState } from "react";

interface TeleprompterProps {
  script: string;
  onClose: () => void;
  onSettings: () => void;
  textSize: number;
  speed: number;
  showGuide: boolean;
  mirrorText: boolean;
  fullScreen: boolean;
  onFullScreenChange: (value: boolean) => void;
}

export default function Teleprompter({
  script,
  onClose,
  onSettings,
  textSize,
  speed,
  showGuide,
  mirrorText,
  fullScreen,
  onFullScreenChange,
}: TeleprompterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verticalPadding, setVerticalPadding] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  // Position the first line inside the reading guide.
  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    const updatePadding = () => {
      const height = container.clientHeight;
      const lineHeight = textSize * 1.55;

      setVerticalPadding(
        Math.max(0, (height - lineHeight) / 2)
      );
    };

    updatePadding();

    const observer = new ResizeObserver(updatePadding);
    observer.observe(container);

    return () => observer.disconnect();
  }, [textSize, fullScreen]);

  // Reset when a new script is loaded.
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    scrollPositionRef.current = 0;

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [script]);

  // Automatically scroll the script.
  useEffect(() => {
    if (!isPlaying) return;

    const container = scrollRef.current;

    if (!container) return;

    let animationFrame = 0;
    let previousTime = 0;

    // Keep fractional movement instead of losing it between frames.
    scrollPositionRef.current = container.scrollTop;

    const scroll = (time: number) => {
      const elapsed =
        previousTime === 0
          ? 0
          : Math.min(time - previousTime, 100);

      previousTime = time;

      const maxScroll =
        container.scrollHeight - container.clientHeight;

      if (maxScroll <= 0) {
        setIsPlaying(false);
        return;
      }

      const scrollAmount = (speed * 0.3 * elapsed) / 1000;

      scrollPositionRef.current = Math.min(
        scrollPositionRef.current + scrollAmount,
        maxScroll
      );

      container.scrollTop = scrollPositionRef.current;

      if (scrollPositionRef.current >= maxScroll) {
        setProgress(100);
        setIsPlaying(false);
        return;
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, speed]);

  // Calculate reading progress.
  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container) return;

    const maxScroll =
      container.scrollHeight - container.clientHeight;

    if (maxScroll <= 0) {
      setProgress(0);
      return;
    }

    const percentage =
      (container.scrollTop / maxScroll) * 100;

    setProgress(
      Math.max(0, Math.min(100, Math.round(percentage)))
    );
  };

  // Restart the script.
  const handleReset = () => {
    setIsPlaying(false);
    scrollPositionRef.current = 0;

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }

    setProgress(0);
  };

  return (
    <main
      className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#111217] text-white"
    >
      {/* Header */}
      {!fullScreen && (
        <header className="flex shrink-0 items-center justify-between px-3 py-3">
          <button
            onClick={onClose}
            aria-label="Close teleprompter"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#20212a] text-gray-300 hover:bg-[#30303d]"
          >
            ×
          </button>

          <div className="text-center">
            <h1 className="text-xs font-medium">
              Your script
            </h1>

            <p className="text-[9px] text-gray-500">
              {isPlaying ? "● Playing" : "● Ready"}
            </p>
          </div>

          <button
            onClick={onSettings}
            aria-label="Open settings"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#20212a] text-gray-300 hover:bg-[#30303d]"
          >
            ⚙
          </button>
        </header>
      )}

      {/* Full Screen Exit */}
      {fullScreen && (
        <button
          onClick={() => onFullScreenChange(false)}
          className="absolute right-3 top-3 z-20 rounded-lg bg-[#292b34]/90 px-3 py-2 text-xs text-white"
        >
          Exit Full Screen
        </button>
      )}

      {/* Reading Area */}
      <section className="relative min-h-0 flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto px-2"
          style={{
            scrollbarWidth: "none",
            paddingTop: `${verticalPadding}px`,
            paddingBottom: `${verticalPadding}px`,
          }}
        >
          <p
            className="whitespace-pre-wrap text-gray-400"
            style={{
              fontSize: `${textSize}px`,
              lineHeight: 1.55,
              transform: mirrorText
                ? "scaleX(-1)"
                : "none",
            }}
          >
            {script}
          </p>
        </div>

        {/* Reading Guide */}
        {showGuide && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 border-l-[3px] border-[#a58af0] bg-[#a58af0]/15 px-3 py-3">
            <div className="h-16" />
          </div>
        )}
      </section>

      {/* Playback Controls - visible in both modes */}
      <footer className="shrink-0 bg-[#191a21] px-3 pb-4 pt-3">
        <div className="mb-3 flex items-center justify-between text-[10px] text-gray-400">
          <span>Script progress</span>
          <span className="text-[#b69aff]">
            {progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 h-[2px] overflow-hidden rounded-full bg-[#383641]">
          <div
            className="h-full rounded-full bg-[#a58af0] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            aria-label="Restart script"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#292b34] text-gray-300 hover:bg-[#383a45]"
          >
            ↻
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!script.trim()}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#a58af0] text-sm font-medium text-[#171321] hover:bg-[#b69df9] disabled:opacity-40"
          >
            {isPlaying
              ? "Ⅱ  Pause"
              : "▷  " + (progress > 0 ? "Resume" : "Play")}
          </button>
        </div>

        <p className="mt-3 text-center text-[10px] text-gray-400">
          ◴ {speed} words / min
        </p>
      </footer>
    </main>
  );
}
