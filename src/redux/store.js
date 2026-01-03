
// import { createStore, applyMiddleware } from "redux";
// import createSagaMiddleware from "redux-saga";
// import rootReducer from "./reducers/rootReducer";
// import rootSaga from "./sagas/rootSaga";

// const sagaMiddleware = createSagaMiddleware();

// const store = createStore(
//   rootReducer,
//   applyMiddleware(sagaMiddleware)
// );

// sagaMiddleware.run(rootSaga);

// export default store;


// import { createStore, applyMiddleware } from "redux";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // localStorage
// import createSagaMiddleware from "redux-saga";
// import rootReducer from "./reducers/rootReducer";
// import rootSaga from "./sagas/rootSaga";

// const sagaMiddleware = createSagaMiddleware();

// // Persist configuration
// const persistConfig = {
//   key: "root", // key for localStorage
//   storage, // localStorage
//   whitelist: ["capturedImages"], // Only persist capturedImages reducer
//   // Optional: transform images to save space
//   transforms: [
//     // You can add custom transforms here if needed
//   ]
// };

// // Create persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Create store with persisted reducer
// const store = createStore(
//   persistedReducer,
//   applyMiddleware(sagaMiddleware)
// );

// // Create persistor
// export const persistor = persistStore(store);

// sagaMiddleware.run(rootSaga);

// export default store; // Keep default export for backward compatibility


// import { createStore, applyMiddleware } from "redux";
// import { persistStore, persistReducer } from "redux-persist";
// import localForage from "localforage"; // ✅ IndexedDB
// import createSagaMiddleware from "redux-saga";
// import rootReducer from "./reducers/rootReducer";
// import rootSaga from "./sagas/rootSaga";

// const sagaMiddleware = createSagaMiddleware();

// // 🔹 Optional: configure IndexedDB instance
// localForage.config({
//   name: "myAppDB",          // IndexedDB database name
//   storeName: "reduxState",  // Object store name
//   description: "Persisted Redux State"
// });

// // 🔹 Persist configuration
// const persistConfig = {
//   key: "root",
//   storage: localForage,          // ✅ IndexedDB instead of localStorage
//   whitelist: ["capturedImages"], // persist only what you need
// };

// // 🔹 Create persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // 🔹 Create store
// const store = createStore(
//   persistedReducer,
//   applyMiddleware(sagaMiddleware)
// );

// // 🔹 Create persistor
// export const persistor = persistStore(store);

// // 🔹 Run sagas
// sagaMiddleware.run(rootSaga);

// export default store;


import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import localForage from "localforage";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers/rootReducer";
import rootSaga from "./sagas/rootSaga";

const sagaMiddleware = createSagaMiddleware();

// Configure IndexedDB
localForage.config({
  name: "myAppDB",
  storeName: "reduxState",
  description: "Persisted Redux State",
  version: 1.0,
  size: 4980736, // 5MB
});

// Persist configuration with user-based key
const persistConfig = {
  key: "root",
  storage: localForage,
  whitelist: ["capturedImages"],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = createStore(
  persistedReducer,
  applyMiddleware(sagaMiddleware)
);

// Create persistor
export const persistor = persistStore(store);

// Run sagas
sagaMiddleware.run(rootSaga);

export default store;