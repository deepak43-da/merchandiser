


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import "./taskList.css";
import { persistor } from "../redux/store";

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
      // const response = await axios.post(
      //   "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/DailySchedule_Get",
      //   { StoreID: Number(id) },
      //   { headers: { "Content-Type": "application/json" } }
      // );

     setTasks(maindata);
    } catch (error) {
      console.error("API error:", error);
      alert("API error");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  // ... (previous imports and code remain the same until handleLogout) ...

const handleLogout = () => {
  // Only clear session data, NOT the captured images
  localStorage.removeItem('auth');
  localStorage.removeItem('id');
  // Note: We keep 'maindata' to avoid unnecessary API calls
  // localStorage.removeItem('maindata');
  
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

  // ---- SLOT START TIME (12:00 PM) ----
  const slotStart = new Date();
  slotStart.setHours(12, 0, 0, 0); // 12:00 PM

  // ---- SLOT END TIME = start + duration ----
  const slotEnd = new Date(slotStart);
  slotEnd.setHours(slotEnd.getHours() + Number(task.Duration || 0));

  return now >= slotStart && now <= slotEnd;
};


  const skeletonCount = 5;

  return (
    <div className="mobile-wrapper">
      {/* HEADER */}
      <div className="top-header">
        <span className="store-title">
          {tasks?.[0]?.Store || ""}
        </span>
        <span className="logout" onClick={handleLogout}>
          Logout
        </span>
      </div>

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
        tasks.map((t) => {
          const active = isTaskActive(t);

          return (
            <div
            style={{marginBottom:"20px"}}
              key={t.ActivityID}
            //   onClick={() => 
            //     {active && navigate(`/task/${t.ActivityID}/${t.StoreID}/${t.ID}/${t.Supplier}/${t.Activity}`)}}
            //   className={`task-card ${active ? "active" : "inactive"}`}
            // >
               onClick={() => 
                 navigate(`/task/${t.ActivityID}/${t.StoreID}/${t.ID}/${t.Supplier}/${t.Activity}`)}
             >
              <div className="task-row">
                <span className="task-title">{t.Supplier} - {t.Activity}</span>
                <span className={`status-pill ${active ? "active" : "inactive"}`}>
                  {active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="task-id">Store: {t.Store}</div>

              <div className="task-info">
                <div className="info-row">🕒 {t.TimeSlot}</div>
                {/* <div className="info-row">
                  📅 {t.StartDate} - {t.EndDate}
                </div> */}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
