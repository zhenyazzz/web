document.getElementById('wordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const wordsRaw = document.getElementById('words').value;
    const words = wordsRaw.split(/[\s,]+/).filter(Boolean);

    fetch('/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words })
    })
    .then(res => res.json())
    .then(() => loadOriginal());
});

function loadOriginal() {
    fetch('/original')
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('originalList');
            list.innerHTML = '';
            data.words.forEach(word => {
                if (word.trim()) {
                    const li = document.createElement('li');
                    li.textContent = word;
                    list.appendChild(li);
                }
            });
        });
}

document.getElementById('showProcessed').onclick = function() {
    window.location.href = 'result.html';
};

window.onload = loadOriginal;
