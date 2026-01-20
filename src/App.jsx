import AppRoutes from "./routes/AppRoutes";
import ToasterProvider from "./ToasterProvider";
import React, { useEffect } from "react";
import { store } from "./redux/store";

export default function App() {
  useEffect(() => {
    // Helper to get next 00:00:01 IST from now
    function getNextISTMidnightPlusOneSecond() {
      const now = new Date();
      // IST is UTC+5:30
      const istOffset = 5.5 * 60 * 60 * 1000;
      const utcNow = now.getTime() + now.getTimezoneOffset() * 60000;
      const istNow = new Date(utcNow + istOffset);
      // Set to next day 00:00:01 IST
      const next = new Date(istNow);
      next.setHours(0, 0, 1, 0);
      if (istNow >= next) {
        next.setDate(next.getDate() + 1);
      }
      // Convert back to local time
      const localNext = new Date(
        next.getTime() - istOffset - next.getTimezoneOffset() * 60000,
      );
      return localNext;
    }

    // Helper to get most recent 00:00:01 IST before now
    function getLastISTMidnightPlusOneSecond() {
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const utcNow = now.getTime() + now.getTimezoneOffset() * 60000;
      const istNow = new Date(utcNow + istOffset);
      const last = new Date(istNow);
      last.setHours(0, 0, 1, 0);
      if (istNow < last) {
        last.setDate(last.getDate() - 1);
      }
      // Convert back to local time
      const localLast = new Date(
        last.getTime() - istOffset - last.getTimezoneOffset() * 60000,
      );
      return localLast;
    }

    async function cleanupData() {
      if (window.indexedDB && window.indexedDB.databases) {
        const databases = await window.indexedDB.databases();
        for (const db of databases) {
          if (db.name) {
            window.indexedDB.deleteDatabase(db.name);
          }
        }
      }
      localStorage.removeItem("auth");
      localStorage.removeItem("id");
      localStorage.removeItem("maindata");
    }

    // On load, check if last cleanup was before last 00:00:01 IST
    (async () => {
      const lastCleanup = localStorage.getItem("lastCleanupIST");
      const lastIST = getLastISTMidnightPlusOneSecond();
      if (!lastCleanup || new Date(lastCleanup) < lastIST) {
        await cleanupData();
        localStorage.setItem("lastCleanupIST", new Date().toISOString());
      }
    })();

    let timeoutId;
    let intervalId;

    const scheduleCleanup = () => {
      const now = new Date();
      const nextCleanup = getNextISTMidnightPlusOneSecond();
      const msUntilNext = nextCleanup - now;
      timeoutId = setTimeout(async () => {
        await cleanupData();
        localStorage.setItem("lastCleanupIST", new Date().toISOString());
        // After running, set interval for every 24h
        intervalId = setInterval(
          async () => {
            await cleanupData();
            localStorage.setItem("lastCleanupIST", new Date().toISOString());
          },
          24 * 60 * 60 * 1000,
        );
      }, msUntilNext);
    };

    scheduleCleanup();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Make store available globally for syncQueue function
  window.store = store;

  // Initialize offline sync
  store.dispatch({
    type: "SET_NETWORK_STATUS",
    payload: navigator.onLine ? "online" : "offline",
  });

  // Periodically sync when online
  setInterval(() => {
    if (navigator.onLine) {
      import("./redux/actions/offlineActions").then(({ syncQueue }) => {
        syncQueue(store.dispatch, () => store.getState());
      });
    }
  }, 30000); // Sync every 30 seconds when online

  return (
    <>
      <ToasterProvider />
      <AppRoutes />
    </>
  );
}
