const express = require("express");
const pool = require("../config/db");
const { authenticateToken, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET /api/interventions — Admin & Directeur : toutes, User : les siennes
router.get("/", authenticateToken, async (req, res) => {
  try {
    let query, params;
    if (req.user.role === "admin" || req.user.role === "directeur") {
      query = "SELECT * FROM interventions ORDER BY created_at DESC";
      params = [];
    } else {
      query = "SELECT * FROM interventions WHERE user_id = ? ORDER BY created_at DESC";
      params = [req.user.id];
    }
    const [rows] = await pool.execute(query, params);
    res.json(rows.map((r) => ({ ...r, id: String(r.id), user_id: String(r.user_id) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/interventions — User & Admin
router.post("/", authenticateToken, (req, res, next) => {
  console.log("POST /api/interventions - user role:", req.user.role, "user id:", req.user.id);
  next();
}, requireRole("admin", "technicien"), async (req, res) => {
  try {
    const { full_name, problem_description, location, actions_taken, date_of_intervention, is_solved } = req.body;
    if (!full_name || !problem_description || !location || !actions_taken || !date_of_intervention) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const [result] = await pool.execute(
      `INSERT INTO interventions (user_id, full_name, problem_description, location, actions_taken, date_of_intervention, is_solved)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, full_name, problem_description, location, actions_taken, date_of_intervention, is_solved ? 1 : 0]
    );

    res.status(201).json({
      id: String(result.insertId),
      user_id: String(req.user.id),
      full_name,
      problem_description,
      location,
      actions_taken,
      date_of_intervention,
      is_solved: !!is_solved,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /api/interventions/:id — Admin uniquement
router.put("/:id", authenticateToken, requireRole("admin", "technicien"), async (req, res) => {
  try {
    // Users can only edit their own interventions
    if (req.user.role === "user") {
      const [rows] = await pool.execute("SELECT user_id FROM interventions WHERE id = ?", [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: "Intervention non trouvée" });
      if (String(rows[0].user_id) !== String(req.user.id)) {
        return res.status(403).json({ error: "Vous ne pouvez modifier que vos propres interventions" });
      }
    }
    const { full_name, problem_description, location, actions_taken, date_of_intervention, is_solved } = req.body;
    await pool.execute(
      `UPDATE interventions SET full_name=?, problem_description=?, location=?, actions_taken=?, date_of_intervention=?, is_solved=? WHERE id=?`,
      [full_name, problem_description, location, actions_taken, date_of_intervention, is_solved ? 1 : 0, req.params.id]
    );
    res.json({ message: "Intervention mise à jour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /api/interventions/:id — Admin uniquement
router.delete("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    await pool.execute("DELETE FROM interventions WHERE id = ?", [req.params.id]);
    res.json({ message: "Intervention supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
