import wordArray from "./models/word-array.js";
import alphabet from "./models/alphabet.js";

import initialView from "./views/initial.js";
import gameView from "./views/game.js";
import lossView from "./views/loss.js";
import winView from "./views/win.js";

/** Find starting point in the DOM for setting the different views. */
const game = document.querySelector("#app");

/** Initialize state as a variable of global scope, accessible in the whole code. */
let state = {};

/** Function for rendering the different views. Views are imported as functions in order
 *  to be able to pass arguments to the different views. For example to be able to access
 *  the scope variable in the templates.
 */
function renderView(view) {
  game.innerHTML = view(state);
}


/** Render placeholders for the current word to be guessed. Loop over the word-Array
 *  and for each character create a span-element containing a "?". Append the elements
 *  to the section for the word in the game-view. The true content of the letters
 *  is irrelevant at this time.
 */
function renderCurrentWord() {
  state.wordArr.forEach(() => {
    let newChar = document.createElement("span");
    newChar.innerText = "?";
    state.currentWord.appendChild(newChar);
  });
}


function renderHangmanImage() {
  state.hangmanImage.src = `./images/h${state.guesses}.png`;
}


/** Render all the letters of the alphabet as new elements appended to the letters-section
 *  of the game-view.
 */
function renderLetters() {
  state.alphabet.forEach((char) => {
    let letter = document.createElement("span");
    letter.innerText = char.toLowerCase();
    letter.dataset.char = char.toLowerCase();
    state.letters.appendChild(letter);
  })
}


function renderMessage(message = `Du har ${6 - state.guesses} gissningar kvar.`) {
  state.messageBar.innerHTML = `<p>${message}</p>`;
}


function attachGameControlls() {
  state.letters.addEventListener("click", letterClickHandler);
  state.endGame.addEventListener("click", init);
  window.addEventListener("keyup", keyPressHandler);
}


function letterClickHandler(event) {
  /** Find out what letter/key was clicked. */
  let clickedChar = event.target;

  if (clickedChar.nodeName !== "SPAN") return;

  clickedChar.parentElement.removeChild(clickedChar);

  let char = clickedChar.innerText.toLowerCase();

  checkForCharInWord(char);
  checkForEndOfGame();
}


function keyPressHandler(event) {
  let pressedKey = event.key.toLowerCase();
  if (pressedKey === " ") {
    window.removeEventListener("keyup", keyPressHandler);
    init();
    return;
  }
  if (!state.alphabet.includes(pressedKey) || state.pressedKeys.includes(pressedKey)) return true;

  state.pressedKeys.push(pressedKey);

  let keyElm = document.querySelector(`[data-char=${pressedKey}]`);

  keyElm.parentElement.removeChild(keyElm);

  checkForCharInWord(pressedKey);
  checkForEndOfGame();

  return true;
}


/** Check if the clicked letter/key is present in the current word.
 *    
 *  If so: Change questionmark to the character and set the index in
 *  the word-array to true. Continue search until no more
 *  occurances.
 *  
 *  If not: Update guesses and render new message.
 */
function checkForCharInWord(char) {
  if (state.wordArr.includes(char)) {
    let index = state.wordArr.indexOf(char);
    while (index != -1) {
      /** For each hit in the array change the "?" to the clicked letter/key. */
      state.currentWord.children[index + 1].innerText = char;
      /** Change the current index in the word-array to true for later testing if
       *   if the victory-condition is met.
       */
      state.wordArr[index] = true;
      let continueFrom = ++index;
      index = state.wordArr.indexOf(char, continueFrom);
    }
  } else {
    /** Not a hit so increasenumer of guesses, redraw image and update message. */
    state.guesses++;
    renderHangmanImage();
    renderMessage();
  }
}


function checkForEndOfGame() {
  if (state.guesses === state.maxguesses) {
    renderView(lossView);
    lossController();
    return;
  }

  if (state.wordArr.every((item) => item === true)) {
    renderView(winView);
    winController();
  }
}


function init() {
  state = {
    guesses: 0,
    maxguesses: 6
  };

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


/**
 *  The main game-controller.
 *  - Starts by getting a random word from the imported words-array.
 *  - Stores DOM-references in the state-variable for access throughout the game.
 *  - Renders the differnet parts of the game-view by calling render-functions for the different
 *    parts.
 *  - Calls the attachGameControlls-function to initialize the event handlers.   
 */
function gameController() {
  state.wordArr = wordArray[Math.floor(Math.random() * wordArray.length)].toLowerCase().split("");
  state.currentWord = document.querySelector("#current-word");
  state.hangmanImage = document.querySelector("#hangman-image");
  state.messageBar = document.querySelector("#message-bar");
  state.letters = document.querySelector("#letters");
  state.endGame = document.querySelector("#end-game");
  state.alphabet = alphabet.toLowerCase().split("");
  state.pressedKeys = [];

  renderCurrentWord();
  renderHangmanImage();
  renderLetters();
  renderMessage(`Välj bokstav i fältet nedan. Du har ${state.maxguesses - state.guesses} gissningar kvar.`);
  attachGameControlls();
}


function lossController() {
  window.removeEventListener("keyup", keyPressHandler);
  state.restart = document.querySelector("#restart");

  function restartGame() {
    state.restart.removeEventListener("click", restartGame);
    init();
  }

  state.restart.addEventListener("click", restartGame);
}


/**
 * The game has been won. Since the actions currently are the same as in the case of
 * a loss just call the loss-controller.
 */
function winController() {
  lossController();
}

window.onload = init;