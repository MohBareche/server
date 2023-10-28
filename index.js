const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:5173", "http://10.0.0.217:5173", "*"],
        credentials: true,
    })
);

app.use("/auth", require("./routes/user.route"));
app.use("/customer", require("./routes/customer.route"));

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connecté a la base de données avec succes...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server démarré sur le port ${PORT}...`));
