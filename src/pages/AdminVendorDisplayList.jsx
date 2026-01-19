import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";
import CameraModal from "../components/CameraModal";
import localForage from "localforage";

export default function AdminVendorDisplayList() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("id");
    localStorage.removeItem("maindata");
    toast.error("Logout successful!");
    navigate("/");
  };
  const { id } = useParams();
  const [displayList, setDisplayList] = useState([]);
  const [offlineImages, setOfflineImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const UserID = localStorage.getItem("UserID");

  // Accept skipLoading param to avoid skeleton on delete
  const fetchDisplayList = async (skipLoading = false) => {
    if (!skipLoading) setLoading(true);
    try {
      // StoreID from localStorage, SupplierID from params (id)
      const StoreID = localStorage.getItem("StoreID");
      const SupplierID = id;
      const response = await axios.post(
        "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/DisplayList_Get",
        {
          StoreID,
          SupplierID,
        }
      );
      // API returns { status, message, data: [...] }
      setDisplayList(response.data.data || []);
    } catch (err) {
      alert("Failed to fetch display list");
    } finally {
      if (!skipLoading) setLoading(false);
    }
  };

  // Custom upload function for this screen
  const uploadOfflineImages2 = async () => {
    const images = (await localForage.getItem("offlineImages2")) || [];
    for (const img of images) {
      try {
        await axios.post(
          `https://api.example.com/admin/vendor/${img.vendorId}/adddisplay`,
          { image: img.imageData }
        );
        await removeOfflineImage2(img.id);
      } catch (err) {
        // Keep image for next attempt
      }
    }
  };

  // Fetch offline images for this vendor
  const fetchOfflineImages = async () => {
    const images = (await localForage.getItem("offlineImages2")) || [];
    setOfflineImages(images.filter((img) => img.vendorId === id));
  };

  useEffect(() => {
    fetchDisplayList();
    fetchOfflineImages();
    window.addEventListener("online", uploadOfflineImages2);
    return () => window.removeEventListener("online", uploadOfflineImages2);
  }, [id]);

  const handleDelete = async () => {
    setShowConfirm(false);
    if (!deleteId) return;
    try {
      await axios.post(
        "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/DeactivateDisplay",
        {
          DisplayID: deleteId,
          UserID: UserID,
        }
      );
      fetchDisplayList(true); // skip skeleton loading on delete
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleAddDisplay = () => {
    setShowCamera(true);
  };

  const handleCapture = (image) => {
    setCapturedImage(image);
  };

  // Save image offline for this screen
  const saveImageOffline2 = async (vendorId, imageData) => {
    const images = (await localForage.getItem("offlineImages2")) || [];
    images.push({ id: Date.now(), vendorId, imageData, timestamp: Date.now() });
    await localForage.setItem("offlineImages2", images);
  };

  // Remove image offline for this screen
  const removeOfflineImage2 = async (id) => {
    const images = (await localForage.getItem("offlineImages2")) || [];
    const filtered = images.filter((img) => img.id !== id);
    await localForage.setItem("offlineImages2", filtered);
  };

  const handleConfirmCapture = async () => {
    setConfirmLoading(true);
    if (!navigator.onLine) {
      await saveImageOffline2(id, capturedImage);
      alert("No internet. Image saved offline.");
      setCapturedImage(null);
      setConfirmLoading(false);
      setShowCamera(false);
      fetchOfflineImages();
      return;
    }
    try {
      // StoreID from localStorage, SupplierID from params, UserID from localStorage
      const StoreID = localStorage.getItem("StoreID");
      const SupplierID = id;
      const UserID = localStorage.getItem("UserID");
      // Convert base64 dataURL to Blob
      function dataURLtoBlob(dataurl) {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      }
      const imageBlob = dataURLtoBlob(capturedImage);
      const formData = new FormData();
      formData.append("StoreID", StoreID);
      formData.append("SupplierID", SupplierID);
      formData.append("UserID", UserID);
      formData.append("Image", imageBlob, "display.jpg");
      await axios.post(
        "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/Display_Insert",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowCamera(false);
      fetchDisplayList();
    } catch (err) {
      alert("Add image failed");
    }
    setCapturedImage(null);
    setConfirmLoading(false);
    fetchOfflineImages();
  };

  return (
    <div className="mobile-wrapper fixed-layout">
      <div className="top-header fixed-header">
        <span className="store-title">
          {localStorage.getItem("StoreName") || "Vendor Display List"}
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="logout"
            style={{
              backgroundColor: "#10b981",
              color: "white",
              padding: "10px 18px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
            onClick={fetchDisplayList}
          >
            Refresh
          </button>
          <button
            className="logout"
            style={{
              backgroundColor: "rgb(228, 60, 60)",
              color: "white",
              padding: "10px 18px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="scrollable-tasks">
        <h3 className="page-title">Display List</h3>
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",

              gap: 24,
              margin: "24px 0",
              alignItems: "center",
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #eee",
                  padding: 8,
                  position: "relative",
                  borderRadius: 12,
                  background: "#fff",
                  width: 130,
                  boxShadow: "0 2px 8px rgba(16,185,129,0.08)",
                }}
              >
                <div
                  style={{
                    width: 130,
                    height: 120,
                    borderRadius: 8,
                    background: "#f3f4f6",
                    marginBottom: 8,
                    animation:
                      "skeleton-loading 1.2s infinite linear alternate",
                  }}
                />
              </div>
            ))}
            <style>{`
              @keyframes skeleton-loading {
                0% { opacity: 1; }
                100% { opacity: 0.4; }
              }
            `}</style>
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
          }}
        >
          {/* Online images */}
          {displayList.map((item) => (
            <div
              key={item.ID}
              style={{
                border: "1px solid #eee",
                padding: 8,
                position: "relative",
                borderRadius: 12,
                background: "#fff",
              }}
            >
              <img
                src={item.ImageURL}
                alt="Display"
                style={{
                  width: 130,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <button
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  fontSize: 18,
                  cursor: "pointer",
                  padding: 0,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => {
                  setDeleteId(item.DisplayID);
                  setShowConfirm(true);
                }}
                title="Delete"
                aria-label="Delete"
              >
                <MdDelete size={22} color="#e23c3c" />
              </button>
            </div>
          ))}
          {/* Offline images */}
          {offlineImages.length > 0 && (
            <>
              {offlineImages.map((img) => (
                <div
                  key={img.id}
                  style={{
                    border: "2px dashed #f59e42",
                    padding: 8,
                    position: "relative",
                    borderRadius: 12,
                    background: "#fffbe6",
                  }}
                >
                  <img
                    src={img.imageData}
                    alt="Offline Display"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                      opacity: 0.7,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: 8,
                      top: 8,
                      background: "#f59e42",
                      color: "#fff",
                      borderRadius: 6,
                      padding: "2px 8px",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Offline
                  </span>
                </div>
              ))}
            </>
          )}
          {/* No display available message */}
          {!loading &&
            displayList.length === 0 &&
            offlineImages.length === 0 && (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  color: "#888",
                  fontWeight: 500,
                  fontSize: 18,
                  margin: "32px 0",
                }}
              >
                No display available
              </div>
            )}
        </div>
        <button
          onClick={handleAddDisplay}
          style={{
            marginTop: 24,
            backgroundColor: "#10b981",
            color: "white",
            padding: "12px 24px",
            borderRadius: "20px",
            fontSize: "15px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(16,185,129,0.08)",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          + Add Display
        </button>
      </div>

      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this image?"
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
      {showCamera && (
        <CameraModal
          onCapture={handleCapture}
          onConfirm={handleConfirmCapture}
          onRetake={() => setCapturedImage(null)}
          capturedImage={capturedImage}
          heading="Display Image"
          onClose={() => {
            setShowCamera(false);
            setCapturedImage(null);
          }}
          confirmLoading={confirmLoading}
        />
      )}
    </div>
  );
}
