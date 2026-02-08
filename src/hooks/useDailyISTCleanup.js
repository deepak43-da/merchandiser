import { useEffect } from "react";

/**
 * Hook to schedule daily cleanup of IndexedDB, localStorage, and Redux store at 00:00:01 IST.
 * @param {object} store - Redux store instance
 * @param {object} persistor - Redux persistor instance
 */
export default function useDailyISTCleanup(store, persistor) {
  useEffect(() => {
    function getISTDateString(date = new Date()) {
      // Returns YYYY-MM-DD for IST
      const istOffset = 5.5 * 60 * 60 * 1000;
      const utc = date.getTime() + date.getTimezoneOffset() * 60000;
      const ist = new Date(utc + istOffset);
      return ist.toISOString().slice(0, 10); // 'YYYY-MM-DD'
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
      await persistor.purge();
      store.dispatch({ type: "RESET_STORE" });
      localStorage.removeItem("auth");
      localStorage.removeItem("id");
      localStorage.removeItem("maindata");
    }

    // On mount, check if IST date has changed since last cleanup
    (async () => {
      const lastCleanupDate = localStorage.getItem("lastCleanupISTDate");
      const todayIST = getISTDateString();
      if (lastCleanupDate !== todayIST) {
        await cleanupData();
        localStorage.setItem("lastCleanupISTDate", todayIST);
      }
    })();

    // Set interval to check every minute if IST date has changed
    const intervalId = setInterval(async () => {
      const lastCleanupDate = localStorage.getItem("lastCleanupISTDate");
      const todayIST = getISTDateString();
      if (lastCleanupDate !== todayIST) {
        await cleanupData();
        localStorage.setItem("lastCleanupISTDate", todayIST);
      }
    }, 60 * 1000); // check every minute

    return () => {
      clearInterval(intervalId);
    };
  }, [store, persistor]);
}
