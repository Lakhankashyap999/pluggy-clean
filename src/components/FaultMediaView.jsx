// Read-only view of the fault photos + device a customer attached (admin / engineer / customer).
import { useState } from "react"
import { Camera, X } from "lucide-react"

export default function FaultMediaView({ request, compact = false }) {
  const [open, setOpen] = useState(null)
  const photos = request?.faultPhotos || []
  const device = request?.faultDevice
  if (!photos.length && !device) return null

  return (
    <div className="rounded-xl bg-orange-50 border border-orange-200 p-2.5">
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#F37021] flex items-center gap-1">
        <Camera size={12} /> Customer fault proof
      </p>
      {device && (
        <p className="text-xs font-semibold text-[#1A2A49] mt-1 break-words">Device: {device}</p>
      )}
      {photos.length > 0 && (
        <div className={`grid gap-1.5 mt-2 ${compact ? "grid-cols-4" : "grid-cols-3"}`}>
          {photos.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(src)}
              className="aspect-square rounded-lg overflow-hidden border border-orange-200 bg-white"
            >
              <img src={src} alt={`Fault ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center"
          >
            <X size={20} />
          </button>
          <img src={open} alt="Fault full" className="max-w-full max-h-full rounded-xl" />
        </div>
      )}
    </div>
  )
}
