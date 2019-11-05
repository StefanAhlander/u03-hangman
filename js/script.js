/** Import Array containing words. */
import wordArray from "./models/word-array.js";

/** Import views for the different stages of the game. */
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
 *  to the section for the word in the game-view.
 */
function renderCurrentWord() {
  state.wordArr.forEach((char, index) => {
    let newChar = document.createElement("span");
    newChar.innerText = "?";
    state.currentWord.appendChild(newChar);
  });
}

/** Load the correct image depending on the number of spent guesses. Do this by updating
 *  the src property of the image-element allready stored in state.
 */
function renderHangmanImage() {
  state.hangmanImage.src = `../images/h${state.guesses}.png`;
}

/** Render all the letters of the alphabet as new elements appended to the letters-section
 *  of the game-view. Set dataset of each element to the current letter/char.
 */
function renderLetters() {
  state.alphabet.forEach((char) => {
    let letter = document.createElement("span");
    letter.innerText = char;
    letter.dataset.char = char;
    state.letters.appendChild(letter);
  })
}

/** Render a message for the player in teh message-section of the game-view. If no message
 *  is passed use a default message.
 */
function renderMessage(message = `Du har ${6 - state.guesses} gissningar kvar.`) {
  state.messageBar.innerHTML = `<p>${message}</p>`;
}

/** Attach the event-handlers for in-game acions. For clicking letters and clicking the
 *  end-game button.
 */
function attachGameControlls() {
  state.letters.addEventListener("click", letterClickHandler);
  state.endGame.addEventListener("click", init);
}

/** Eventhandler for clicking letters in the game-view. */
function letterClickHandler(event) {
  /** Find out what letter/key was clicked. */
  let clickedChar = event.target;

  /** Remove the letter/key that was clicked from the DOM. */
  clickedChar.parentElement.removeChild(clickedChar);

  /** Check if the clicked letter/key is present in the current word.
   *    
   *  If so: Change questionmark to the character and set the index in
   *  the word-array to true. Continue search until no more
   *  occurances.
   *  
   *  If not: Update guesses and render new message.
   */
  let char = clickedChar.dataset.char;

  /** Check if the clicked letter is pressent in the word. */
  if (state.wordArr.includes(char)) {
    /** Loop over all occurances of the char in the word-array. */
    let index = state.wordArr.indexOf(char);
    while (index != -1) {
      /** For each hit in the array change the "?" to the clicked letter/key. */
      state.currentWord.children[index + 1].innerText = char;
      /** Change the current index in the word-array to true for later testing if
       *   if the victory-condition is met.
       */
      state.wordArr[index] = true;
      /** Increase index by one and do another index-search. */
      let continueFrom = ++index;
      index = state.wordArr.indexOf(char, continueFrom);
    }
  } else {
    /** Not a hit so increasenumer of guesses, redraw image and update message. */
    state.guesses++;
    renderHangmanImage();
    renderMessage();
  }

  /** Check for end or victory conditions. */
  if (state.guesses === state.maxguesses) {
    /** Number of guesses equals max numer of guesses so the game is over. */
    renderView(lossView);
    lossController();
    return;
  }

  if (state.wordArr.every((item) => item === true)) {
    /** The game has been won! */
    renderView(winView);
    winController();
  }
}

function init() {
  /** Set or reset state to store game and DOM variables. */
  state = {
    guesses: 0,
    maxguesses: 6
  };

  /** Render initial view and start. */
  renderView(initialView);
  initialController();
}

/** After the initial view is rendered wait for the player to press the
 *  start-button.
 */
function initialController() {
  /** Locate the start-button-element in the DOM. */
  let startBtn = document.querySelector("#startBtn");

  /**
   * Event handler for clicking the start button. After click remove the event-listner,
   * render the game-view and go to the game-controller.
   */
  function startGame() {
    startBtn.removeEventListener("click", startGame);
    renderView(gameView);
    gameController();
  };

  /** Attach eventlistner to the start-button-element. */
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
  renderMessage(`Välj bokstav i fältet nedan. Du har ${state.maxguesses - state.guesses} gissningar kvar.`);
  attachGameControlls();
}

/**
 * The game has been lost. The loss-view is allready rended so just attach an event handler
 * to the restart-button.
 */
function lossController() {
  state.restart = document.querySelector("#restart");

  /** When the restart-button is clicked restart the game by calling the init-function. */
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

/** When the document has finished loading fire the onload-event on window and run the 
    init-function to start the game. */
window.onload = init;