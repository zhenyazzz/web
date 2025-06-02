const express = require('express')
const fs = require('fs')
const cors = require('cors')
const path = require('path')
const app = express()
const PORT = 3000
app.use(cors())
app.use(express.json())
app.use(express.static('public'))


app.post('/process', (req, res) => {
    const {words} = req.body;
    fs.writeFileSync('original.txt', words.join('\n'), 'utf8')

    const processed = words.map(word => 'а' + word.slice(1)).sort((a,b) => a.length - b.length)
    fs.writeFileSync('processed.txt',processed.join('\n'), 'utf8')
    res.json({success : true})
})

app.get('/original', (req, res) => {
    const data = fs.readFileSync('original.txt', 'utf8').split('\n');
    res.json({ words: data });
});

app.get('/processed', (req, res) => {
    const data = fs.readFileSync('processed.txt', 'utf8').split('\n');
    res.json({ words: data });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});