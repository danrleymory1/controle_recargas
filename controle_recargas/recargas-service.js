const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

const db = new sqlite3.Database('./recargas.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    }
});

db.run(`CREATE TABLE IF NOT EXISTS recargas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    posto_id INTEGER,
    valor REAL,
    status TEXT
)`);

app.post('/recargas', async (req, res) => {
    const { usuario_id, posto_id, valor } = req.body;

    try {
        await axios.post('http://localhost:8084/estacoes/liberar', { usuario_id, posto_id });
        
        await axios.post('http://localhost:8085/cobrancas', { usuario_id, valor });
        
        db.run(`INSERT INTO recargas (usuario_id, posto_id, valor, status) VALUES (?, ?, ?, ?)`, 
        [usuario_id, posto_id, valor, 'finalizado'], 
        function (err) {
            if (err) {
                return res.status(500).send('Erro ao registrar recarga.');
            }
            res.status(201).send({ id: this.lastID });
        });
    } catch (error) {
        res.status(500).send('Erro ao processar recarga.');
    }
});

app.get('/recargas', (req, res) => {
    db.all(`SELECT * FROM recargas`, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Erro ao obter recargas.');
        }
        res.status(200).json(rows);
    });
});

app.get('/recargas/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM recargas WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).send('Erro ao obter recarga.');
        }
        if (!row) {
            return res.status(404).send('Recarga não encontrada.');
        }
        res.status(200).json(row);
    });
});

app.patch('/recargas/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.run(`UPDATE recargas SET status = COALESCE(?, status) WHERE id = ?`, 
    [status, id], 
    function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar recarga.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Recarga não encontrada.');
        }
        res.status(200).send('Recarga atualizada com sucesso!');
    });
});

app.delete('/recargas/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM recargas WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).send('Erro ao remover recarga.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Recarga não encontrada.');
        }
        res.status(200).send('Recarga removida com sucesso!');
    });
});

app.listen(8083, () => console.log('Controle de Recargas rodando na porta 8083'));
