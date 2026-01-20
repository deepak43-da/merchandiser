import localForage from "localforage";

// Store all tasks data offline
export async function saveTasksOffline(tasks) {
  await localForage.setItem("offlineTasks", tasks);
}

export async function getTasksOffline() {
  return (await localForage.getItem("offlineTasks")) || [];
}

// Queue for actions to sync (e.g., image uploads, completions)
export async function queueAction(action) {
  const queue = (await localForage.getItem("offlineQueue")) || [];
  queue.push({ ...action, timestamp: Date.now() });
  await localForage.setItem("offlineQueue", queue);
}

export async function getQueuedActions() {
  return (await localForage.getItem("offlineQueue")) || [];
}

export async function clearQueuedActions() {
  await localForage.setItem("offlineQueue", []);
}
