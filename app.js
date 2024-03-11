const express = require("express");
const fs = require("fs").promises;
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the CORS middleware

const app = express();
const PORT = 4500;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const dataFilePath = "./data.json";

// Create endpoint to retrieve data
app.get("/api/data", async (req, res) => {
    try {
        const data = await fs.readFile(dataFilePath, "utf8");
        res.json(JSON.parse(data));
    } catch (error) {
        console.error("Error reading data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create endpoint to add data
app.post("/api/data", async (req, res) => {
    try {
        const newData = req.body;
        let data = [];
        try {
            const existingData = await fs.readFile(dataFilePath, "utf8");
            data = JSON.parse(existingData);
        } catch (error) {
            console.error("No existing data file found.");
        }
        data.push(newData);
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
        res.json({ success: true, data: newData });
    } catch (error) {
        console.error("Error writing data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
