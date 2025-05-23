const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./respuestas.db');

db.run(`
  CREATE TABLE IF NOT EXISTS respuestas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT,
    perfil TEXT,
    recomendacion TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.post('/api/respuestas', (req, res) => {
  const { data, perfil, recomendacion } = req.body;

  db.run(
    'INSERT INTO respuestas (data, perfil, recomendacion) VALUES (?, ?, ?)',
    [JSON.stringify(data), perfil, recomendacion],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al guardar en base de datos' });
      } else {
        res.json({ id: this.lastID });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
