import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import localforage from "localforage";
import rootReducer from "./reducers/rootReducer";

const persistConfig = {
  key: "root",
  storage: localforage,
  whitelist: ["tasks"], // Only persist tasks (customize as needed)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
