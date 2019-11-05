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

function renderCurrentWord(word, currentWord) {
  word.forEach((char, index) => {
    let newChar = document.createElement("span");
    newChar.innerText = "?";
    currentWord.appendChild(newChar);
  });
}

function renderGameBoard(gameBoard) {

}


function gameController() {
  state.word = wordArray[Math.floor(Math.random() * wordArray.length)];
  let currentWord = document.querySelector("#current-word");
  let gameBoard = document.querySelector("#game-board");
  let message = document.querySelector("#message");
  let letters = document.querySelector("#letters");
  let alphabet = "abcdefghijklmnopqrstuvwxyzåäö".split("");
  let word = state.word.split("");

  renderCurrentWord(word, currentWord);
  renderGameBoard();
  renderLetters();
  renderMessage(`Välj bokstav i fältet nedan. Du har ${6 - state.guesses} gissningar kvar.`);


}

window.onload = init;