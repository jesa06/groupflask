const quoteContainer = document.getElementById('quote-container');
const text = document.getElementById('quote');
const authorText = document.getElementById('author');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

// Show Loading
function loading() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

// Hide Loading
function complete() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

// Get Quote From API
async function getQuote() {
    loading();
    const proxyUrl = 'https://whispering-tor-04671.herokuapp.com/'
    const apiUrl = 'https://peacock.ml/api/covid/';
    try {
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        // If Author is blank, add 'Unknown'
        if (data.author === '') {
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = data.author;
        }
        // Reduce font size for long quotes
        if (data.text.length > 120) {
            text.classList.add('long-quote');
        } else {
            text.classList.remove('long-quote');
        }
        text.innerText = data.text;
        // Stop Loader, Show Quote
        complete();
    } catch (error) {
        getQuote();
    }
}

// Tweet Quote
function tweetQuote() {
    const quote = text.innerText;
    const author = authorText.innerText;
}



// On Load
getQuote();