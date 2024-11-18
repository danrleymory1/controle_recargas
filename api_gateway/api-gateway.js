const httpProxy = require('express-http-proxy');
const express = require('express');
const app = express();
const logger = require('morgan');

app.use(logger('dev'));

function selectProxyHost(req) {
    if (req.path.startsWith('/postos')) return 'http://localhost:8081';
    if (req.path.startsWith('/usuarios')) return 'http://localhost:8082';
    if (req.path.startsWith('/recargas')) return 'http://localhost:8083';
    if (req.path.startsWith('/estacoes')) return 'http://localhost:8084';
    if (req.path.startsWith('/cobrancas')) return 'http://localhost:8085';
    return null;
}
app.use((req, res, next) => {
    const proxyHost = selectProxyHost(req);
    if (!proxyHost) {
        res.status(404).send('não encontrado');
    } else {
        httpProxy(proxyHost)(req, res, next);
    }
});
app.listen(8000, () => {
    console.log('API Gateway na porta 8000!');
});
