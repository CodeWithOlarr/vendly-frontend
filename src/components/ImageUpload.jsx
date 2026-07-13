import { useState, useRef } from "react"
import { Upload, X, Image, Loader } from "lucide-react"

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append("file",           file)
  formData.append("upload_preset",  UPLOAD_PRESET)
  formData.append("folder",         "vendly")

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  )

  if (!res.ok) throw new Error("Image upload failed")
  const data = await res.json()
  return data.secure_url
}

function ImageUpload({ value, onChange, label = "Product Image" }) {
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState(null)
  const [mode,      setMode]      = useState(value ? "preview" : "empty")
  const inputRef                  = useRef(null)

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    setError(null)
    setUploading(true)
    setMode("uploading")

    try {
      const url = await uploadToCloudinary(file)
      onChange(url)
      setMode("preview")
    } catch (err) {
      setError("Upload failed. Please try again.")
      setMode("empty")
    } finally {
      setUploading(false)
    }
  }

  function handleRemove() {
    onChange("")
    setMode("empty")
    setError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  function handleUrlChange(e) {
    onChange(e.target.value)
    if (e.target.value) setMode("preview")
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>

      {/* Upload Area */}
      {mode === "empty" && (
        <div className="flex flex-col gap-2">

          {/* Drag & Drop / Click to Upload */}
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Upload size={22} className="text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-600">
              Click to upload image
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Divider */}
          <div className="flex items-center gap-2">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400">or use URL</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          {/* URL Input */}
          <input
            type="text"
            value={value}
            onChange={handleUrlChange}
            placeholder="https://images.unsplash.com/..."
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
          />

        </div>
      )}

      {/* Uploading State */}
      {mode === "uploading" && (
        <div className="border-2 border-dashed border-primary rounded-xl p-6 text-center flex flex-col items-center gap-3">
          <Loader size={28} className="text-primary animate-spin" />
          <p className="text-sm font-semibold text-primary">Uploading image...</p>
          <p className="text-xs text-gray-400">Please wait</p>
        </div>
      )}

      {/* Preview State */}
      {mode === "preview" && value && (
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          <img
            src={value}
            alt="Product preview"
            className="w-full h-48 object-cover"
            onError={() => setMode("empty")}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2 flex items-center justify-between">
            <p className="text-xs text-white truncate">Image ready</p>
            <button
              type="button"
              onClick={() => {
                handleRemove()
                setTimeout(() => inputRef.current?.click(), 100)
              }}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <X size={12} /> {error}
        </p>
      )}

    </div>
  )
}

export default ImageUpload