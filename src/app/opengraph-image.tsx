import { ImageResponse } from "next/og";

export const alt = "Hunar.pk — Pakistan's Biggest Local Freelancing Network";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#020617",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(34,197,94,0.35), transparent 55%), radial-gradient(circle at 90% 90%, rgba(20,184,166,0.22), transparent 50%)",
          padding: 80,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 26,
            background: "linear-gradient(135deg, #34d399, #22c55e 55%, #15803d)",
            marginBottom: 40,
            boxShadow: "0 10px 40px -8px rgba(34,197,94,0.6)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <div style={{ width: 20, height: 56, borderRadius: 10, background: "#fff" }} />
            <div
              style={{
                width: 36,
                height: 36,
                background: "#fff",
                transform: "rotate(45deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 14, height: 14, background: "#15803d", transform: "rotate(-45deg)", borderRadius: 3 }} />
            </div>
            <div style={{ width: 20, height: 56, borderRadius: 10, background: "#fff" }} />
          </div>
        </div>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
          <span style={{ fontSize: 64, fontWeight: 800, color: "#ffffff", letterSpacing: -2 }}>Hunar</span>
          <span style={{ fontSize: 64, fontWeight: 800, color: "#22c55e", letterSpacing: -2 }}>.pk</span>
        </div>

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderRadius: 999,
            border: "2px solid rgba(34,197,94,0.4)",
            background: "rgba(34,197,94,0.12)",
            padding: "10px 22px",
            marginBottom: 28,
          }}
        >
          <span style={{ fontSize: 22, color: "#4ade80", fontWeight: 600 }}>★</span>
          <span style={{ fontSize: 22, color: "#4ade80", fontWeight: 600 }}>
            Pakistan&apos;s Biggest Local Freelancing Network
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#f8fafc", textAlign: "center", letterSpacing: -1 }}>
          Pakistani Talent. World-Class Value.
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 48, marginTop: 44 }}>
          {[
            { num: "12K+", label: "Workers" },
            { num: "45K+", label: "Kaam Posted" },
            { num: "8.2Cr", label: "PKR Paid" },
            { num: "0%", label: "Commission" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: "#22c55e" }}>{s.num}</div>
              <div style={{ fontSize: 18, color: "#94a3b8", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
