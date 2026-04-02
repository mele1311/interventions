const bcrypt = require("bcryptjs");
const pool = require("./config/db");

const ADMIN_USER = {
  username: "admin",
  fullName: "Administrateur",
  email: "admin@example.com",
  password: "admin123",
  role: "admin",
};

async function seedAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(ADMIN_USER.password, 10);
    await pool.execute(
      `INSERT INTO users (username, full_name, email, password, role)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         full_name = VALUES(full_name),
         email = VALUES(email),
         password = VALUES(password),
         role = VALUES(role)`,
      [
        ADMIN_USER.username,
        ADMIN_USER.fullName,
        ADMIN_USER.email,
        hashedPassword,
        ADMIN_USER.role,
      ]
    );
    console.log("✅ Utilisateur admin créé ou mis à jour avec succès !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur:", err);
    process.exit(1);
  }
}

seedAdmin();
