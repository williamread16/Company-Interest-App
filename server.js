const express = require("express");
const path = require("path");

const app = express();

app.use("/static", express.static(path.resolve(__dirname, "static")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "templates", "index.html"));
});

app.get("/company/:company_name", (req, res) => {
    res.sendFile(path.resolve(__dirname, "templates", "companies.html"));
});

app.listen(process.env.PORT || 8080, () => console.log("Server Starting...."));