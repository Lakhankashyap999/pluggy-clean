import emailjs from "@emailjs/browser"

// 👇 apne EmailJS ke IDs yahan daalna
const SERVICE_ID  = "service_xxx"      // e.g. service_123xyz
const TEMPLATE_ID = "template_xxx"     // e.g. template_abc456
const PUBLIC_KEY  = "public_xxx"       // e.g. AbCdEfGh123

export function sendRequestEmail({
  user_name,
  user_email,
  user_phone,
  service,
  issue,
  created_at,
}) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      user_name,
      user_email,
      user_phone,
      service,
      issue,
      created_at,
    },
    PUBLIC_KEY
  )
}
