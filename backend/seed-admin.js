const bcrypt = require("bcryptjs");
const pool = require("./config/db");

async function seedAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await pool.execute(
      "UPDATE users SET password = ? WHERE username = 'admin'",
      [hashedPassword]
    );
    console.log("✅ Mot de passe admin hashé avec succès !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur:", err);
    process.exit(1);
  }
}

seedAdmin();
