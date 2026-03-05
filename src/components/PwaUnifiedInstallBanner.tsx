import { useState, useEffect, useCallback } from "react";
import { X, Download, Share2, Monitor, Smartphone, Globe } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-unified-dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

type BannerType = "android" | "ios" | "desktop" | "firefox-desktop" | "firefox-mobile" | null;

function detectBannerType(): BannerType {
  const ua = navigator.userAgent;
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone;

  if (isStandalone) return null;

  const isIos = /iphone|ipad|ipod/i.test(ua);
  const isAndroid = /android/i.test(ua);
  const isFirefox = /firefox/i.test(ua);
  const isMobile = /mobi|android|iphone|ipad|ipod/i.test(ua);

  if (isFirefox && isMobile) return "firefox-mobile";
  if (isFirefox) return "firefox-desktop";
  if (isIos) return "ios";
  if (isAndroid || (isMobile && !isIos)) return "android";
  return "desktop";
}

function isDismissed(): boolean {
  const val = localStorage.getItem(DISMISS_KEY);
  if (!val) return false;
  return Date.now() - parseInt(val, 10) < DISMISS_DURATION;
}

function setDismissed() {
  localStorage.setItem(DISMISS_KEY, String(Date.now()));
}

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [bannerType, setBannerType] = useState<BannerType>(null);
  const [visible, setVisible] = useState(false);
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    if (isDismissed()) return;

    const visits = parseInt(localStorage.getItem("pwa-unified-visits") || "0", 10) + 1;
    localStorage.setItem("pwa-unified-visits", String(visits));
    setVisitCount(visits);
    if (visits < 2) return;

    const type = detectBannerType();
    if (!type) return;

    setBannerType(type);

    // For iOS and Firefox, show immediately
    if (type === "ios" || type === "firefox-desktop" || type === "firefox-mobile") {
      setVisible(true);
      return;
    }

    // For Android/Desktop, wait for beforeinstallprompt or show after timeout
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Fallback: show banner after 3s even without prompt (for instruction-based installs)
    const fallback = setTimeout(() => {
      if (type === "desktop" || type === "android") {
        setVisible(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(fallback);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
    if (outcome === "accepted") {
      localStorage.removeItem(DISMISS_KEY);
    }
  }, [deferredPrompt]);

  const dismiss = () => {
    setVisible(false);
    setDismissed();
  };

  if (!visible) return null;

  // ── Styles ──────────────────────────────────────
  const isBottom = bannerType === "android" || bannerType === "ios" || bannerType === "firefox-mobile";

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 10000,
    maxWidth: isBottom ? "400px" : "360px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.8125rem",
    lineHeight: "1.4",
    ...(isBottom
      ? { bottom: "1rem", left: "50%", transform: "translateX(-50%)", width: "calc(100% - 2rem)" }
      : { top: "1rem", right: "1rem" }),
  };

  const cardStyle: React.CSSProperties = {
    background: "hsl(0,0%,18%)",
    color: "hsl(0,0%,95%)",
    borderRadius: "0.75rem",
    padding: "0.875rem 1rem",
    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
  };

  const btnPrimary: React.CSSProperties = {
    background: "#b99936",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: 6,
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 4,
  };

  const btnSecondary: React.CSSProperties = {
    background: "transparent",
    color: "hsl(0,0%,60%)",
    border: "1px solid hsl(0,0%,30%)",
    padding: "6px 14px",
    borderRadius: 6,
    fontSize: "0.75rem",
    cursor: "pointer",
  };

  const closeBtn: React.CSSProperties = {
    background: "none",
    border: "none",
    color: "hsl(0,0%,60%)",
    cursor: "pointer",
    padding: 2,
    flexShrink: 0,
  };

  const subtextStyle: React.CSSProperties = { color: "hsl(0,0%,70%)", fontSize: "0.75rem" };

  // ── Render by type ──────────────────────────────
  const renderContent = () => {
    switch (bannerType) {
      case "android":
        return (
          <>
            <img src="/logo.jpg" alt="" style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: "block", marginBottom: 4 }}>Instalar Granja Sofhia</strong>
              <span style={subtextStyle}>Acesse mais rápido direto da sua tela inicial.</span>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {deferredPrompt ? (
                  <button onClick={handleInstall} style={btnPrimary}>
                    <Download style={{ width: 14, height: 14 }} /> Instalar
                  </button>
                ) : (
                  <span style={subtextStyle}>Use o menu do navegador para instalar.</span>
                )}
                <button onClick={dismiss} style={btnSecondary}>Agora não</button>
              </div>
            </div>
            <button onClick={dismiss} style={closeBtn}><X style={{ width: 16, height: 16 }} /></button>
          </>
        );

      case "ios":
        return (
          <>
            <img src="/logo.jpg" alt="" style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: "block", marginBottom: 4 }}>Instalar Granja Sofhia</strong>
              <span style={subtextStyle}>
                Toque em{" "}
                <Share2 style={{ display: "inline", width: 14, height: 14, verticalAlign: "middle" }} />{" "}
                compartilhar e depois em <strong>Adicionar à Tela de Início</strong>
              </span>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button onClick={dismiss} style={btnPrimary}>Entendido</button>
              </div>
            </div>
            <button onClick={dismiss} style={closeBtn}><X style={{ width: 16, height: 16 }} /></button>
          </>
        );

      case "desktop":
        return (
          <>
            <Monitor style={{ width: 20, height: 20, flexShrink: 0, marginTop: 2, color: "#b99936" }} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: "block", marginBottom: 2 }}>Instale o Granja Sofhia</strong>
              <span style={subtextStyle}>
                {deferredPrompt
                  ? "Abra direto como aplicativo no seu computador."
                  : "Use o ícone de instalação na barra de endereço do navegador."}
              </span>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {deferredPrompt && (
                  <button onClick={handleInstall} style={btnPrimary}>
                    <Download style={{ width: 14, height: 14 }} /> Instalar
                  </button>
                )}
                <button onClick={dismiss} style={btnSecondary}>Agora não</button>
              </div>
            </div>
            <button onClick={dismiss} style={closeBtn}><X style={{ width: 14, height: 14 }} /></button>
          </>
        );

      case "firefox-desktop":
        return (
          <>
            <Globe style={{ width: 20, height: 20, flexShrink: 0, marginTop: 2, color: "#b99936" }} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: "block", marginBottom: 2 }}>Instalar Granja Sofhia</strong>
              <span style={subtextStyle}>
                No menu <strong>☰</strong> do Firefox, clique em <strong>"Instalar este site como app"</strong>
              </span>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={dismiss} style={btnPrimary}>Entendido</button>
              </div>
            </div>
            <button onClick={dismiss} style={closeBtn}><X style={{ width: 14, height: 14 }} /></button>
          </>
        );

      case "firefox-mobile":
        return (
          <>
            <Smartphone style={{ width: 20, height: 20, flexShrink: 0, marginTop: 2, color: "#b99936" }} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: "block", marginBottom: 4 }}>Instalar Granja Sofhia</strong>
              <span style={subtextStyle}>
                No menu <strong>⋮</strong> do Firefox, toque em <strong>"Adicionar à tela inicial"</strong>
              </span>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button onClick={dismiss} style={btnPrimary}>Entendido</button>
              </div>
            </div>
            <button onClick={dismiss} style={closeBtn}><X style={{ width: 16, height: 16 }} /></button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>{renderContent()}</div>
    </div>
  );
}
