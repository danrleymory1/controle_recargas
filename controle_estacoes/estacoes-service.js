const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/estacoes/liberar', (req, res) => {
    const { usuario_id, posto_id } = req.body;
    console.log(`Estação liberada para o usuário ${usuario_id} no posto ${posto_id}`);
    res.status(200).send('Estação liberada!');
});

app.get('/estacoes/status/:id', (req, res) => {
    const { id } = req.params;
    res.status(200).json({ id, status: 'disponível' });
});
app.patch('/estacoes/iniciar/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Recarga iniciada em ${id}`);
    res.status(200).send(`Recarga iniciada em ${id}`);
});

app.delete('/estacoes/finalizar/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Recarga finalizada em ${id}`);
    res.status(200).send(`Recarga finalizada em ${id}`);
});

app.listen(8084, () => console.log('Controle de Estações rodando na porta 8084'));
