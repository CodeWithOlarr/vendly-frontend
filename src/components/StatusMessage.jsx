import { AlertCircle, Loader } from "lucide-react"

export function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader size={36} className="text-primary animate-spin" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  )
}

export function ErrorMessage({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <AlertCircle size={36} className="text-red-400" />
      <p className="text-gray-600 font-semibold">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary text-white px-5 py-2 rounded-full text-sm hover:opacity-90 transition"
        >
          Try Again
        </button>
      )}
    </div>
  )
}