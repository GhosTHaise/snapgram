
import ReactDOM  from "react-dom/client";
import App from "./App";
import { BrowserRouter, createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import QueryProvider from "./lib/react-query/QueryProvider";
import * as Sentry from "@sentry/react"
import React from "react";

Sentry.init({
    dsn: import.meta.env.VITE_APPWRITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        // See docs for support of different versions of variation of react router
        // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
      new Sentry.Replay()
    ],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    tracesSampleRate: 1.0,
  
    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  
    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
  

ReactDOM.createRoot(document.getElementById("root")!)
    .render(
        <BrowserRouter>
            <AuthProvider>
                <QueryProvider>
                    <App />
                </QueryProvider>
            </AuthProvider>
        </BrowserRouter>
    )
