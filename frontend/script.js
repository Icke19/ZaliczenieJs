'use strict';

//users
let users = [];
let gameId;

// Selecting elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const wonGamesP1 = document.getElementById('wonGames--0');
const wonGamesP2 = document.getElementById('wonGames--1');

getUsers();

let scores;
let currentScore;
let activePlayer;
let playing;

const init = function () {
  startGame();
  diceEl.classList.add('hidden');

  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
};

const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  currentScore = 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
};

// Rolling dice functionality
btnRoll.addEventListener('click', function () {
  if (playing) {
    //1. Generating a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;
    //2. Display dice
    diceEl.classList.remove('hidden');

    diceEl.src = `dice-${dice}.png`;
    //3. Check for rolled 1: if true, switch to next player
    if (dice !== 1) {
      // Add dice to current score
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      // Switch to next player
      switchPlayer();
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    //1. Add current score to active player's score
    scores[activePlayer] += currentScore;

    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
    //2. Check if player's score is >=100
    if (scores[activePlayer] >= 100) {
      //Finish the game
      finishGame(activePlayer + 1, scores[activePlayer]);
      updateScore(activePlayer + 1);
      playing = false;
      diceEl.classList.add('hidden');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
    } else {
      switchPlayer();
    }

    //Switch to the next player
    //switchPlayer();
  }
});

btnNew.addEventListener('click', function () {
  init();
});

function startGame() {
  const url = 'http://localhost:3000/games';

  fetch(url, {
    method: 'POST',
  })
    .then(data => {
      return data.json();
    })
    .then(game => {
      console.log(game);
      gameId = game.id;
    })
    .catch(error => {
      console.log(error);
    });
}

function getUsers() {
  const url = 'http://localhost:3000/users';

  fetch(url, {
    method: 'GET',
  })
    .then(data => {
      return data.json();
    })
    .then(downloadedUsers => {
      console.log(downloadedUsers);
      users = downloadedUsers;
      wonGamesP1.innerText = `Won games: ${users[0].AmountOfWonGames}`;
      wonGamesP2.innerText = `Won games: ${users[1].AmountOfWonGames}`;
    })
    .catch(error => {
      console.log(error);
    });
}

function finishGame(winner, points) {
  const url = 'http://localhost:3000/games';
  fetch(url, {
    method: 'PUT',
    body: JSON.stringify({ id: gameId, winner, points }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(data => {
      return data.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log(error);
    });
}

function updateScore(winner) {
  const url = `http://localhost:3000/users/${winner}`;
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(data => {
      return data.json();
    })
    .then(downloadedUser => {
      console.log(downloadedUser);
      users.map(user => {
        const wonGamesP = document.getElementById(
          `wonGames--${downloadedUser.id - 1}`
        );
        wonGamesP.innerText = downloadedUser.AmountOfWonGames;
        return user.id == downloadedUser.id ? downloadedUser : user;
      });
    })
    .catch(error => {
      console.log(error);
    });
}
