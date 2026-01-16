import React, { useEffect, useState } from "react";
import CameraInline from "./CameraInline";
import {
  saveImageOffline,
  uploadOfflineImages,
  getOfflineImages,
  removeOfflineImage,
} from "../utils/indexeddb";

const DisplayListSection = ({
  displayList = [],
  loadingDisplayList,
  setDisplayList,
  StoreID,
  SupplierID,
  ScheduleID,
  DOWork,
}) => {
  const [loading, setLoading] = useState(false);
  const [cameraStep, setCameraStep] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [offlineImages, setOfflineImages] = useState([]);

  useEffect(() => {
    fetchOfflineImages();
  }, []);

  const fetchOfflineImages = async () => {
    const imgs = await getOfflineImages();
    setOfflineImages(imgs);
  };

  const handleCapture = (imgData) => {
    setCapturedImage(imgData);
  };

  console.log(cameraStep, "cameraStep");
  const handleConfirmCapture = async () => {
    setLoading(true);
    try {
      // Upload image logic (replace with your API)
      const formData = new FormData();
      formData.append("ScheduleID", ScheduleID);
      formData.append("DOWork", DOWork);
      formData.append("StoreID", StoreID);
      formData.append("DisplayID", cameraStep.displayId);
      formData.append("Stage", cameraStep.stage);
      formData.append(
        "DTOImage",
        new Date().toISOString().replace("T", " ").substring(0, 19)
      );
      formData.append("UserID", "1"); // Replace with actual user id if available
      // Convert base64 to Blob if needed
      let imageFile = capturedImage;
      if (
        typeof capturedImage === "string" &&
        capturedImage.startsWith("data:image")
      ) {
        const arr = capturedImage.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        imageFile = new File([u8arr], `image_${Date.now()}.jpg`, {
          type: mime,
        });
      }
      formData.append("Image", imageFile);
      const response = await fetch(
        "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/ScheduleWorkImageUpload",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Image upload failed");
      // On success, start after image flow
      if (cameraStep.stage === "before") {
        setCameraStep({ displayId: cameraStep.displayId, stage: "after" });
        setShowCamera(true);
        setCapturedImage(null);
      } else {
        setCameraStep(null);
        setCapturedImage(null);
        // Refresh display list after uploading 'after' image
        try {
          debugger;
          console.log(DOWork, ScheduleID, StoreID, SupplierID, "deepak");
          const response = await fetch(
            "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/DailyScheduleDisplayList_Get",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                DOWork: DOWork,
                ScheduleID: ScheduleID,
                StoreID: StoreID,
                SupplierID: SupplierID,
              }),
            }
          );
          const data = await response.json();
          if (data && data.data) {
            if (typeof setDisplayList === "function") {
              
              setDisplayList(data.data);
            }
          }
        } catch (err) {}
      }
    } catch (err) {
      alert("Image upload failed");
      setCameraStep(null);
      setCapturedImage(null);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Header with reload button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: 18 }}>Work List</h2>
        {/* <button
          style={{
            backgroundColor: "#10b981",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
          onClick={async () => {
            if (typeof window.fetchDisplayListFromTaskDetail === "function") {
              window.fetchDisplayListFromTaskDetail();
            } else {
              try {
                debugger;
                console.log(DOWork, ScheduleID, StoreID, SupplierID, "deepak");
                const response = await fetch(
                  "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/DailyScheduleDisplayList_Getss",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      DOWork: DOWork,
                      ScheduleID: ScheduleID,
                      StoreID: StoreID,
                      SupplierID: SupplierID,
                    }),
                  }
                );
                const data = await response.json();
                if (data && data.data) {
                  if (typeof setDisplayList === "function") {
                    setDisplayList(data.data);
                  }
                }
              } catch (err) {}
            }
          }}
        >
          Reload
        </button> */}
      </div>
      {loading ? (
        <>
          {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            margin: "24px 0",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 16 }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 8,
                  background: "#f3f4f6",
                  animation: "skeleton-loading 1.2s infinite linear alternate",
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    width: 120,
                    height: 18,
                    background: "#f3f4f6",
                    borderRadius: 4,
                    marginBottom: 8,
                    animation:
                      "skeleton-loading 1.2s infinite linear alternate",
                  }}
                />
                <div
                  style={{
                    width: 80,
                    height: 14,
                    background: "#f3f4f6",
                    borderRadius: 4,
                    animation:
                      "skeleton-loading 1.2s infinite linear alternate",
                  }}
                />
              </div>
            </div>
          ))}
          <style>{`
            @keyframes skeleton-loading {
              0% { opacity: 1; }
              100% { opacity: 0.4; }
            }
          `}</style>
        </div> */}
        Loading...
        </>
      
      ) : null}
      {/* Show camera step if active */}
      {cameraStep ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 220,
          }}
        >
          <CameraInline
            capturedImage={capturedImage}
            onCapture={handleCapture}
            onRetake={() => setCapturedImage(null)}
            onConfirm={handleConfirmCapture}
            stage={cameraStep.stage}
          />
        </div>
      ) : null}
      {/* Offline images (pending uploads) */}
      {!cameraStep && !loading && displayList.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: "#888",
            margin: "32px 0",
            fontWeight: 500,
            fontSize: 18,
          }}
        >
          Data not available
        </div>
      )}
      {!cameraStep && offlineImages.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, color: "#eab308", marginBottom: 6 }}>
            Pending Uploads (Offline)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {offlineImages.map((img) => (
              <div
                key={img.id}
                style={{
                  border: "1px dashed #eab308",
                  padding: 8,
                  borderRadius: 10,
                  background: "#fffbe6",
                  position: "relative",
                }}
              >
                <img
                  src={img.imageData}
                  alt="offline"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <div style={{ fontSize: 12, color: "#eab308", marginTop: 4 }}>
                  Waiting to upload
                </div>
                <button
                  onClick={async () => {
                    await removeOfflineImage(img.id);
                    fetchOfflineImages();
                  }}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    background: "none",
                    border: "none",
                    color: "#eab308",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Online display list */}
      {!cameraStep &&
        (loadingDisplayList ? (
          <div className="task-card">
            <span>Loading...</span>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            {displayList.map((item) => (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  key={item.ID}
                  style={{
                    border: "1px solid #eee",
                    padding: 8,
                    width: "min-content",
                    height: "min-content",
                    position: "relative",
                    borderRadius: 12,
                    background: "#fff",
                    opacity: item.Completed === "Yes" ? 0.6 : 1,
                    cursor: item.Completed === "No" ? "pointer" : "not-allowed",
                  }}
                  onClick={() => {
                    if (item.Completed === "No") {
                      if (item.BeforeImageURL) {
                        setCameraStep({
                          displayId: item.DisplayID,
                          stage: "after",
                        });
                        setShowCamera(true);
                        setCapturedImage(null);
                      } else {
                        setCameraStep({
                          displayId: item.DisplayID,
                          stage: "before",
                        });
                        setShowCamera(true);
                        setCapturedImage(null);
                      }
                    }
                  }}
                >
                  <img
                    src={item.ImageURL}
                    alt="Display"
                    style={{
                      width: 200,
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <div style={{ marginTop: 8, fontWeight: 500, fontSize: 14 }}>
                    Status:{" "}
                    <span
                      style={{
                        color: item.Completed === "No" ? "#eab308" : "#10b981",
                      }}
                    >
                      {item.Completed === "No" ? "Pending" : "Completed"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default DisplayListSection;
