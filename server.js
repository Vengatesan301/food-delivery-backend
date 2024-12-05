import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Proxy endpoint for Swiggy API
app.get("/api/restaurants", async (req, res) => {
  const { lat, lng } = req.query;
  const swiggyAPI = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;

  try {
    const response = await fetch(swiggyAPI, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Swiggy API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching Swiggy API:", error.message);
    res.status(500).json({ error: "Failed to fetch data from Swiggy API" });
  }
});
console.log(":::::::::")
app.get("/api/menu/:resId", async (req, res) => {
  console.log("Request received at /api/menu/:resId");
console.log("Received resId:", req.params.resId);

  
  const { resId } = req.params; // Get restaurantId from query params
  const url = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=12.9351929&lng=77.62448069999999&restaurantId=${resId}`;

  try {
    //const response = await fetch(url);
    const response = await fetch(url, { 
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Swiggy API error: ${response.status}`);
    }
    const data = await response.json();
    console.log(data,"data")
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from Swiggy" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend is running at http://localhost:${PORT}`);
});
