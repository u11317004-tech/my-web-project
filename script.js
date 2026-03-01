const RANDOM_QUOTES = [
    "The only way to do great work is to love what you do.",
    "Stay hungry, stay foolish.",
    "Practice makes perfect, keep typing every day.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Intelligence is the ability to adapt to change.",
    "Believe you can and you are halfway there.",
    "The quick brown fox jumps over the lazy dog."
];

const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accElement = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');

let timerInterval;
let timeElapsed = 0;
let isPlaying = false;

// 初始化與切換句子
function renderNextQuote() {
    const quote = RANDOM_QUOTES[Math.floor(Math.random() * RANDOM_QUOTES.length)];
    quoteDisplayElement.innerHTML = '';
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    quoteInputElement.value = null;
}

// 核心邏輯：輸入比對
quoteInputElement.addEventListener('input', () => {
    if (!isPlaying) {
        startTimer();
        isPlaying = true;
    }

    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    let correctChars = 0;

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
            correctChars++;
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
        }
    });

    // 計算準確度
    if(arrayValue.length > 0) {
        let acc = Math.floor((correctChars / arrayValue.length) * 100);
        accElement.innerText = acc;
    }

    // 完成判斷
    if (arrayValue.length === arrayQuote.length) {
        renderNextQuote();
    }
});

function startTimer() {
    timeElapsed = 0;
    timerElement.innerText = 60;
    timerInterval = setInterval(() => {
        timeElapsed++;
        let timeLeft = 60 - timeElapsed;
        timerElement.innerText = timeLeft;
        
        // 計算 WPM (每5個字當作一個單字)
        let wordsTyped = quoteInputElement.value.length / 5;
        let currentWpm = Math.round(wordsTyped / (timeElapsed / 60));
        wpmElement.innerText = isFinite(currentWpm) ? currentWpm : 0;

        if (timeLeft <= 0) stopGame();
    }, 1000);
}

function stopGame() {
    clearInterval(timerInterval);
    quoteInputElement.disabled = true;
    alert(`遊戲結束！您的 WPM 為: ${wpmElement.innerText}`);
}

restartBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isPlaying = false;
    timeElapsed = 0;
    timerElement.innerText = 60;
    wpmElement.innerText = 0;
    accElement.innerText = 100;
    quoteInputElement.disabled = false;
    renderNextQuote();
});

// 啟動
renderNextQuote();