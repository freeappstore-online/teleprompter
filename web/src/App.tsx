
import { useEffect, useState } from "react";
import { initApp } from "@freeappstore/sdk";
import { type NavItem, Shell } from "@freeappstore/sdk/ui";

import Home from "./pages/Home";
import Teleprompter from "./pages/Teleprompter";
import Settings from "./pages/Settings";

export const fas = initApp({ appId: "teleprompter" });

const NAV: NavItem[] = [
  { label: "Home", href: "/", title: "Teleprompter" },
];

const DEFAULT_SETTINGS = {
  textSize: 22,
  speed: 120,
  showGuide: true,
  mirrorText: false,
  fullScreen: false,
};

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [previousPath, setPreviousPath] = useState("/");
  const [currentScript, setCurrentScript] = useState("");

  const [savedSettings, setSavedSettings] = useState(DEFAULT_SETTINGS);
  const [draftSettings, setDraftSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);

    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const navigate = (href: string) => {
    window.history.pushState(null, "", href);
    setPath(window.location.pathname);
  };

  const handleOpenSettings = () => {
    setPreviousPath(path);
    setDraftSettings({ ...savedSettings });
    navigate("/settings");
  };

  const handleSaveSettings = () => {
    setSavedSettings({ ...draftSettings });
    navigate(previousPath);
  };

  const handleReset = () => {
    setDraftSettings({ ...DEFAULT_SETTINGS });
  };

  const handleStart = (script: string) => {
    setCurrentScript(script);
    navigate("/teleprompter");
  };

  const hasUnsavedChanges =
    draftSettings.textSize !== savedSettings.textSize ||
    draftSettings.speed !== savedSettings.speed ||
    draftSettings.showGuide !== savedSettings.showGuide ||
    draftSettings.mirrorText !== savedSettings.mirrorText ||
    draftSettings.fullScreen !== savedSettings.fullScreen;

  return (
    <Shell
      app={fas}
      appName="Teleprompter"
      nav={NAV}
      onNavigate={navigate}
    >
      <div className="h-[calc(100dvh-70px)] min-h-0 overflow-hidden">
        {path === "/settings" ? (
          <Settings
            textSize={draftSettings.textSize}
            onTextSizeChange={(value) =>
              setDraftSettings((prev) => ({ ...prev, textSize: value }))
            }
            speed={draftSettings.speed}
            onSpeedChange={(value) =>
              setDraftSettings((prev) => ({ ...prev, speed: value }))
            }
            showGuide={draftSettings.showGuide}
            onShowGuideChange={(value) =>
              setDraftSettings((prev) => ({ ...prev, showGuide: value }))
            }
            mirrorText={draftSettings.mirrorText}
            onMirrorTextChange={(value) =>
              setDraftSettings((prev) => ({ ...prev, mirrorText: value }))
            }
            fullScreen={draftSettings.fullScreen}
            onFullScreenChange={(value) =>
              setDraftSettings((prev) => ({ ...prev, fullScreen: value }))
            }
            hasUnsavedChanges={hasUnsavedChanges}
            onBack={() => navigate(previousPath)}
            onDone={handleSaveSettings}
            onReset={handleReset}
          />
        ) : path === "/teleprompter" ? (
          <Teleprompter
            script={currentScript}
            onClose={() => navigate("/")}
            onSettings={handleOpenSettings}
            textSize={savedSettings.textSize}
            speed={savedSettings.speed}
            showGuide={savedSettings.showGuide}
            mirrorText={savedSettings.mirrorText}
            fullScreen={savedSettings.fullScreen}
            onFullScreenChange={(value) =>
              setSavedSettings((prev) => ({
                ...prev,
                fullScreen: value,
              }))
            }
          />
        ) : (
          <Home
            onStart={handleStart}
            onSettings={handleOpenSettings}
          />
        )}
      </div>
    </Shell>
  );
}
