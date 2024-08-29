import React from "react";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <section>
      <div style={{ backgroundColor: "red", color: "white", padding: "1rem" }}>
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Back Home</button>
      </div>
    </section>
  );
};

export default ErrorFallback;
