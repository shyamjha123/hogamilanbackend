const express = require("express");
const fs = require("fs").promises;
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 4500;

app.use(cors());
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

// Create endpoint to update data using PUT method
app.put("/api/data", async (req, res) => {
    try {
        const newData = req.body;
        let data = [];
        try {
            const existingData = await fs.readFile(dataFilePath, "utf8");
            data = JSON.parse(existingData);
            // Find the index of the data to be updated
            const dataIndex = data.findIndex(item => item.id === newData.id);
            if (dataIndex !== -1) {
                // Update the data at the found index
                data[dataIndex] = newData;
                await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
                res.json({ success: true, data: newData });
            } else {
                res.status(404).json({ error: "Data not found" });
            }
        } catch (error) {
            console.error("Error updating data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
