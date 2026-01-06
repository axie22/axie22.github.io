import { ImageResponse } from "next/og";

// Route segment config
export const dynamic = "force-static";

// Image metadata
export const alt = "Alexander Xie | Software Engineer";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 60,
          background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "40%",
            height: "40%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "40%",
            height: "40%",
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 84, fontWeight: "bold", background: "linear-gradient(to right, #f8fafc, #cbd5e1)", backgroundClip: "text", color: "transparent" }}>
            Alexander Xie
          </div>
          <div style={{ fontSize: 42, color: "#94a3b8", marginTop: 10 }}>
            Software Engineer
          </div>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
