import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import "./taskList.css";
import { persistor } from "../redux/store";
import { toast } from "react-toastify";

export default function TaskList() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const maindata = JSON.parse(localStorage.getItem("maindata")) || [];
  useEffect(() => {
    if (id) {
      fetchTasks();
    }
  }, [id]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/DailySchedule_Get",
        { StoreID: Number(id) },
        { headers: { "Content-Type": "application/json" } }
      );

      // Use backend keys directly
      setTasks(response.data.data || []);
    } catch (error) {
      console.error("API error:", error);
      alert("API error");
      setTasks([]);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  // ... (previous imports and code remain the same until handleLogout) ...

  const handleLogout = () => {
    // Only clear session data, NOT the captured images
    localStorage.removeItem("auth");
    localStorage.removeItem("id");
    // Note: We keep 'maindata' to avoid unnecessary API calls
    // localStorage.removeItem('maindata');
    toast.error("Logout successful!");
    // Navigate to login
    navigate("/");
  };

  // ... (rest of the component remains the same) ...

  // const handleLogout = () => {
  //   // 1. Dispatch logout action
  //   // dispatch({ type: "LOGOUT" });

  //   // 2. Clear localStorage completely
  //   localStorage.clear();

  //   // 3. Clear sessionStorage
  //   sessionStorage.clear();

  //   // 4. Clear IndexedDB if used
  //   if (window.indexedDB) {
  //     window.indexedDB.databases().then((databases) => {
  //       databases.forEach((db) => {
  //         if (db.name) {
  //           window.indexedDB.deleteDatabase(db.name);
  //         }
  //       });
  //     });
  //   }
  // localStorage.setItem("maindata", [])

  //   // 5. Clear all cookies
  //   document.cookie.split(";").forEach((c) => {
  //     document.cookie = c
  //       .replace(/^ +/, "")
  //       .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  //   });

  //   // 6. Force a full page reload with cache clear
  //   navigate("/");
  //   window.location.reload();
  // };

  // In TaskList.js

  // const handleLogout = () => {
  //   localStorage.setItem("auth", false);
  //   localStorage.setItem("id", 0);

  //   // Purge persisted storage
  //   persistor.purge();

  //   // Optional: Dispatch logout action to reset redux state
  //   // dispatch({ type: "LOGOUT" });

  //   navigate("/");
  // };

  // const handleLogout = () => {
  //   localStorage.setItem("auth", false);
  //   localStorage.setItem("id", 0);
  //   // localStorage.removeItem("persist:root");
  //   navigate("/");
  // };

  // 🔹 ACTIVE / INACTIVE LOGIC
  // const isTaskActive = (task) => {
  //   const now = new Date();

  //   // Date range check
  //   const startDate = new Date(task.StartDate);
  //   const endDate = new Date(task.EndDate);
  //   endDate.setHours(23, 59, 59, 999);

  //   if (now < startDate || now > endDate) return false;

  //   // TimeSlot bucket check
  //   const hour = now.getHours();

  //   if (task.TimeSlot === "Morning") {
  //     return hour >= 5 && hour < 12;
  //   }

  //   if (task.TimeSlot === "Afternoon") {
  //     return hour >= 12 && hour < 17;
  //   }

  //   if (task.TimeSlot === "Evening") {
  //     return hour >= 17 && hour <= 23;
  //   }

  //   return false;
  // };

  const isTaskActive = (task) => {
    const now = new Date();

    // ---- DATE RANGE CHECK ----
    const startDate = new Date(task.StartDate);
    const endDate = new Date(task.EndDate);
    endDate.setHours(23, 59, 59, 999);

    if (now < startDate || now > endDate) return false;

    // ---- TIME SLOT CHECK ----
    const currentHour = now.getHours();

    if (task.TimeSlot === "Evening") {
      // Evening: 3pm (15:00) to 6pm (18:00)
      return currentHour >= 15 && currentHour < 18;
    }

    if (task.TimeSlot === "Night") {
      // Night: 6pm (18:00) to midnight (0:00)
      return currentHour >= 18 && currentHour <= 23;
    }

    // If TimeSlot doesn't match Evening or Night, return false
    return false;
  };

  const auth = localStorage.getItem("auth");

  useEffect(() => {
    if (auth !== "true") {
      localStorage.removeItem("auth");
      localStorage.removeItem("id");
      navigate("/");
    }
  }, [auth]);

  const skeletonCount = 5;

  return (
    <div className="mobile-wrapper fixed-layout">
      {/* HEADER */}
      <div
        className="top-header fixed-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span className="store-title">{tasks?.[0]?.Store || ""}</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
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
            onClick={fetchTasks}
          >
            Reload
          </button>
          <button
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
        <h3 className="page-title">Today's Tasks</h3>
        {loading ? (
          Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className="task-card">
              <Stack spacing={1}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="rectangular" width="100%" height={16} />
                <Skeleton variant="text" width="40%" height={16} />
                <Skeleton variant="text" width="50%" height={16} />
              </Stack>
            </div>
          ))
        ) : tasks.length === 0 ? (
          <div className="no-tasks">No tasks found</div>
        ) : (
          <div
            style={{
              overflowY: "auto",
              maxHeight: "66vh",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            {tasks.map((t) => {
              const active = isTaskActive(t);
              return (
                <div
                  style={{
                    marginBottom: "20px",
                    cursor: active ? "pointer" : "not-allowed",
                  }}
                  key={t.ActivityID}
                  onClick={() => {
                    if (active) {
                      const url = `/task/${encodeURIComponent(
                        t?.Store
                      )}/${encodeURIComponent(
                        t.ActivityID
                      )}/${encodeURIComponent(t.StoreID)}/${encodeURIComponent(
                        t.SupplierID
                      )}/${encodeURIComponent(t.ID)}/${encodeURIComponent(
                        t.Supplier
                      )}/${encodeURIComponent(t.Activity)}/${encodeURIComponent(
                        t.Duration
                      )}/${encodeURIComponent(t.DOWork)}`;
                      navigate(url);
                    }
                  }}
                  className={`task-card ${active ? "active" : "inactive"}`}
                >
                  <div className="task-row">
                    <span className="task-title">
                      {t.Supplier} - {t.Activity}
                    </span>
                    <span
                      className={`status-pill ${
                        active ? "active" : "inactive"
                      }`}
                    >
                      {active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="task-id">Hrs Book: {t.Duration} hrs</div>
                  <div className="task-id">
                    Display Completed: {t?.DisplayCount ?? 0}/
                    {t?.DisplayOutOf ?? 0}
                  </div>

                  <div className="task-info">
                    <div className="info-row">🕒 {t.TimeSlot}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="footer fixed-footer">
        <div>Evening (3pm till Before 6pm)</div>
        <div>Night (6pm till Before Midnight)</div>
      </div>
    </div>
  );
}
