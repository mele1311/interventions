const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

const normalizeStoredHash = (value = "") => value.replace(/^\$2y\$/, "$2a$");
const isBcryptHash = (value = "") => /^\$2[aby]\$\d{2}\$/.test(value);

const verifyPassword = async (plainPassword, storedPassword) => {
  if (typeof storedPassword !== "string" || !storedPassword) {
    return { valid: false, needsRehash: false };
  }

  const normalizedHash = normalizeStoredHash(storedPassword);

  if (isBcryptHash(normalizedHash)) {
    const valid = await bcrypt.compare(plainPassword, normalizedHash);
    return {
      valid,
      needsRehash: valid && normalizedHash !== storedPassword,
    };
  }

  return {
    valid: plainPassword === storedPassword,
    needsRehash: plainPassword === storedPassword,
  };
};

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Champs requis" });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const user = rows[0];
    console.log("User found:", user.username, "| Password column length:", (user.password || "").length, "| isBcrypt:", isBcryptHash(normalizeStoredHash(user.password)));
    const { valid, needsRehash } = await verifyPassword(password, user.password);
    console.log("Password check result:", { valid, needsRehash });
    if (!valid) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    if (needsRehash) {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.execute("UPDATE users SET password = ? WHERE id = ?", [
          hashedPassword,
          user.id,
        ]);
      } catch (rehashError) {
        console.warn("Impossible de mettre à jour le hash du mot de passe:", rehashError);
      }
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: String(user.id),
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
