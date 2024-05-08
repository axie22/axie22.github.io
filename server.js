const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/submit-form', (req, res) => {
    const { name, occupation } = req.body; 
    const data = `Name: ${name}, Occupation: ${occupation}\n`;

    fs.appendFile('contactInfo.txt', data, (err) => {
        if (err) {
            console.error('Failed to write to file', err);
            res.status(500).send('Unable to save contact info');
        } else {
            res.send('Contact info saved successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
