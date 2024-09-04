const gameField = document.querySelector(".game-field");
const flowerField = document.querySelector(".flower-field");
const modalWindow = document.querySelector(".modal-window");
const cards = document.getElementsByClassName("card");
const closeModal = document.querySelector(".close-modal")

const plants = [
  {
    name: "Black swallow-wort",
    parts: {
      "Black swallow-wort in bloom": "./i/plants/bsw-in-bloom.jpg",
      "Black swallow-wort blossoms": "./i/plants/bsw-blossoms.jpg",
      "Black swallow wort sprouts": "./i/plants/bsw-sprouts.jpg",
      "Black swallow-wort pods": "./i/plants/bsw-pods.jpg",
    },
    link: 'https://www.arlingtonarmi.org/invasives/black-swallow-wort'
  },
  {
    name: "Multiflora rose fringe",
    parts: {
      "Multiflora rose fringe": "./i/plants/mfr-fringe.jpg",
      "Multiflora rose blossoms": "./i/plants/mfr-blossoms.jpg",
      "Multiflora rose leaves": "./i/plants/mfr-leaves.jpg",
      "Multiflora rose berries": "./i/plants/mfr-berries.jpg",
    },
    link: 'https://www.arlingtonarmi.org/invasives/multiflora-rose'
  },
];

const goodPlants = [
  '<img src="./i/good-plants/0.png" alt="" class="blossom p0">',
  '<img src="./i/good-plants/1.png" alt="" class="blossom p1">',
  '<img src="./i/good-plants/2.png" alt="" class="blossom p2 t2">',
  '<img src="./i/good-plants/3.png" class="blossom p3">',
  '<img src="./i/good-plants/4.png" class="blossom p4">',
  '<img src="./i/good-plants/6.png" class="blossom p6">',
  '<img src="./i/good-plants/7.png" class="blossom p7">',
  '<img src="./i/good-plants/8.png" class="blossom p8">',
];

const snd = document.querySelector("#button-audio");
snd.volume = 0.5;
const guessedSnd = document.querySelector("#dissapear-audio");
guessedSnd.volume = 0.2;

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

let correctAnswers = 0;
let flippedCards = [];
let isGameOn = false;

document.addEventListener("click", (e) => {
  
  if (e.target === document.querySelector(".restart-btn")) {
      modalWindow.classList.remove('hide')
      modalWindow.style.display = "initial"
  } else if(
    e.target === closeModal && isGameOn ||
    (e.target === document.querySelector(".dark-bg") && isGameOn)) {
    modalWindow.classList.add("hide");
    modalWindow.style.display = "none"
  }
  if (e.target === document.querySelector("#startBtn") ||
      e.target === closeModal && !isGameOn) {
        startGame()
  }
});

function gameReset() {
  gameField.innerHTML = "";
  flowerField.innerHTML = "";
  correctAnswers = 0;
  flippedCards = [];
}

function startGame() {
  gameReset();

  modalWindow.classList.add("hide");
  
  isGameOn = true;

  setTimeout(() => {
    modalWindow.style.display = "none";
    plants.forEach((plant, i) => {
      for (let j = 0; j < Object.keys(plant.parts).length; j++) {
        let card = `<div class="card" style="order: ${generateCardPlace()}" data-card-id="${i}${j}" data-plant-id="${i}">
                    <div class="card-content">
                        <div class="front-side" style="background-image: url('${
                          plant.parts[Object.keys(plant.parts)[j]]
                        }')"></div>
                        <div class="back-side">
                            <h2 class="plant-name">${
                              Object.keys(plant.parts)[j]
                            }</h2>
                            
                            <a class="plant-link" href="${
                              plant.link
                            }" target="_blank" >Learn more</a>
                        </div>
                    </div>
                </div>`;

        gameField.innerHTML += card;
      }
    });
  }, 500);
}

function generateCardPlace() {
  const order = Math.floor(
    Math.random() * plants.length * Object.keys(plants[0].parts).length
  );

  if ([...cards].find((e) => e.style.order == order)) {
    return generateCardPlace();
  } else {
    return order;
  }
}


document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("front-side") || flippedCards.length === 2) return;
  
  const card = e.target.parentElement.parentElement;
  console.log(card);
  

  playSound(snd);
  card.classList.add("flipped");
  flippedCards.push(card);
  if (flippedCards.length === 2) setTimeout(() => checkCards(), 1500);
});

function checkCards() {
  if (flippedCards[0].dataset.plantId === flippedCards[1].dataset.plantId) {
    playSound(guessedSnd);
    flippedCards.forEach((card) => {
      card.classList.add("guessed");
      setTimeout(() => card.style.zIndex = '-99', 1000)
      plantFlower(card.dataset.cardId);
      showFlower(card.dataset.cardId);
    });
    correctAnswers++;

    if (correctAnswers === plants.length * 2) {
      setTimeout(() => {
        modalWindow.classList.remove("hide");
        modalWindow.style.display = "initial";
      }, 8000);
    }
  } else {
    playSound(snd);
    flippedCards.forEach((card) => card.classList.remove("flipped"));
  }
  flippedCards = [];
}

function plantFlower(cardId) {
  const flower = goodPlants[Math.floor(Math.random() * goodPlants.length)];
  const left = Math.floor(Math.random() * document.documentElement.clientWidth);
  const bottom = Math.floor(Math.random() * -250);
  const direction = Math.round(Math.random()) === 0 ? "left" : "right";
  flowerField.innerHTML += `
    <div class="flower ${direction} show" data-flower-id="${cardId}" style="left: ${left}px; bottom:${bottom}px; z-index: ${-(250 + bottom)}; display: none;">
        ${flower}
        <div class="stem"></div>
    </div>
  `;
}

async function showFlower(cardId) {
  await wait();
  document.querySelector(`.flower[data-flower-id='${cardId}']`).style.display =
    "initial";
  await wait(1050);
  document
    .querySelector(`.flower[data-flower-id='${cardId}']`)
    .classList.remove("show");
}

function wait(time = 0) {
  if (!time) {
    time = Math.random() * 1000;
  }
  return new Promise((res) => setTimeout(res, time));
}
