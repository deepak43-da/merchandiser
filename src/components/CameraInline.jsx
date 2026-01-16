import React, { useRef, useEffect, useState } from "react";

export default function CameraInline({
  capturedImage,
  onCapture,
  onRetake,
  onConfirm,
  stage,
}) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (!capturedImage) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [capturedImage]);

  const handleCapture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const image = canvas.toDataURL("image/png");
    onCapture(image);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        padding: 32,
        width: 320,
        maxWidth: 400,
        width: "100%",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 18,
          marginBottom: 18,
          color: "#222",
        }}
      >
        {stage === "before" ? "Before Image" : "After Image"}
      </div>
      {!capturedImage ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            style={{
              width: 240,
              height: 180,
              borderRadius: 12,
              marginBottom: 18,
              background: "#f3f4f6",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          />
          <button
            style={{
              background: "#10b981",
              color: "#fff",
              padding: "10px 32px",
              borderRadius: 20,
              border: "none",
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 8,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(16,185,129,0.08)",
              transition: "background 0.2s",
            }}
            onClick={handleCapture}
            onMouseOver={(e) => (e.currentTarget.style.background = "#059669")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#10b981")}
          >
            {stage === "before"
              ? "Before Image"
              : "After Image"}
          </button>
        </>
      ) : (
        <>
          <img
            src={capturedImage}
            alt="Captured"
            style={{
              width: 240,
              height: 180,
              borderRadius: 12,
              marginBottom: 18,
              background: "#f3f4f6",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          />
          <div style={{ display: "flex", gap: 18, justifyContent: "center" }}>
            <button
              style={{
                background: "#eee",
                color: "#374151",
                padding: "10px 32px",
                borderRadius: 20,
                border: "none",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onClick={onRetake}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#e5e7eb")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#eee")}
            >
              Retake
            </button>
            <button
              style={{
                background: "#10b981",
                color: "#fff",
                padding: "10px 32px",
                borderRadius: 20,
                border: "none",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(16,185,129,0.08)",
                transition: "background 0.2s",
              }}
              onClick={onConfirm}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#059669")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#10b981")}
            >
              Confirm
            </button>
          </div>
        </>
      )}
    </div>
  );
}
