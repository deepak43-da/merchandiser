import localForage from "localforage";

// Store all display list data offline
export async function saveDisplayListOffline(key, displayList) {
  await localForage.setItem(`offlineDisplayList_${key}`, displayList);
}

export async function getDisplayListOffline(key) {
  return (await localForage.getItem(`offlineDisplayList_${key}`)) || [];
}
