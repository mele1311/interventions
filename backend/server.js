const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const interventionRoutes = require("./routes/interventions");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/interventions", interventionRoutes);

app.get("/", (req, res) => res.json({ message: "API Interventions opérationnelle" }));

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
