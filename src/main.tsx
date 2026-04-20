import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import {BrowserRouter} from 'react-router'
import {store} from "@/store";
import {Provider} from "react-redux";
import posthog from 'posthog-js';
import * as Sentry from "@sentry/react";
import {PostHogErrorBoundary, PostHogProvider} from '@posthog/react';

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_TOKEN, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    defaults: '2026-01-30',
});

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    sendDefaultPii: true
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
