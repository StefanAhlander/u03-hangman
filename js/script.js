window.addEventListener("load", function init() {
  (function () {
    const wordArr = ["javascript", "katt", "hund", "hiss", "båt", "internet", "annanas", "banan", "äpple"];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("");
    let guesses;
    let letterButtons = document.querySelector("#letterButtons");
    let letterBoxes = document.querySelector("#letterBoxes");

    function pipe(...fns) {
      return function (op) {
        fns.reduce((op, fn) => fn(op), op);
      }
    }

    let startGame = pipe(
      resetGuesses,
      removeIntroText,
      renderButtons,
      getNewWord,
      renderLetters,
      renderImage,
      renderMessage,
      listenForButtonClick
    );

    let handleGameAction = pipe(
      checkForMatch,
      removeButton,
      renderImage,
      checkForEnd
    );

    function getNewWord() {
      return wordArr[Math.floor(Math.random() * wordArr.length)];
    }

    function removeIntroText() {
      document.querySelector("main>article").innerHTML = "";
    }

    function resetGuesses() {
      guesses = 0;
    }

    function renderLetters(word) {
      letterBoxes.rightAnswer = word;
      letterBoxes.innerHTML = "";
      [...word].forEach((letter) => {
        let elm = document.createElement("span");
        elm.innerText = "?";
        elm.dataset.letter = letter.toUpperCase();
        letterBoxes.appendChild(elm);
      });
    }

    function renderButtons() {
      letterButtons.innerHTML = "";
      alphabet.forEach((letter) => {
        let elm = document.createElement("span");
        elm.innerText = letter;
        elm.classList.add("letterBtn");
        letterButtons.appendChild(elm);
      });
    }

    function renderMessage(message = `Du har ${6-guesses} fel-gissningar kvar.`) {
      document.querySelector("#message").innerHTML = message;
    }

    function renderImage() {
      document.querySelector("#hangman").src = `./images/h${guesses}.png`;
    }

    function removeButton(elm) {
      elm.parentNode.removeChild(elm);
    }

    function listenForButtonClick() {
      letterButtons.addEventListener("click", handleButtonClick);
    }

    function removeBtnClickListner() {
      letterButtons.removeEventListener("click", handleButtonClick);
    }

    function handleButtonClick(evt) {
      if (evt.target.nodeName !== "SPAN") return;
      handleGameAction(evt.target);
    }

    function checkForMatch(elm) {
      letterBoxes.querySelectorAll("span").forEach((spanElm) => {
        if (spanElm.dataset.letter === elm.innerText) {
          spanElm.innerText = elm.innerText;
          elm.matched = true;
        }
      });
      if (elm.matched !== true) guesses++;
      return elm;
    }

    function checkForEnd() {
      if (guesses === 6) {
        endGame(`Du har förlorat. Rätt ord var ${letterBoxes.rightAnswer}. Bättre lycka nästa gång.`);
      } else if ([...letterBoxes.querySelectorAll("span")].every((spanElm) => {
          return spanElm.innerText !== "?";
        })) {
        endGame(`Du har vunnit med ${6-guesses} fel-gissningar kvar.`);
      } else {
        renderMessage();
      }
    }

    function endGame(message) {
      removeBtnClickListner();
      renderMessage(message);
    }

    document.querySelector("#startGameBtn").addEventListener("click", startGame);
  })();
});