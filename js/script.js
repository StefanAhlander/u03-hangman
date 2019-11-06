/** Words, alphabet and messages are imported so that localization only requires changes
 *  in the medels and views and not in the code.
 */
import wordArray from "./models/word-array.js";
import alphabet from "./models/alphabet.js";
import messages from "./models/messages.js";

import initialView from "./views/initial.js";
import gameView from "./views/game.js";
import lossView from "./views/loss.js";
import winView from "./views/win.js";

/** Find starting point in the DOM for setting the different views. */
const gameBoard = document.querySelector("#app");

/** Initialize state as a variable of global scope, accessible in the whole code. */
let state = {};

/** Function for rendering the different views. Views are imported as functions in order
 *  to be able to pass arguments to the different views. For example to be able to access
 *  the scope variable in the templates.
 */
function renderView(view) {
  gameBoard.innerHTML = view(state);
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
    state.currentWordHolder.appendChild(newChar);
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
    letter.innerText = letter.dataset.char = char.toLowerCase();
    state.lettersHolder.appendChild(letter);

    /** Set speech handlers used to display use of closures. */
    setSpeechHandler(letter);
  });
}

function renderMessage(message = messages.default) {
  let newMessage = message.replace("#PLACEHOLDER#", `${state.maxguesses - state.guesses}`);
  state.messageBar.innerHTML = `<p>${newMessage}</p>`;
}

function attachGameControlls() {
  state.lettersHolder.addEventListener("click", handleMouseClick);
  state.endGameBtn.addEventListener("click", init);
  window.addEventListener("keypress", handleKeyPress);
  /** Prevent default behaviour of the end-game-button. Keypress is handled in
   * the handleKeyPress event handler.
   */
  state.endGameBtn.addEventListener("keypress", function pressReturn(event) {
    event.preventDefault();
  });
}

function handleGameInput(elm, key) {
  removeKey(elm, key);
  checkForCharInWord(key);
  checkForEndOfGame();
}

/** Remove the element corresponding to the pressed key and push the key value
 *  to the array for allready pressed keys for future comparison.
 */
function removeKey(elm, key) {
  elm.parentElement.removeChild(elm);
  state.pressedKeys.push(key);
}

function handleMouseClick(event) {
  let elm = event.target;
  if (elm.nodeName !== "SPAN") return;
  let key = elm.innerText.toLowerCase();
  handleGameInput(elm, key);
}

function handleKeyPress(event) {
  let key = event.key.toLowerCase();

  /** If the key pressed is enter and the rnd-game-button is in focus
   *  end the game.
   */
  if ((key === "enter" && document.activeElement === state.endGameBtn)) {
    window.removeEventListener("keypress", handleKeyPress);
    init();
    return;
  }

  /** If either the key pressed is not part of the alphabet or the key has 
   *  allready been pressed return without action.
   */
  if (!state.alphabet.includes(key) || state.pressedKeys.includes(key)) return;

  /** Else handle the input. */
  handleGameInput(document.querySelector(`[data-char=${key}]`), key);
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
      state.currentWordHolder.children[index + 1].innerText = char;

      /** Change the current index in the word-array to true for later testing if
       *   if the victory-condition is met.
       */
      state.wordArr[index] = true;
      let continueFrom = ++index;
      index = state.wordArr.indexOf(char, continueFrom);
    }
  } else {
    /** Not a hit so increase number of guesses, redraw image and update message. */
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
  renderView(initialView);
  initialController();
}

function startGame() {
  renderView(gameView);
  gameController();
};

function initialController() {
  document.querySelector("#startBtn").addEventListener("click", startGame);
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
  state = {
    guesses: 0,
    maxguesses: 6
  };
  state.wordArr = wordArray[Math.floor(Math.random() * wordArray.length)].toLowerCase().split("");
  state.currentWordHolder = document.querySelector("#current-word");
  state.hangmanImage = document.querySelector("#hangman-image");
  state.messageBar = document.querySelector("#message-bar");
  state.lettersHolder = document.querySelector("#letters");
  state.endGameBtn = document.querySelector("#end-game");
  state.alphabet = alphabet.toLowerCase().split("");
  state.pressedKeys = [];

  /***** For testing only *****/
  console.log(state.wordArr);

  renderCurrentWord();
  renderHangmanImage();
  renderLetters();
  renderMessage(messages.initial);
  attachGameControlls();
}

function lossController() {
  /** Remove event listner from window-object to avoid registering multiple handlers. */
  window.removeEventListener("keypress", handleKeyPress);

  document.querySelector("#restart").addEventListener("click", startGame);
}

/**
 * The game has been won. Since the actions currently are the same as in the case of
 * a loss just call the loss-controller.
 */
function winController() {
  lossController();
}

/** The way this code is structured I have found no practical direct use of
 *  closures. This piece of speech-api code is included to demonstrate closure 
 *  techniques.
 * 
 *  The event handler (function) attached to the click event on the key-elements 
 *  (letter) has access to the local synth and sayThis variables because of where
 *  it is defined. At the time of definition theese variables are in scope for the
 *  function and they therefore remain accessable by the function when it is invoked
 *  later, in another scope, when a letter is clicked on. 
 */
function setSpeechHandler(letter) {
  if ("speechSynthesis" in window) {
    let synth = window.speechSynthesis;
    let sayThis = new SpeechSynthesisUtterance(letter.innerText);
    sayThis.lang = "sv-SE"; // Maybe in the future...

    let speechHandler = function () {
      synth.speak(sayThis);
    }

    letter.addEventListener("click", speechHandler);
  }
}

window.onload = init;