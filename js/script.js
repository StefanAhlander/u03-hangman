import wordArray from "./models/word-array.js";

import initialView from "./views/initial.js";
import gameView from "./views/game.js";
import lossView from "./views/loss.js";
import winView from "./views/win.js";

const gameBoard = document.querySelector("#app");

let state = {
  guesses: 0
};

function renderView(view) {
  gameBoard.innerHTML = view;
}

function init() {
  renderView(initialView);
  initialController();
}

function initialController() {
  let startBtn = document.querySelector("#startBtn");

  function startGame() {
    startBtn.removeEventListener("click", startGame);
    renderView(gameView);
    gameController();
  };

  startBtn.addEventListener("click", startGame);
}

function renderCurrentWord() {
  state.wordArr.forEach((char, index) => {
    let newChar = document.createElement("span");
    newChar.innerText = "?";
    state.currentWord.appendChild(newChar);
  });
}

function renderHangmanImage() {
  state.hangmanImage.src = `../images/h${state.guesses}.png`;
}

function renderLetters() {
  state.alphabet.forEach((char) => {
    let letter = document.createElement("span");
    letter.innerText = char;
    letter.dataset.char = char;
    state.letters.appendChild(letter);
  })
}

function renderMessage(message = `Du har ${6 - state.guesses} gissningar kvar.`) {
  state.messageBar.innerHTML = `<p>${message}</p>`;
}

function attachGameControlls() {
  state.letters.addEventListener("click", letterClickHandler);
  state.endGame.addEventListener("click", init);
}

function letterClickHandler(event) {
  let clickedChar = event.target;

  clickedChar.parentElement.removeChild(clickedChar);

  let char = clickedChar.dataset.char;
  if (state.wordArr.includes(char)) {
    let index = state.wordArr.indexOf(char);
    while (index != -1) {
      state.currentWord.children[index + 1].innerText = char;
      let continueFrom = ++index;
      index = state.wordArr.indexOf(char, continueFrom);
    }
  } else {
    state.guesses++;
    renderMessage();
  }

}

function gameController() {
  state.word = wordArray[Math.floor(Math.random() * wordArray.length)];
  state.word = "hello"; // for testing
  state.wordArr = state.word.split("");
  state.currentWord = document.querySelector("#current-word");
  state.hangmanImage = document.querySelector("#hangman-image");
  state.messageBar = document.querySelector("#message-bar");
  state.letters = document.querySelector("#letters");
  state.endGame = document.querySelector("#end-game");
  state.alphabet = "abcdefghijklmnopqrstuvwxyzåäö".split("");

  renderCurrentWord();
  renderHangmanImage();
  renderLetters();
  renderMessage(`Välj bokstav i fältet nedan. Du har ${6 - state.guesses} gissningar kvar.`);
  attachGameControlls();
}

window.onload = init;