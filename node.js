// server.js
import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;
const CLEARBIT_KEY = "YOUR_CLEARBIT_KEY_HERE"; // replace with your API key

// Serve static HTML file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// API endpoint to lookup name
app.get("/lookup", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "email required" });

  try {
    const response = await fetch(`https://person.clearbit.com/v2/people/find?email=${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${CLEARBIT_KEY}` },
    });

    if (!response.ok) {
      return res.status(response.status).json({ name: null });
    }

    const data = await response.json();
    const name = data.name && data.name.fullName ? data.name.fullName : null;

    res.json({ name });
  } catch (err) {
    res.status(500).json({ error: "lookup failed" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
