import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { persistor, store } from "../src/redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { StateProvider } from "./Context/StateProvider.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StateProvider>
        <App />
        <ToastContainer />
      </StateProvider>
    </PersistGate>
  </Provider>
);
