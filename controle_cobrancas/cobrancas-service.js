const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const app = express();

app.use(bodyParser.json());

const db = new sqlite3.Database('./cobrancas.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    }
});

db.run(`CREATE TABLE IF NOT EXISTS cobrancas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    valor REAL
)`);
app.post('/cobrancas', (req, res) => {
    const { usuario_id, valor } = req.body;

    db.run(`INSERT INTO cobrancas (usuario_id, valor) VALUES (?, ?)`, 
    [usuario_id, valor], 
    function (err) {
        if (err) {
            return res.status(500).send('Erro ao registrar cobrança.');
        }
        console.log(`Cobrança de R$${valor} registrada para o usuário ${usuario_id}`);
        res.status(201).send({ id: this.lastID });
    });
});


app.get('/cobrancas', (req, res) => {
    db.all(`SELECT * FROM cobrancas`, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Erro ao obter cobranças.');
        }
        res.status(200).json(rows);
    });
});

// READ - Obter uma cobrança por ID
app.get('/cobrancas/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM cobrancas WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).send('Erro ao obter cobrança.');
        }
        if (!row) {
            return res.status(404).send('Cobrança não encontrada.');
        }
        res.status(200).json(row);
    });
});

// UPDATE - Atualizar o valor de uma cobrança (para fins de teste)
app.patch('/cobrancas/:id', (req, res) => {
    const { id } = req.params;
    const { valor } = req.body;
    db.run(`UPDATE cobrancas SET valor = COALESCE(?, valor) WHERE id = ?`, 
    [valor, id], 
    function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar cobrança.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Cobrança não encontrada.');
        }
        res.status(200).send('Cobrança atualizada!');
    });
});

// DELETE - Remover uma cobrança
app.delete('/cobrancas/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM cobrancas WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).send('Erro ao remover cobrança.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Cobrança não encontrada.');
        }
        res.status(200).send('Cobrança removida!');
    });
});

app.listen(8085, () => console.log('Controle de cobraças na porta 8085'));
