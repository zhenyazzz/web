async function fetchAndDisplayOriginalWords() {
    try {
        const response = await fetch('/api/words');
        const data = await response.json();
        
        const wordsList = document.getElementById('original-words');
        wordsList.innerHTML = '';
        
        data.words.forEach(word => {
            const listItem = document.createElement('li');
            listItem.textContent = word;
            wordsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching original words:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayOriginalWords();
    
    const processButton = document.getElementById('process-button');
    processButton.addEventListener('click', () => {
        window.location.href = '/results';
    });
}); 