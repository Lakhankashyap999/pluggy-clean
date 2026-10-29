import emailjs from "@emailjs/browser"

// 👇 apne EmailJS ke IDs yahan daalna (ya .env mein VITE_EMAILJS_SERVICE_ID etc.)
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_xxx"
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_xxx"
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "public_xxx"

export async function sendRequestEmail({
  user_name,
  user_email,
  user_phone,
  service,
  issue,
  amount,
  address,
  created_at,
}) {
  // If placeholder credentials are used, simulate email dispatch cleanly
  if (SERVICE_ID === "service_xxx" || PUBLIC_KEY === "public_xxx") {
    return Promise.resolve({ status: 200, text: "OK (Simulated)" })
  }

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      user_name,
      user_email,
      user_phone,
      service,
      issue,
      amount,
      address,
      created_at,
    },
    PUBLIC_KEY
  )
}
