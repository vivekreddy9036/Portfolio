import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
// Ensure Supabase sync runs early if env is present
import { syncFromSupabase } from './supabase.js';
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)

// attempt background sync (non-blocking)
try {
  syncFromSupabase().catch(() => {});
} catch (e) {}
