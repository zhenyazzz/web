const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;


const words = ['яблоко', 'Банан', 'груша', 'Апельсин', 'вишня', 'Клубника', 'малина', 'Ананас'];


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/api/words', (req, res) => {
  res.json({ words });
});
  
app.get('/api/process-words', (req, res) => { 

  const processedWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).sort((a, b) => a.localeCompare(b));
  
  res.json({ processedWords });
});


app.get('/results', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'results.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 