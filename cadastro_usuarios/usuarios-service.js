const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const app = express();

app.use(bodyParser.json());

const db = new sqlite3.Database('./usuarios.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    }
});

db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf INTEGER UNIQUE NOT NULL,
    email TEXT NOT NULL,
    cartao_credito INTEGER NOT NULL
)`);
app.post('/usuarios', (req, res) => {
    const { nome, cpf, email, cartao_credito } = req.body;
    db.run(`INSERT INTO usuarios (nome, cpf, email, cartao_credito) VALUES (?, ?, ?, ?)`, 
    [nome, cpf, email, cartao_credito], 
    function (err) {
        if (err) {
            return res.status(500).send('Erro ao cadastrar usuário.');
        }
        res.status(201).send({ id: this.lastID });
    });
});

app.get('/usuarios', (req, res) => {
    db.all(`SELECT * FROM usuarios`, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Erro ao obter usuários.');
        }
        res.status(200).json(rows);
    });
});

app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM usuarios WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).send('Erro ao obter usuário.');
        }
        if (!row) {
            return res.status(404).send('Usuário não encontrado.');
        }
        res.status(200).json(row);
    });
});

app.patch('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, cartao_credito } = req.body;
    db.run(`UPDATE usuarios SET nome = COALESCE(?, nome), email = COALESCE(?, email), cartao_credito = COALESCE(?, cartao_credito) WHERE id = ?`, 
    [nome, email, cartao_credito, id], 
    function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar usuário.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Usuário não encontrado.');
        }
        res.status(200).send('Usuário atualizado!');
    });
});

app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM usuarios WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).send('Erro ao remover usuário.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Usuário não encontrado.');
        }
        res.status(200).send('Usuário removido!');
    });
});

app.listen(8082, () => console.log('Cadastro de usuarios na porta 8082'));
