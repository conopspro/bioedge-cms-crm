"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("t")

  const [status, setStatus] = useState<"loading" | "success" | "error" | "invalid">("loading")
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setStatus("invalid")
      return
    }

    fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEmail(data.email)
          setStatus("success")
        } else {
          setStatus("error")
        }
      })
      .catch(() => setStatus("error"))
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-10 text-center">
        <div className="mb-6 flex justify-center">
          <img
            src="https://qfilerjwqhphxheqnozl.supabase.co/storage/v1/object/public/media/general/bioedge-logo.png"
            alt="BioEdge"
            className="h-10 w-auto"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = "none"
            }}
          />
        </div>

        {status === "loading" && (
          <>
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <p className="text-gray-600">Processing your request…</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">You&rsquo;ve been unsubscribed</h1>
            {email && (
              <p className="mb-4 text-gray-500 text-sm break-all">
                <span className="font-medium text-gray-700">{email}</span> has been removed from our mailing list.
              </p>
            )}
            <p className="text-gray-500 text-sm">
              You won&rsquo;t receive any further emails from us. If this was a mistake, please{" "}
              <a href="mailto:info@bioedgelongevity.com" className="text-blue-600 underline">
                contact us
              </a>
              .
            </p>
          </>
        )}

        {status === "invalid" && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Invalid link</h1>
            <p className="text-gray-500 text-sm">
              This unsubscribe link is missing required information. Please use the link from your original email.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Something went wrong</h1>
            <p className="text-gray-500 text-sm">
              We couldn&rsquo;t process your request. Please try again or{" "}
              <a href="mailto:info@bioedgelongevity.com" className="text-blue-600 underline">
                contact us
              </a>{" "}
              directly to be removed.
            </p>
          </>
        )}

        <div className="mt-8 border-t border-gray-100 pt-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← Return to bioedgelongevity.com
          </Link>
        </div>
      </div>
    </div>
  )
}
