require('dotenv').config();
const express = require('express');
const path = require('path');
const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cambiaesto';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Enviar una confesion anonima
app.post('/api/confess', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacio' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: 'El mensaje es demasiado largo (max 1000 caracteres)' });
    }

    const result = await pool.query(
      'INSERT INTO confessions (content) VALUES ($1) RETURNING id',
      [message.trim()]
    );

    res.status(201).json({ ok: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Error al guardar confesion:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

function requireAdmin(req, res, next) {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
}

app.get('/api/confessions', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, content, created_at FROM confessions ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al listar confesiones:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.delete('/api/confessions/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM confessions WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al borrar confesion:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor de Confesiones corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('No se pudo iniciar la base de datos:', err);
    process.exit(1);
  });
