import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import "./tasklist.css";
import { Skeleton, Stack } from "@mui/material";

export default function AdminVendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const StoreID = localStorage.getItem("StoreID");
      const response = await axios.post(
        "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/VendorList_Get",
        { StoreID: Number(StoreID) },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Use backend keys directly
      setVendors(response.data.data || []);
    } catch (err) {
      setVendors([]);
      alert("Failed to fetch vendor list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const skeletonCount = 5;

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("id");
    localStorage.removeItem("maindata");
    toast.error("Logout successful!");
    navigate("/");
  };

  const storeName = localStorage.getItem("StoreName") || "Admin Panel";
  return (
    <div className="mobile-wrapper fixed-layout">
      <div className="top-header fixed-header">
        <span className="store-title">{storeName}</span>
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
            onClick={fetchVendors}
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
        <h3 className="page-title">Vendor List</h3>
        {loading ? (
          Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className="task-card">
              <Stack spacing={1}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="rectangular" width="100%" height={16} />
              </Stack>
            </div>
          ))
        ) : vendors.length === 0 ? (
          <div className="no-tasks">No vendors found</div>
        ) : (
          <div
            style={{
              overflowY: "auto",
              maxHeight: "66vh",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            {vendors.map((vendor) => (
              <div
                key={vendor.SupplierID}
                className="task-card active"
                style={{ marginBottom: "20px", cursor: "pointer" }}
                onClick={() => navigate(`/admin/vendor/${vendor.SupplierID}`)}
              >
                <div className="task-row">
                  <span className="task-title">{vendor.Supplier}</span>
                </div>
                <div className="task-id">
                  Display Count: {vendor.DisplayCount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* No footer for admin */}
    </div>
  );
}
