import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import {ConfigProvider, theme} from 'antd'


const themeConfig = {
    "token": {
        "colorPrimary": "#FF3D00",
        "colorSecondary": "#006874",
        "colorDark": "#262626"
    },
    "algorithm": theme.darkAlgorithm
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ConfigProvider theme={themeConfig}>
                <App />
            </ConfigProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
