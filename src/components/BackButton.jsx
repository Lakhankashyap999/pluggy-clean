import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function BackButton() {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(-1)}
      className="mb-4 flex items-center gap-2 text-[#1A2A49] hover:text-[#223a61] font-medium"
    >
      <ArrowLeft size={20} />
      Back
    </button>
  )
}
