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

export default async function Image() {

  const jsonCode = `{
  "name": "Alexander Xie",
  "role": "Software Engineer",
  "education": {
    "school": "NYU",
    "major": "CS & Data Science"
  },
  "skills": [
    "System Architecture",
    "Machine Learning", 
    "Full Stack Dev"
  ],
  "status": "Building things that matter"
}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#020617", // slate-950
          backgroundImage: "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Background Blobs */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "-10%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)", // indigo
            filter: "blur(60px)",
          }}
        />
         <div
          style={{
            position: "absolute",
            bottom: "-15%",
            right: "-5%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)", // pink
            filter: "blur(60px)",
          }}
        />

        {/* Left Side: Text Info */}
        <div style={{ display: "flex", flexDirection: "column", paddingLeft: "80px", zIndex: 10, maxWidth: "50%" }}>
           <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              background: "linear-gradient(to right, #f8fafc, #94a3b8)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: "10px",
              lineHeight: 1.1,
            }}
          >
            Alexander Xie
          </div>
          <div style={{ fontSize: 36, color: "#64748b", fontWeight: 500 }}>
            Software Engineer
          </div>
          <div style={{ display: "flex", marginTop: "30px", gap: "10px", fontSize: 20, color: "#94a3b8" }}>
             <div style={{ background: "#1e293b", padding: "8px 16px", borderRadius: "20px", border: "1px solid #334155" }}>Systems</div>
             <div style={{ background: "#1e293b", padding: "8px 16px", borderRadius: "20px", border: "1px solid #334155" }}>ML Infra</div>
             <div style={{ background: "#1e293b", padding: "8px 16px", borderRadius: "20px", border: "1px solid #334155" }}>Full Stack</div>
          </div>
        </div>

        {/* Right Side: Code Window */}
        <div style={{ display: "flex", paddingRight: "80px", zIndex: 10 }}>
          <div
            style={{
              background: "rgba(15, 23, 42, 0.6)", // slate-900 with opacity
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              backdropFilter: "blur(12px)",
              width: "480px",
            }}
          >
            {/* Window Controls */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }}></div>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }}></div>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#22c55e" }}></div>
            </div>
            
            {/* Code Content */}
            <pre
              style={{
                fontFamily: "monospace",
                fontSize: 20,
                lineHeight: 1.5,
                margin: 0,
                whiteSpace: "pre-wrap",
                color: "#e2e8f0",
              }}
            >
              {`{
  "name": `}<span style={{ color: "#7dd3fc" }}>"Alexander Xie"</span>{`,
  "education": {
    "school": `}<span style={{ color: "#7dd3fc" }}>"NYU"</span>{`
  },
  "skills": [
    `}<span style={{ color: "#fca5a5" }}>"Systems"</span>{`,
    `}<span style={{ color: "#fca5a5" }}>"ML Infra"</span>{`,
    `}<span style={{ color: "#fca5a5" }}>"Web"</span>{`
  ],
  "status": `}<span style={{ color: "#86efac" }}>"Building"</span>{`
}`}
            </pre>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
