const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');

// Cross Origin Resource Sharing
app.use(cors());

// API Endpoint
app.get("/api/home", (req, res) => {
    res.json({message: "Hello World!"});
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})