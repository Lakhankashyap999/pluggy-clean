// Customer attaches fault photos (camera / gallery) + device model so admin & engineer can verify.
import { useRef, useState } from "react"
import { Camera, ImagePlus, X } from "lucide-react"
import toast from "react-hot-toast"
import { getFaultDraft, setFaultDraft, compressImage } from "../lib/faultDraft"

const MAX_PHOTOS = 3

export default function FaultMediaUpload() {
  const [draft, setDraft] = useState(() => getFaultDraft())
  const camRef = useRef(null)
  const galRef = useRef(null)

  const update = (next) => {
    setDraft(next)
    setFaultDraft(next)
  }

  const handleFiles = async (files) => {
    const list = Array.from(files || [])
    if (!list.length) return
    const room = MAX_PHOTOS - draft.photos.length
    if (room <= 0) {
      toast.error(`Max ${MAX_PHOTOS} photos allowed`)
      return
    }
    try {
      const added = await Promise.all(
        list.filter((f) => f.type.startsWith("image/")).slice(0, room).map((f) => compressImage(f))
      )
      update({ ...draft, photos: [...draft.photos, ...added] })
    } catch {
      toast.error("Photo load nahi hui, dobara try karein")
    }
  }

  return (
    <div className="rounded-2xl border border-dashed border-[#F37021]/50 bg-orange-50/50 p-3.5 space-y-3">
      <div>
        <p className="text-sm font-extrabold text-[#1A2A49]">📸 Fault ki photo / device details</p>
        <p className="text-[11px] text-gray-500 leading-snug">
          Kharab device ki photo lein taaki admin verify kare aur engineer pehle se samajh sake (optional).
        </p>
      </div>

      <input
        value={draft.device}
        onChange={(e) => update({ ...draft, device: e.target.value })}
        placeholder="Device / model (e.g. Voltas 1.5T Split AC)"
        className="w-full h-10 px-3 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-[#1A2A49] focus:outline-none focus:border-[#F37021]"
      />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => camRef.current?.click()}
          className="h-10 rounded-xl bg-[#1A2A49] text-white text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <Camera size={15} /> Take Photo
        </button>
        <button
          type="button"
          onClick={() => galRef.current?.click()}
          className="h-10 rounded-xl bg-white border border-gray-200 text-[#1A2A49] text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <ImagePlus size={15} /> From Gallery
        </button>
      </div>
      <input
        ref={camRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ""
        }}
      />
      <input
        ref={galRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ""
        }}
      />

      {draft.photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {draft.photos.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white">
              <img src={src} alt={`Fault ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => update({ ...draft, photos: draft.photos.filter((_, idx) => idx !== i) })}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
