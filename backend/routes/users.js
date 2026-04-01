const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { authenticateToken, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET /api/users — Admin uniquement
router.get("/", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, username, full_name, email, role, created_at FROM users"
    );
    res.json(rows.map((u) => ({ ...u, id: String(u.id) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/users — Admin uniquement
router.post("/", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { username, full_name, email, password, role } = req.body;
    if (!username || !full_name || !email || !password || !role) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      "INSERT INTO users (username, full_name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [username, full_name, email, hashedPassword, role]
    );

    res.status(201).json({
      id: String(result.insertId),
      username,
      full_name,
      email,
      role,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Nom d'utilisateur ou email déjà utilisé" });
    }
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /api/users/:id — Admin uniquement
router.delete("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    await pool.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
