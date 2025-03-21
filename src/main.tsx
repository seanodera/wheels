import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import {ConfigProvider, theme} from 'antd'
import {store} from "@/store.ts";
import {Provider} from "react-redux";


const themeConfig = {
    "token": {
        "colorPrimary": "#00e5ff",
        "colorSecondary": "#ffd700",
        "colorDark": "#001315"
    },
    "algorithm": theme.darkAlgorithm
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <ConfigProvider theme={themeConfig}>
                    <App />
                </ConfigProvider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
)
