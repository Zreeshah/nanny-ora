import { ImageResponse } from "next/og";

export const alt = "NannyOra — Trusted nanny care for Auckland families";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social-share card. System fonts only → no network fetch at build time.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0F2E52 0%, #1B4670 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 34, opacity: 0.85, marginBottom: 24 }}>
          Verified · Vetted · Auckland
        </div>
        <div style={{ display: "flex", fontSize: 96, fontWeight: 800, letterSpacing: "-2px" }}>NannyOra</div>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 500, marginTop: 20, maxWidth: 900, lineHeight: 1.25 }}>
          Trusted, specialist nannies for Auckland families
        </div>
        <div style={{ display: "flex", fontSize: 30, opacity: 0.8, marginTop: 40 }}>www.nannyora.co.nz</div>
      </div>
    ),
    { ...size }
  );
}
