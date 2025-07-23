"use client";

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

function FallbackComponent({ error }) {
  return (
    <div className="p-4 text-red-500">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
    </div>
  );
}

export default function ErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ReactErrorBoundary>
  );
}