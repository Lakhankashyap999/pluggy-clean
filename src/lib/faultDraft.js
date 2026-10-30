// Draft of fault photos + device details that the customer attaches before paying.
// addRequest() in AppContext reads it, attaches it to the booking and clears it.
const KEY = "pluggy_fault_draft"
const EMPTY = { photos: [], device: "", note: "" }

export function getFaultDraft() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "null")
    return { ...EMPTY, ...(parsed || {}) }
  } catch {
    return { ...EMPTY }
  }
}

export function setFaultDraft(draft) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...EMPTY, ...draft }))
  } catch {
    /* storage full - ignore */
  }
}

export function clearFaultDraft() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

// Resize + compress an image File to a small JPEG data URL (keeps storage & cloud sync light).
export function compressImage(file, maxSide = 480, quality = 0.5) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
