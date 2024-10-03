import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import OrderManagement from "./OrderManagement.jsx";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { persistor, store } from '../src/redux/store.js'
import { PersistGate } from 'redux-persist/integration/react';
createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />,
            <ToastContainer />
        </PersistGate>
    </Provider>

);
