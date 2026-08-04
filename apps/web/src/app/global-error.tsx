"use client"

import React, { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global error caught:", error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", backgroundColor: "#09090b", color: "#f4f4f5", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ maxWidth: "480px", margin: "auto", padding: "2rem", textAlign: "center", backgroundColor: "#18181b", borderRadius: "1rem", border: "1px solid #27272a", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>System Error</h2>
          <p style={{ fontSize: "0.875rem", color: "#a1a1aa", marginBottom: "1.5rem" }}>
            {error?.message || "A critical application error occurred."}
          </p>
          <button
            onClick={() => reset()}
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem", fontWeight: 600, color: "#ffffff", backgroundColor: "#27272a", border: "1px solid #3f3f46", borderRadius: "0.5rem", cursor: "pointer" }}
          >
            Refresh Application
          </button>
        </div>
      </body>
    </html>
  )
}
