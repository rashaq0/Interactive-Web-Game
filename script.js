
let time = 25;
let countdown;
let firstCard = null;
let matchedPairs = 0;
let currentSet = 1;
let checkingCards = false;

const timer = document.querySelector("#timer");
const startButton = document.querySelector("#start-button");
const introScreen = document.querySelector("#intro-screen");
const gameScreen = document.querySelector("#game-screen");
const matchesDisplay = document.querySelector("#matches");

const set1 = document.querySelector(".set-1");
const set2 = document.querySelector(".set-2");

// START GAME
startButton.addEventListener("click", function () {
    clearInterval(countdown);

    time = 25;
    matchedPairs = 0;
    currentSet = 1;

    timer.innerText = time;
    timer.style.color = "#ff2bcd";
    matchesDisplay.innerText = "0/10";

    introScreen.style.display = "none";
    gameScreen.style.display = "block";

    set1.style.display = "grid";
    set2.style.display = "none";

    startSet(set1);
    resetSet(set2);

    // START TIMER
    countdown = setInterval(function () {
        time--;
        timer.innerText = time;

        if (time <= 5) {
            timer.style.color = "#d00000";
        }

        if (time <= 0) {
            clearInterval(countdown);
            endGame("Time's Up!");
        }
    }, 1000);
});

// SHUFFLE DEFINITIONS
function shuffleDefinitions(set) {
    const definitions = set.querySelector(".definitions");
    const cards = Array.from(
        definitions.querySelectorAll(".card")
    );

    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    cards.forEach(function (card) {
        definitions.appendChild(card);
    });
}

// RESET A SET
function resetSet(set) {
    set.querySelector(".connections").replaceChildren();

    set.querySelectorAll(".card").forEach(function (card) {
        card.classList.remove("selected", "matched");
    });
}

// PREPARE A SET
function startSet(set) {
    firstCard = null;
    checkingCards = false;

    resetSet(set);
    shuffleDefinitions(set);
}

// HANDLE CARD CLICKS
function handleCardClick(card) {
    if (checkingCards || card.classList.contains("matched")) {
        return;
    }

    if (firstCard === null) {
        firstCard = card;
        card.classList.add("selected");
        return;
    }

    if (card === firstCard) {
        return;
    }

    const secondCard = card;

    if (firstCard.dataset.match === secondCard.dataset.match) {
        firstCard.classList.remove("selected");
        secondCard.classList.remove("selected");

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        drawLine(firstCard, secondCard);

        matchedPairs++;
        matchesDisplay.innerText = matchedPairs + "/10";

        firstCard = null;

        // FINISH SET 1
        if (matchedPairs === 5 && currentSet === 1) {
            checkingCards = true;

            setTimeout(function () {
                set1.style.display = "none";
                set2.style.display = "grid";

                currentSet = 2;
                startSet(set2);
            }, 800);
        }

        // FINISH THE GAME
        else if (matchedPairs === 10) {
            clearInterval(countdown);
            endGame("You Win! 🎉 You matched all 10 pairs!");
        }
    } else {
        checkingCards = true;

        firstCard.classList.remove("selected");
        secondCard.classList.remove("selected");

        firstCard = null;

        setTimeout(function () {
            checkingCards = false;
        }, 300);
    }
}

// END GAME
function endGame(message) {
    clearInterval(countdown);

    alert(message);

    gameScreen.style.display = "none";
    introScreen.style.display = "flex";

    time = 25;
    timer.innerText = time;
    timer.style.color = "#ff2bcd";

    matchedPairs = 0;
    matchesDisplay.innerText = "0/10";
    currentSet = 1;

    set1.style.display = "grid";
    set2.style.display = "none";

    resetSet(set1);
    resetSet(set2);
}

// ADD CLICK EVENTS TO THE CARDS
[set1, set2].forEach(function (set) {
    set.querySelectorAll(".card").forEach(function (card) {
        card.addEventListener("click", function () {
            handleCardClick(card);
        });
    });
});

// DRAW MATCHING LINES
function drawLine(card1, card2) {
    const game = card1.closest(".game");
    const svg = game.querySelector(".connections");

    const gameRect = game.getBoundingClientRect();
    const rect1 = card1.getBoundingClientRect();
    const rect2 = card2.getBoundingClientRect();

    svg.setAttribute(
        "viewBox",
        `0 0 ${gameRect.width} ${gameRect.height}`
    );

    const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    line.setAttribute("x1", rect1.right - gameRect.left);
    line.setAttribute(
        "y1",
        rect1.top + rect1.height / 2 - gameRect.top
    );

    line.setAttribute("x2", rect2.left - gameRect.left - 5);
    line.setAttribute(
        "y2",
        rect2.top + rect2.height / 2 - gameRect.top
    );

    line.setAttribute("stroke", "#ff2bcd");
    line.setAttribute("stroke-width", "4");
    line.setAttribute("stroke-linecap", "round");

    svg.appendChild(line);
};

// HIDE SET 2 INITIALLY
set2.style.display = "none";

// SHUFFLE SET 1 DEFINITIONS
shuffleDefinitions(set1);
