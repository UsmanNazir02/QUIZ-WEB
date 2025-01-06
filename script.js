const quizData = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2,
        category: "Geography",
        hint: "This city is known as the 'City of Light'"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1,
        category: "Science",
        hint: "Its color comes from iron oxide on its surface"
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correct: 1,
        category: "Biology",
        hint: "This marine mammal can grow up to 100 feet long"
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correct: 2,
        category: "Art",
        hint: "This Italian Renaissance polymath also designed flying machines"
    },
    {
        question: "What is the chemical symbol for Gold?",
        options: ["Au", "Ag", "Fe", "Cu"],
        correct: 0,
        category: "Chemistry",
        hint: "Comes from the Latin word 'aurum'"
    }
];

let currentQuestion = 0;
let score = 0;
let answeredQuestions = new Array(quizData.length).fill(false);
let hintsUsed = 0;
let timeLeft = 30;
let timer = null;
let startTime = null;
let totalTimeSpent = 0;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizContent = document.getElementById('quiz-content');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const scoreSpan = document.getElementById('score');
const resultsDiv = document.getElementById('results');
const finalScoreSpan = document.getElementById('final-score');
const maxScoreSpan = document.getElementById('max-score');
const restartButton = document.getElementById('restart-btn');
const progressBar = document.querySelector('.progress');
const timerDisplay = document.getElementById('timer');
const categoryDisplay = document.getElementById('category');
const hintBtn = document.getElementById('hint-btn');
const hintText = document.getElementById('hint-text');
const hintsUsedSpan = document.getElementById('hints-used');
const timeSpentSpan = document.getElementById('time-spent');
const startBtn = document.getElementById('start-btn');

function startQuiz() {
    welcomeScreen.style.display = 'none';
    quizContent.style.display = 'block';
    startTime = Date.now();
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timer);
    timeLeft = 30;
    startTimer();

    const question = quizData[currentQuestion];
    questionText.textContent = question.question;
    categoryDisplay.textContent = question.category;
    optionsContainer.innerHTML = '';
    hintText.style.display = 'none';
    hintBtn.style.display = 'block';

    question.options.forEach((option, index) => {
        const button = document.createElement('div');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => selectOption(index);
        optionsContainer.appendChild(button);
    });

    updateControls();
    updateProgress();
}

function startTimer() {
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            if (!answeredQuestions[currentQuestion]) {
                handleTimeUp();
            }
        }
    }, 1000);
}

function handleTimeUp() {
    const options = document.querySelectorAll('.option');
    const correct = quizData[currentQuestion].correct;
    options[correct].classList.add('correct');
    answeredQuestions[currentQuestion] = true;
    nextButton.disabled = false;
}

function showHint() {
    hintText.textContent = quizData[currentQuestion].hint;
    hintText.style.display = 'block';
    hintBtn.style.display = 'none';
    hintsUsed++;
}

function selectOption(index) {
    if (answeredQuestions[currentQuestion]) return;

    clearInterval(timer);
    const options = document.querySelectorAll('.option');
    const correct = quizData[currentQuestion].correct;

    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');

    if (index === correct) {
        options[index].classList.add('correct');
        if (!answeredQuestions[currentQuestion]) {
            score++;
            scoreSpan.textContent = score;
        }
    } else {
        options[index].classList.add('wrong');
        options[correct].classList.add('correct');
    }

    answeredQuestions[currentQuestion] = true;
    nextButton.disabled = false;
}

function updateControls() {
    currentQuestionSpan.textContent = currentQuestion + 1;
    totalQuestionsSpan.textContent = quizData.length;
    prevButton.disabled = currentQuestion === 0;
    nextButton.disabled = !answeredQuestions[currentQuestion];

    if (currentQuestion === quizData.length - 1 && answeredQuestions[currentQuestion]) {
        nextButton.textContent = 'Finish';
    } else {
        nextButton.textContent = 'Next';
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function showResults() {
    clearInterval(timer);
    totalTimeSpent = Math.floor((Date.now() - startTime) / 1000);

    document.getElementById('question-container').style.display = 'none';
    document.querySelector('.controls').style.display = 'none';
    document.querySelector('.quiz-header').style.display = 'none';
    resultsDiv.style.display = 'block';

    finalScoreSpan.textContent = score;
    maxScoreSpan.textContent = quizData.length;
    hintsUsedSpan.textContent = hintsUsed;
    timeSpentSpan.textContent = totalTimeSpent;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    hintsUsed = 0;
    timeLeft = 30;
    answeredQuestions = new Array(quizData.length).fill(false);
    startTime = Date.now();

    scoreSpan.textContent = score;
    document.getElementById('question-container').style.display = 'block';
    document.querySelector('.controls').style.display = 'flex';
    document.querySelector('.quiz-header').style.display = 'block';
    resultsDiv.style.display = 'none';

    loadQuestion();
}

nextButton.addEventListener('click', () => {
    if (currentQuestion === quizData.length - 1) {
        showResults();
    } else {
        currentQuestion++;
        loadQuestion();
    }
});

prevButton.addEventListener('click', () => {
    currentQuestion--;
    loadQuestion();
});

restartButton.addEventListener('click', restartQuiz);
hintBtn.addEventListener('click', showHint);
startBtn.addEventListener('click', startQuiz);

// Initialize quiz
totalQuestionsSpan.textContent = quizData.length;
