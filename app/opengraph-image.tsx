import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteProfile } from "@/content/profile";

// The link-preview card shown when tk-coding.com is shared (LinkedIn,
// WhatsApp, Slack, X). Living at the app root, it applies to every page —
// file-based metadata outranks the per-page openGraph objects that
// generateMetadata returns, so pages keep their own titles and descriptions
// but all share this image.
export const alt = `${siteProfile.name} — ${siteProfile.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ImageResponse renders with Satori, which can't read CSS variables — these
// mirror the theme tokens in app/globals.css.
const BACKGROUND = "#0c1210";
const FOREGROUND = "#dbe6e0";
const ACCENT = "#39ff14";

// The asset never depends on the request, so it's read once at module scope.
const avatarData = await readFile(join(process.cwd(), "public", siteProfile.avatarSrc), "base64");
const avatarSrc = `data:image/jpeg;base64,${avatarData}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 56,
          background: BACKGROUND,
          backgroundImage:
            "radial-gradient(circle at 22% 48%, rgba(57, 255, 20, 0.14), transparent 55%)",
          color: FOREGROUND,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 22 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#f87171" }} />
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#facc15" }} />
            <div style={{ width: 14, height: 14, borderRadius: 7, background: ACCENT }} />
          </div>
          <div style={{ display: "flex", marginLeft: 20, color: "rgba(219, 230, 224, 0.5)" }}>
            anatoli@portfolio: ~
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 56 }}>
          <img
            src={avatarSrc}
            alt=""
            width={240}
            height={240}
            style={{
              borderRadius: 120,
              border: `4px solid ${ACCENT}`,
              boxShadow: "0 0 48px rgba(57, 255, 20, 0.45)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", fontSize: 28, color: ACCENT }}>$ whoami</div>
            <div style={{ display: "flex", fontSize: 78, fontWeight: 700 }}>{siteProfile.name}</div>
            <div style={{ display: "flex", fontSize: 36, color: "rgba(219, 230, 224, 0.75)" }}>
              {siteProfile.tagline}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: "1px solid rgba(57, 255, 20, 0.25)",
            fontSize: 26,
          }}
        >
          <div style={{ display: "flex", color: ACCENT }}>tk-coding.com</div>
          <div style={{ display: "flex", color: "rgba(219, 230, 224, 0.55)" }}>
            Projects · Cybersecurity · AI engineering
          </div>
        </div>
      </div>
    ),
    size,
  );
}
