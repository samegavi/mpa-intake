import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Thank you for your submission
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          We&apos;ve received your intake form and will be in touch. If you
          need to make any changes, please reach out directly.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium
                     hover:bg-indigo-700 transition"
        >
          Submit another response
        </Link>
      </div>
    </main>
  );
}
