// import React, { useEffect, useState } from "react";
// import CameraInline from "./CameraInline";
// import {
//   saveImageOffline,
//   uploadOfflineImages,
//   getOfflineImages,
//   removeOfflineImage,
// Helper: check if both before and after images exist (offline or online) for a display
const hasBothImages = (displayId) => {
  // Check online (API) images
  const display = displayList.find((d) => d.DisplayID === displayId);
  const hasOnlineBefore = display && display.BeforeImageURL;
  const hasOnlineAfter = display && display.AfterImageURL;

  // Check offline images
  const offlineBefore = offlineImages.find(
    (img) =>
      img.displayId === displayId && img.stage?.toLowerCase() === "before",
  );
  const offlineAfter = offlineImages.find(
    (img) =>
      img.displayId === displayId && img.stage?.toLowerCase() === "after",
  );

  // If either online or offline has both
  return (hasOnlineBefore || offlineBefore) && (hasOnlineAfter || offlineAfter);
};

return (
  <div style={{ padding: 20 }}>
    {/* ...existing code... */}
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
          {displayList.map((item) => {
            const disabled = hasBothImages(item.DisplayID);
            return (
              <div
                style={{ display: "flex", justifyContent: "center" }}
                key={item.ID}
              >
                <div
                  style={{
                    border: "1px solid #eee",
                    padding: 8,
                    width: "min-content",
                    height: "min-content",
                    position: "relative",
                    borderRadius: 12,
                    background: "#fff",
                    opacity: disabled ? 0.6 : 1,
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                  onClick={() => {
                    if (disabled) return;
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
                  {disabled && (
                    <div
                      style={{ color: "#991b1b", fontSize: 12, marginTop: 6 }}
                    >
                      Both images captured
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
  </div>
);
//       {/* Show camera step if active */}
//       {cameraStep ? (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             minHeight: 220,
//           }}
//         >
//           <CameraInline
//             capturedImage={capturedImage}
//             onCapture={handleCapture}
//             onRetake={() => setCapturedImage(null)}
//             onConfirm={handleConfirmCapture}
//             stage={cameraStep.stage}
//             confirmLoading={loading}
//           />
//         </div>
//       ) : null}
//       {/* Offline images (pending uploads) */}
//       {/* Show 'Data not available' only if not loading and list is empty */}
//       {!cameraStep &&
//         !loading &&
//         !loadingDisplayList &&
//         displayList.length === 0 && (
//           <div
//             style={{
//               textAlign: "center",
//               color: "#888",
//               margin: "32px 0",
//               fontWeight: 500,
//               fontSize: 18,
//             }}
//           >
//             Data not available
//           </div>
//         )}
//       {!cameraStep && offlineImages.length > 0 && (
//         <div style={{ marginBottom: 16 }}>
//           <div style={{ fontWeight: 600, color: "#eab308", marginBottom: 6 }}>
//             Pending Uploads (Offline)
//           </div>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
//             {offlineImages.map((img) => (
//               <div
//                 key={img.id}
//                 style={{
//                   border: "1px dashed #eab308",
//                   padding: 8,
//                   borderRadius: 10,
//                   background: "#fffbe6",
//                   position: "relative",
//                 }}
//               >
//                 <img
//                   src={img.imageData}
//                   alt="offline"
//                   style={{
//                     width: 80,
//                     height: 80,
//                     objectFit: "cover",
//                     borderRadius: 8,
//                   }}
//                 />
//                 <div style={{ fontSize: 12, color: "#eab308", marginTop: 4 }}>
//                   Waiting to upload
//                 </div>
//                 <button
//                   onClick={async () => {
//                     await removeOfflineImage(img.id);
//                     fetchOfflineImages();
//                   }}
//                   style={{
//                     position: "absolute",
//                     top: 4,
//                     right: 4,
//                     background: "none",
//                     border: "none",
//                     color: "#eab308",
//                     fontWeight: 700,
//                     fontSize: 16,
//                     cursor: "pointer",
//                   }}
//                   title="Remove"
//                 >
//                   ×
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//       {/* Online display list */}
//       {!cameraStep &&
//         (loadingDisplayList ? (
//           <div className="task-card">
//             <span>Loading...</span>
//           </div>
//         ) : (
//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 16,
//               flexDirection: "column",
//               textAlign: "center",
//             }}
//           >
//             {displayList.map((item) => (
//               <div style={{ display: "flex", justifyContent: "center" }}>
//                 <div
//                   key={item.ID}
//                   style={{
//                     border: "1px solid #eee",
//                     padding: 8,
//                     width: "min-content",
//                     height: "min-content",
//                     position: "relative",
//                     borderRadius: 12,
//                     background: "#fff",
//                     opacity: item.Completed === "Yes" ? 0.6 : 1,
//                     cursor: item.Completed === "No" ? "pointer" : "not-allowed",
//                   }}
//                   onClick={() => {
//                     if (item.Completed === "No") {
//                       if (item.BeforeImageURL) {
//                         setCameraStep({
//                           displayId: item.DisplayID,
//                           stage: "after",
//                         });
//                         setShowCamera(true);
//                         setCapturedImage(null);
//                       } else {
//                         setCameraStep({
//                           displayId: item.DisplayID,
//                           stage: "before",
//                         });
//                         setShowCamera(true);
//                         setCapturedImage(null);
//                       }
//                     }
//                   }}
//                 >
//                   <img
//                     src={item.ImageURL}
//                     alt="Display"
//                     style={{
//                       width: 200,
//                       height: 200,
//                       objectFit: "cover",
//                       borderRadius: 8,
//                     }}
//                   />
//                   <div style={{ marginTop: 8, fontWeight: 500, fontSize: 14 }}>
//                     Status:{" "}
//                     <span
//                       style={{
//                         color: item.Completed === "No" ? "#eab308" : "#10b981",
//                       }}
//                     >
//                       {item.Completed === "No" ? "Pending" : "Completed"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//     </div>
//   );
// };

// export default DisplayListSection;

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
      // Upload image logic
      const formData = new FormData();
      formData.append("ScheduleID", ScheduleID);
      formData.append("DOWork", DOWork);
      formData.append("StoreID", StoreID);
      formData.append("DisplayID", cameraStep.displayId);
      // Ensure stage is capitalized (e.g., 'After', 'Before')
      const stageFormatted =
        cameraStep.stage.charAt(0).toUpperCase() +
        cameraStep.stage.slice(1).toLowerCase();
      formData.append("Stage", stageFormatted);
      formData.append(
        "DTOImage",
        new Date().toISOString().replace("T", " ").substring(0, 19),
      );
      formData.append("UserID", "1");

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
        },
      );

      if (!response.ok) throw new Error("Image upload failed");

      // On success, start after image flow
      if (cameraStep.stage === "before") {
        setCameraStep({ displayId: cameraStep.displayId, stage: "after" });
        setCapturedImage(null);
      } else {
        setCameraStep(null);
        setCapturedImage(null);

        // Refresh display list after uploading 'after' image
        try {
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
            },
          );

          const data = await response.json();
          if (data && data.data) {
            if (typeof setDisplayList === "function") {
              setDisplayList(data.data);
            }
          }
        } catch (err) {
          console.error("Failed to refresh display list:", err);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);

      // Save image offline if upload fails
      try {
        await saveImageOffline({
          displayId: cameraStep.displayId,
          stage: cameraStep.stage,
          imageData: capturedImage,
          scheduleId: ScheduleID,
          storeId: StoreID,
          dtoImage: new Date().toISOString().replace("T", " ").substring(0, 19),
          userId: "1",
          dowork: DOWork,
        });

        alert(
          "Upload failed. Image saved offline and will sync when back online.",
        );
        fetchOfflineImages(); // Refresh offline images list

        // If this was a before image, still go to after image
        if (cameraStep.stage === "before") {
          setCameraStep({ displayId: cameraStep.displayId, stage: "after" });
          setCapturedImage(null);
        } else {
          setCameraStep(null);
          setCapturedImage(null);
        }
      } catch (saveError) {
        alert("Failed to save image offline. Please try again.");
        setCameraStep(null);
        setCapturedImage(null);
      }
    }
    setLoading(false);
  };

  const handleRetryOfflineUpload = async (imageId) => {
    setLoading(true);
    try {
      // Find the offline image
      const offlineImages = await getOfflineImages();
      const imageToUpload = offlineImages.find((img) => img.id === imageId);

      if (!imageToUpload) {
        throw new Error("Image not found");
      }

      // Upload the image
      const formData = new FormData();
      formData.append("ScheduleID", ScheduleID);
      formData.append("DOWork", DOWork);
      formData.append("StoreID", StoreID);
      formData.append("DisplayID", imageToUpload.displayId);
      formData.append("Stage", imageToUpload.stage);
      formData.append("DTOImage", imageToUpload.dtoImage);
      formData.append("UserID", imageToUpload.userId);

      // Convert base64 to File
      const arr = imageToUpload.imageData.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      const u8arr = new Uint8Array(bstr.length);
      for (let i = 0; i < bstr.length; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }
      const imageFile = new File([u8arr], `offline_image_${imageId}.jpg`, {
        type: mime,
      });
      formData.append("Image", imageFile);

      const response = await fetch(
        "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/ScheduleWorkImageUpload",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) throw new Error("Upload failed");

      // Remove from offline storage on success
      await removeOfflineImage(imageId);
      await fetchOfflineImages();

      // Refresh display list
      const refreshResponse = await fetch(
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
        },
      );

      const data = await refreshResponse.json();
      if (data && data.data && typeof setDisplayList === "function") {
        setDisplayList(data.data);
      }
    } catch (error) {
      console.error("Retry upload failed:", error);
      alert("Failed to upload offline image. Please try again.");
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
        <h2 style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>
          Work List
        </h2>

        {/* Manual refresh button for offline images sync */}
        {offlineImages.length > 0 && (
          <button
            style={{
              backgroundColor: "#eab308",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
            }}
            onClick={async () => {
              try {
                setLoading(true);
                await uploadOfflineImages(ScheduleID, StoreID, DOWork);
                await fetchOfflineImages();

                // Refresh display list
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
                  },
                );

                const data = await response.json();
                if (data && data.data && typeof setDisplayList === "function") {
                  setDisplayList(data.data);
                }
              } catch (error) {
                console.error("Sync error:", error);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? "Syncing..." : `Sync Offline (${offlineImages.length})`}
          </button>
        )}
      </div>

      {/* Show camera step if active */}
      {cameraStep ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "20px 0",
          }}
        >
          <CameraInline
            capturedImage={capturedImage}
            onCapture={handleCapture}
            onRetake={() => setCapturedImage(null)}
            onConfirm={handleConfirmCapture}
            stage={cameraStep.stage}
            confirmLoading={loading}
          />
        </div>
      ) : null}

      {/* Offline images (pending uploads) */}
      {!cameraStep && offlineImages.length > 0 && (
        <div
          style={{
            marginBottom: 24,
            padding: "16px",
            backgroundColor: "#fefce8",
            borderRadius: 12,
            border: "1px solid #fde047",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              color: "#854d0e",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>📤</span>
            <span>Pending Uploads ({offlineImages.length} offline)</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {offlineImages.map((img) => (
              <div
                key={img.id}
                style={{
                  border: "1px solid #fde047",
                  padding: 12,
                  borderRadius: 10,
                  background: "#fff",
                  position: "relative",
                  minWidth: 120,
                }}
              >
                <img
                  src={img.imageData}
                  alt="offline"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{ fontSize: 12, color: "#854d0e", marginBottom: 4 }}
                >
                  {img.stage === "before" ? "Before" : "After"} Image
                </div>
                <div style={{ fontSize: 10, color: "#666", marginBottom: 8 }}>
                  Display ID: {img.displayId}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleRetryOfflineUpload(img.id)}
                    style={{
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 12px",
                      fontSize: 12,
                      cursor: "pointer",
                      flex: 1,
                    }}
                    disabled={loading}
                  >
                    Retry Upload
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm("Remove this offline image?")) {
                        await removeOfflineImage(img.id);
                        fetchOfflineImages();
                      }
                    }}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 12px",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show 'Data not available' only if not loading and list is empty */}
      {!cameraStep &&
        !loading &&
        !loadingDisplayList &&
        displayList.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#888",
              margin: "32px 0",
              fontWeight: 500,
              fontSize: 18,
              padding: 40,
              backgroundColor: "#f9fafb",
              borderRadius: 12,
            }}
          >
            No work items available
          </div>
        )}

      {/* Online display list */}
      {!cameraStep &&
        (loadingDisplayList ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 40,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                border: "3px solid #f3f3f3",
                borderTop: "3px solid #10b981",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            {displayList.map((item) => (
              <div
                key={item.ID}
                style={{
                  border: `2px solid ${
                    item.Completed === "Yes" ? "#10b981" : "#eab308"
                  }`,
                  padding: 16,
                  borderRadius: 12,
                  background: "#fff",
                  width: 200,
                  cursor: item.Completed === "No" ? "pointer" : "default",
                  opacity: item.Completed === "Yes" ? 0.8 : 1,
                  transition: "all 0.2s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
                onClick={() => {
                  if (item.Completed === "No") {
                    if (item.BeforeImageURL) {
                      setCameraStep({
                        displayId: item.DisplayID,
                        stage: "after",
                      });
                      setCapturedImage(null);
                    } else {
                      setCameraStep({
                        displayId: item.DisplayID,
                        stage: "before",
                      });
                      setCapturedImage(null);
                    }
                  }
                }}
                onMouseOver={(e) => {
                  if (item.Completed === "No") {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.12)";
                  }
                }}
                onMouseOut={(e) => {
                  if (item.Completed === "No") {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,0.08)";
                  }
                }}
              >
                <img
                  src={item.ImageURL}
                  alt="Display"
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                />
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 4,
                    color: "#374151",
                  }}
                >
                  Display #{item.DisplayID}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: item.Completed === "No" ? "#eab308" : "#10b981",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor:
                        item.Completed === "No" ? "#eab308" : "#10b981",
                    }}
                  />
                  Status: {item.Completed === "No" ? "Pending" : "Completed"}
                </div>
                {item.Completed === "No" && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      marginTop: 8,
                      textAlign: "center",
                      fontStyle: "italic",
                    }}
                  >
                    Click to{" "}
                    {item.BeforeImageURL
                      ? "add After image"
                      : "add Before image"}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default DisplayListSection;
