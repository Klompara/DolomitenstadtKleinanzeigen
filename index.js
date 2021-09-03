const express = require('express');
const app = express();
const port = process.env.PORT || 6969;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/', (req, res) => {
    console.log(JSON.stringify(req));
    res.send('Webhook endpoint');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})