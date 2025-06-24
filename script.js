
//Initialisation des variables du DOM
const startButton = document.getElementById("start");
const classementButton = document.getElementById("classement");
const backButton = document.getElementById("back");
const quizScreen = document.getElementById("quiz-screen");
const homeScreen = document.getElementById("home-screen");
const classementScreen = document.getElementById("classement-screen");
const questionText = document.getElementById("question-text");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-button");
const resultScreen = document.getElementById("result-screen");
const scoreText = document.getElementById("score-text");
const restartButton = document.getElementById("restart");
const joueur = document.getElementById("player-name");
const questionNumber = document.getElementById("question-number");

//Initialisation des variables du jeu
let currentQuestionIndex = 0;
let score = 0;

//Initialisation des questions
const questions = [{
    question: "Quelle est la capitale de la France ?",
    answers: ["Paris", "Londres", "Madrid", "Berlin"],
    correct: 0
}, {
    question: "Quel est le plus grand océan du monde ?",
    answers: ["Océan Atlantique", "Océan Indien", "Océan Pacifique", "Océan Arctique"],
    correct: 2
}, {
    question: "Quelle est la monnaie de l'Allemagne ?",
    answers: ["Le Franc", "Le Dollar", "Le Livre", "L'Euro"],
    correct: 3
}, {
    question: "Quel est le plus grand pays du monde ?",
    answers: ["La Chine", "Le Canada", "La Russie", "Les Etats-Unis"],
    correct: 2
}, {
    question: "Quelle est la langue la plus parlée dans le monde ?",
    answers: ["L'anglais", "Le chinois", "L'espagnol", "Le français"],
    correct: 2
}]

function saveRankingToLocalStorage(ranking) {
    localStorage.setItem("ranking", JSON.stringify(ranking));
}

// Récupération du classement depuis le local storage
function getRankingFromLocalStorage() {
    const ranking = localStorage.getItem("ranking");
    if (ranking === null) {
        return [];
    }
    return JSON.parse(ranking);
}

// Création et mise à jour du classement
function createRanking(playerName, score) {
    let ranking = getRankingFromLocalStorage();
    
    // Vérifier si le joueur existe déjà dans le classement
    const existingPlayer = ranking.find(player => player.name === playerName);
    if (existingPlayer) {
        existingPlayer.score = Math.max(existingPlayer.score, score);
    } else {
        ranking.push({ name: playerName, score });
    }

    // Trier par score décroissant
    ranking.sort((a, b) => b.score - a.score);

    saveRankingToLocalStorage(ranking);
}

// Affichage du classement
function displayRanking(ranking) {
    classementScreen.classList.remove("inactive");
    homeScreen.classList.add("inactive");
    const rankingTable = document.getElementById("classement-table");
    
    rankingTable.innerHTML = `
        <tr>
            <th>Position</th>
            <th>Nom</th>
            <th>Score</th>
        </tr>
    `;

    ranking.forEach((player, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.score}</td>
        `;
        rankingTable.appendChild(row);
    });
}

//Passage à l'écran de classement
classementButton.addEventListener("click", () => {
    homeScreen.classList.add("inactive");
    classementScreen.classList.remove("inactive");
    displayRanking(getRankingFromLocalStorage());
});

// Retour à l'accueil
backButton.addEventListener("click", () => {
    classementScreen.classList.add("inactive");
    homeScreen.classList.remove("inactive");
});

//Début du jeu
startButton.addEventListener("click", () => {
    homeScreen.classList.add("inactive");
    quizScreen.classList.remove("inactive");
    startQuiz();
});

//Gestion des questions restantes
nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
});

//Gestion du bouton pour recommencer
restartButton.addEventListener("click", () => {
    resultScreen.classList.add("inactive");
    homeScreen.classList.remove("inactive");
    currentQuestionIndex = 0;
    score = 0;
});

// Initialisation du jeu
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    const playerName = enterName();
    joueur.textContent = playerName;
    showQuestion();
}

// Demande du nom du joueur
function enterName() {
    let playerName = window.prompt("Veuillez saisir votre nom");
    if (playerName === null || playerName === "") {
        playerName = "Joueur";
    }
    return playerName;
}

//Afficahge de la question
function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    questionNumber.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;
    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.id = index;
        button.classList.add("answer");
        button.textContent = answer;
        button.addEventListener("click", () => selectAnswer(index));
        answerButtons.appendChild(button);
    });
}

//Réinitialisation de l'état de la réponse
function resetState() {
    answerButtons.innerHTML = "";
}

//Sélection de la réponse
function selectAnswer(index) {
    if (index === questions[currentQuestionIndex].correct) {
        score++;
        document.getElementById(index).classList.add("correct");

    }else{
        document.getElementById(index).classList.add("incorrect");
    }
    disableButtons();
}

// Désactivation des boutons
function disableButtons() {
    const actionButtons = document.querySelectorAll(".answer");
    actionButtons.forEach(button => {
        button.disabled = true;
        button.classList.add("disabled");
    });
}

//Affichage des résultats
function showResults() {
    quizScreen.classList.add("inactive");
    resultScreen.classList.remove("inactive");
    let result = score / questions.length * 100;
    scoreText.textContent = `Votre score est de ${score} / ${questions.length} soit ${result}%`;
    createRanking(joueur.textContent, score);
}