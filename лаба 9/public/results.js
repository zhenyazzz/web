async function fetchAndDisplayProcessedWords() {
    try {
        const response = await fetch('/api/process-words');
        const data = await response.json();
        
        const wordsList = document.getElementById('processed-words');
        wordsList.innerHTML = '';
        
        data.processedWords.forEach(word => {
            const listItem = document.createElement('li');
            listItem.textContent = word;
            wordsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching processed words:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    fetchAndDisplayProcessedWords();
    
    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        window.location.href = '/';
    });
}); 