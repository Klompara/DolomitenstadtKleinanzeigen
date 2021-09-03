const express = require('express');
const app = express();
const port = process.env.PORT || 6969;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/', (req, res) => {
    console.log(req.body);
    res.send(req.body);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})