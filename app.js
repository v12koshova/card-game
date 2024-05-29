const field = document.getElementById("field");
const cards = document.getElementsByClassName("card");
const button = document.getElementById('click')
const newGameBtn = document.querySelector('.new-game-btn')
const modal = document.querySelector('.dark-background')
const restart = document.querySelector('.restart-btn')

document.addEventListener('click', (e) => {
  if (isStarted && (e.target === restart || e.target === modal)) {
    newGameBtn.classList.toggle('hide')
    modal.classList.toggle('hide')
  }
})

const snd = document.querySelector('#button-audio')
snd.volume = 0.5
const guessedSnd = document.querySelector('#dissapear-audio')
guessedSnd.volume = 0.2

function playSound(sound) {
  sound.currentTime = 0
  sound.play()
}

const colorArray = ['#dba1ff', '#a1e9ff', '#60cdf6', '#bfbbde', '#f8c2db', 
'#942b71', '#f2729b', '#f05977', '#f48478', '#c7a2cc',
'#b8ddf7', '#c1e6e5', '#cae5be', '#d1d0e7', '#736ba0', 
'#f95959', '#38598b', '#ff9a3c', '#ffc93c', '#5585b5',
'#53a8b6', '#79c2d0', '#bbe4e9', '#fdffcd', '#ffebbb', 
'#ffcab0', '#ffb5b5', '#ffcbcb', '#c3195d', '#f70776',
'#680747', '#f76b8a', '#bae8e8', '#7c73e6', '#9896f1', 
'#d59bf6', '#edb1f1', '#ff7e67', '#8594e4', '#6643b5',
'#d5def5', '#f5c7f7', '#e46161', '#cadefc', '#c3bef0', 
'#cca8e9', '#defcf9', '#fbf2d5', '#fdc57b', '#ff847c'];

plants = [
  { name: "Black swallow-wort", 
    plant: {
    "Black swallow-wort in bloom": "./plants/bsw-in-bloom.jpg", 
    "Black swallow-wort blossoms": "./plants/bsw-blossoms.jpg", 
    "Black swallow wort sprouts": "./plants/bsw-sprouts.jpg", 
    "Black swallow-wort pods": "./plants/bsw-pods.jpg"
    }
  },
  { name: "Multiflora rose fringe", 
    plant: {
    "Multiflora rose fringe": "./plants/mfr-fringe.jpg", 
    "Multiflora rose blossoms": "./plants/mfr-blossoms.jpg", 
    "Multiflora rose leaves": "./plants/mfr-leaves.jpg", 
    "Multiflora rose berries": "./plants/mfr-berries.jpg"
    }
  }
];

let isStarted = false
let correctAnswers

newGameBtn.addEventListener('click', startGame)

async function startGame() {
  isStarted = true
  correctAnswers = 0
  newGameBtn.classList.add('hide')
  modal.classList.add('hide')
  field.innerHTML = ''
  flippedCards = [];
  await wait(500)
  plants.forEach((element, id) => {
    for (let i = 0; i < Object.keys(element.plant).length; i++) {
      let card = document.createElement("div");
      card.dataset.cardName = id;
      card.dataset.cardId = `${id}${i}`;
      card.dataset.plantName = Object.keys(element.plant)[i];
      card.className = "card";
      card.style.backgroundImage = `url(${Object.values(element.plant)[i]})`;
      generatePlace(card, element);
      field.append(card);
    }
  });
}


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("card")) {
    if (flippedCards.length == 2) return
    playSound(snd)
    e.target.classList.add("flipped");
    flippedCards.push(e.target.dataset.cardId);
    if (flippedCards.length == 2) {
      if (flippedCards[0][0] == flippedCards[1][0]) {
        const guessedCards = [...cards].filter(card => card.dataset.cardId == flippedCards[0] || card.dataset.cardId == flippedCards[1] );
        correctAnswers++
        setTimeout(() => {
          guessedCards.forEach(card => {
            card.classList.add('guessed');
            playSound(guessedSnd);
            placeForFlower(card)
            showFlower(card)
        });
        }, 1000)
      
        if (cards.length/2 === correctAnswers) {
          setTimeout(() => {
            newGameBtn.classList.remove('hide')
            modal.classList.remove('hide')
          }, 8000)
        }
        flippedCards = []
      } else {
        setTimeout(() => {
            flippedCards.forEach(id => {
                const wrongCard = [...cards].filter(card => card.dataset.cardId == id && card.classList.contains("flipped"));
                wrongCard[0].classList.remove('flipped');
                playSound(snd)
            })
            flippedCards = []
        }, 1500);
        
      }
    }
  }
});

function generatePlace(card, element) {
    let order =  Math.floor(Math.random() * (plants.length * Object.keys(element.plant).length));
    let sameOrderInDeck = [...cards].find(card => card.style.order == order)
    if (sameOrderInDeck) {
        generatePlace(card, element)
    } else {
        card.style.order = order
    }
}

async function placeForFlower(card) {
  let heightBase = card.getBoundingClientRect().height - 100
  let minHeight = heightBase
  let maxHeight = minHeight / 3 + minHeight
  for (let i = 0; i < 3; i++) {
    let currentPlaceY = Math.random() * (maxHeight - minHeight) + minHeight;
    let placeX = Math.random() * card.getBoundingClientRect().width;
    let color = Math.floor(Math.random() * colorArray.length);
    card.innerHTML += `<div style="top:${currentPlaceY}px; left:${placeX}px;" class="flower flower-${card.dataset.cardId}${i}">
		<div class="stem"></div>
		<div class="leave-1"></div>
		<div class="leave-2"></div>
		<div class="petals">
			<div class="core"></div>
			<div style="background: linear-gradient(135deg, ${colorArray[color]} 0%,#b032ff 100%);" class="petal petal-1"></div>
			<div style="background: linear-gradient(135deg, ${colorArray[color]} 0%,#b032ff 100%);" class="petal petal-2"></div>
			<div style="background: linear-gradient(135deg, ${colorArray[color]} 0%,#b032ff 100%);" class="petal petal-3"></div>
			<div style="background: linear-gradient(135deg, ${colorArray[color]} 0%,#b032ff 100%);" class="petal petal-4"></div>
			<div style="background: linear-gradient(135deg, ${colorArray[color]} 0%,#b032ff 100%);" class="petal petal-5"></div>
      <div class="middle"></div>
		</div>
	</div>`;
    document.querySelector(`.flower.flower-${card.dataset.cardId}${i}`).style.display = "none";
    minHeight = maxHeight
    maxHeight = maxHeight + (heightBase / 3)
  }
}

async function showFlower(card) {
  for (let i=0; i < 3; i++) {
    await wait()
    document.querySelector(`.flower.flower-${card.dataset.cardId}${i}`).style.display = 'block'
  }
}

function wait(time = 0) {
  if (!time) {
    time = Math.random() * 1000
  }
  return new Promise(res => setTimeout(res, time))
}
