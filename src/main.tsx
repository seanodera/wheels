import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import {BrowserRouter} from 'react-router'
import {store} from "@/store";
import {Provider} from "react-redux";
import posthog from 'posthog-js';
import {PostHogErrorBoundary, PostHogProvider} from '@posthog/react';

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_TOKEN, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    defaults: '2026-01-30',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PostHogProvider client={posthog}>
            <PostHogErrorBoundary>
                <BrowserRouter>
                    <Provider store={store}>
                        <App />
                    </Provider>
                </BrowserRouter>
            </PostHogErrorBoundary>
        </PostHogProvider>
    </React.StrictMode>,
)
