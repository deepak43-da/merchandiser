import { useNetworkStatus } from "../../components/useNetworkStatus";
import axios from "axios";

export const fetchTasks = (userId) => async (dispatch) => {
  try {
    // Fetch DailySchedule_Get
    const scheduleRes = await axios.post(
      "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/DailySchedule_Get",
      { StoreID: userId },
      { headers: { "Content-Type": "application/json" } },
    );
    const schedules = scheduleRes.data.data || [];

    // For each schedule, fetch DailyScheduleDisplayList_Get and merge into Displays
    const merged = await Promise.all(
      schedules.map(async (task) => {
        const displayRes = await axios.post(
          "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/DailyScheduleDisplayList_Get",
          {
            DOWork: task.DOWork,
            ScheduleID: task.ID,
            StoreID: task.StoreID,
            SupplierID: task.SupplierID,
          },
          { headers: { "Content-Type": "application/json" } },
        );
        return {
          ...task,
          Displays: displayRes.data.data || [],
        };
      }),
    );

    dispatch({ type: "SET_TASKS", payload: merged });
  } catch (error) {
    // Only clear tasks if online, otherwise preserve offline data
    if (window.navigator.onLine) {
      dispatch({ type: "SET_TASKS", payload: [] });
    }
    // else: do nothing, keep last good data
  }
};
