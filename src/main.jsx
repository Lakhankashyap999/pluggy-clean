import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"
import { AppProvider } from "./AppContext"

// 🚫 Browser ki auto scroll-restore ko band karo
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual"
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>
)
