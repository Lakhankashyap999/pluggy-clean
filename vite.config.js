import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.lottie"],   // 👈 ye line add kar
})
