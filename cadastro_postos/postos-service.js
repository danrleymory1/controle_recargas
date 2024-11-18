const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const app = express();

app.use(bodyParser.json());

const db = new sqlite3.Database('./postos.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    }
});

db.run(`CREATE TABLE IF NOT EXISTS postos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    endereco TEXT
)`);
app.post('/postos', (req, res) => {
    const { nome, endereco, latitude, longitude } = req.body;
    db.run(`INSERT INTO postos (nome, endereco) VALUES (?, ?)`, 
    [nome, endereco, latitude, longitude], 
    function (err) {
        if (err) {
            return res.status(500).send('Erro ao cadastrar posto.');
        }
        res.status(201).send({ id: this.lastID });
    });
});
app.get('/postos', (req, res) => {
    db.all(`SELECT * FROM postos`, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Erro ao obter postos.');
        }
        res.status(200).json(rows);
    });
});
app.get('/postos/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM postos WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).send('Erro ao obter posto.');
        }
        if (!row) {
            return res.status(404).send('Posto não encontrado.');
        }
        res.status(200).json(row);
    });
});
app.patch('/postos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, endereco} = req.body;
    db.run(`UPDATE postos SET nome = COALESCE(?, nome), endereco = COALESCE(?, endereco) WHERE id = ?`, 
    [nome, endereco, latitude, longitude, id], 
    function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar posto.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Posto não encontrado.');
        }
        res.status(200).send('Posto atualizado!');
    });
});

app.delete('/postos/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM postos WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).send('Erro ao remover posto.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Posto não encontrado.');
        }
        res.status(200).send('Posto removido com sucesso!');
    });
});

app.listen(8081, () => console.log('Cadastro de Postos rodando na porta 8081'));
