import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import TaskList from "../pages/TaskList";
import TaskDetail from "../pages/TaskDetail";
import AdminVendorList from "../pages/AdminVendorList";
import AdminVendorDisplayList from "../pages/AdminVendorDisplayList";
import React from "react";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/tasks/:id" element={<TaskList />} />
      <Route
        path="/task/:Store/:ActivityID/:StoreID/:SupplierID/:ScheduleID/:Supplier/:Activity/:Duration/:DOWork"
        element={<TaskDetail />}
      />
      <Route path="/admin/vendors" element={<AdminVendorList />} />
      <Route path="/admin/vendor/:id" element={<AdminVendorDisplayList />} />
    </Routes>
  );
}
