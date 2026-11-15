
import { useState } from "react";

interface SettingsProps {
  textSize: number;
  onTextSizeChange: (value: number) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  showGuide: boolean;
  onShowGuideChange: (value: boolean) => void;
  mirrorText: boolean;
  onMirrorTextChange: (value: boolean) => void;
  fullScreen: boolean;
  onFullScreenChange: (value: boolean) => void;
  hasUnsavedChanges: boolean;
  onBack: () => void;
  onDone: () => void;
  onReset: () => void;
}

export default function Settings({
  textSize,
  onTextSizeChange,
  speed,
  onSpeedChange,
  showGuide,
  onShowGuideChange,
  mirrorText,
  onMirrorTextChange,
  fullScreen,
  onFullScreenChange,
  hasUnsavedChanges,
  onBack,
  onDone,
  onReset,
}: SettingsProps) {
  const [showDiscardConfirmation, setShowDiscardConfirmation] =
    useState(false);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowDiscardConfirmation(true);
    } else {
      onBack();
    }
  };

  const handleDiscard = () => {
    setShowDiscardConfirmation(false);
    onBack();
  };

  const Toggle = ({
    label,
    description,
    checked,
    onChange,
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (value: boolean) => void;
  }) => (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <h3 className="text-sm font-medium text-white">{label}</h3>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#a58af0]" : "bg-[#383a45]"
        }`}
      >
        <span
            className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                checked ? "translate-x-5" : "translate-x-0"
            }`}
            />
      </button>
    </div>
  );

  return (
    <main className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#111217] px-5 py-3 text-white">

      {/* Header */}
      <header className="flex shrink-0 items-center justify-between">
        <button
          onClick={handleBack}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#20212a] text-lg text-gray-300 hover:bg-[#30303d]"
        >
          ←
        </button>

        <h1 className="text-base font-semibold">Settings</h1>

        <div className="w-9" />
      </header>

      <p className="mb-3 mt-2 shrink-0 text-center text-xs text-gray-500">
        Customise your teleprompter experience
      </p>

      {/* Scrollable Preferences */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-3">

        {/* Reading Preferences */}
        <section className="rounded-xl bg-[#191a21] p-4">
          <h2 className="mb-4 text-sm font-semibold text-[#b69aff]">
            Reading Preferences
          </h2>

          {/* Text Size */}
          <div className="mb-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Text Size</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Adjust the script text size
                </p>
              </div>

              <span className="text-sm text-[#b69aff]">
                {textSize}px
              </span>
            </div>

            <input
              type="range"
              min="16"
              max="40"
              step="1"
              value={textSize}
              onChange={(e) => onTextSizeChange(Number(e.target.value))}
              className="w-full cursor-pointer accent-[#a58af0]"
            />

            <div className="flex justify-between text-[10px] text-gray-500">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>

          {/* Scroll Speed */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Scroll Speed</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Control automatic scrolling speed
                </p>
              </div>

              <span className="text-sm text-[#b69aff]">
                {speed} WPM
              </span>
            </div>

            <input
              type="range"
              min="40"
              max="300"
              step="10"
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="w-full cursor-pointer accent-[#a58af0]"
            />

            <div className="flex justify-between text-[10px] text-gray-500">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </section>

        {/* Display Preferences */}
        <section className="rounded-xl bg-[#191a21] px-4">
          <h2 className="pt-3 text-sm font-semibold text-[#b69aff]">
            Display Preferences
          </h2>

          <Toggle
            label="Reading Guide"
            description="Show the purple reading highlight"
            checked={showGuide}
            onChange={onShowGuideChange}
          />

          <div className="border-t border-[#30303a]" />

          <Toggle
            label="Mirror Text"
            description="Flip text horizontally"
            checked={mirrorText}
            onChange={onMirrorTextChange}
          />

          <div className="border-t border-[#30303a]" />

          <Toggle
            label="Full-Screen Mode"
            description="Use the full screen for reading"
            checked={fullScreen}
            onChange={onFullScreenChange}
          />
        </section>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="shrink-0 border-t border-[#292b34] bg-[#111217] pt-2">
        <button
          onClick={onReset}
          className="w-full py-2 text-center text-sm text-gray-400 hover:text-white"
        >
          Reset to Default Settings
        </button>

        <button
          onClick={onDone}
          className="mt-1 w-full rounded-lg bg-[#a58af0] py-3 text-sm font-semibold text-[#171321] transition hover:bg-[#b69df9]"
        >
          Done
        </button>
      </div>

      {/* Discard Confirmation Popup */}
      {showDiscardConfirmation && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="discard-title"
            className="w-full max-w-sm rounded-2xl border border-[#343541] bg-[#191a21] p-5 shadow-xl"
          >
            <h2
              id="discard-title"
              className="text-base font-semibold text-white"
            >
              Unsaved Changes
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              You have unsaved changes. Are you sure you want to leave
              without saving?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDiscardConfirmation(false)}
                className="flex-1 rounded-lg border border-[#383a45] py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#292a35]"
              >
                Stay
              </button>

              <button
                onClick={handleDiscard}
                className="flex-1 rounded-lg bg-[#a58af0] py-2.5 text-sm font-semibold text-[#171321] transition hover:bg-[#b69df9]"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
