window.addEventListener("load", function init() {
  window.removeEventListener("load", init);

  (function (window) {
    const wordArr = ["javascript", "katt", "hund", "hiss", "båt", "internet", "annanas", "banan", "äpple"];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("");
    let selectedWord;
    let guesses = 0;
    let msgHolderEl = document.querySelector("#message");
    let startGameBtnEl = document.querySelector("#startGameBtn");
    let letterButtons = document.querySelector("#letterButtons");
    let letterBoxes = document.querySelector("#letterBoxes");
    let letterBoxEls;

    function pipe(op, ...fns /* expression to operate on followed by a list of functions that will operate on the exp. */ ) {
      return fns.reduce((op, fn) => fn(op), op);
    }

    function getNewWord() {
      return wordArr[Math.floor(Math.random() * wordArr.length)];
    }

    function renderLetters(word) {
      letterBoxes.innerHTML = "";
      [...word].forEach((letter) => {
        let elm = document.createElement("span");
        elm.innerText = "?";
        elm.dataset.letter = letter.toUpperCase();
        letterBoxes.appendChild(elm);
      });
      console.log(word);
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

    function renderMessage(message) {
      document.querySelector("#message").innerHTML = message;
    }

    function removeButton(elm) {
      elm.parentNode.removeChild(elm);
      return elm;
    }

    function listenForButtonClick() {
      letterButtons.addEventListener("click", handleButtonClick);
    }

    function removeBtnClickListner() {
      letterButtons.removeEventListener("click", handleButtonClick);
    }

    function handleButtonClick(evt) {
      let elm = evt.target;
      if (elm.nodeName !== "SPAN") return;
      pipe(elm, checkForMatch, removeButton, checkForEnd);
    }

    function checkForMatch(elm) {
      document.querySelectorAll("#letterBoxes span").forEach((spanElm) => {
        if (spanElm.dataset.letter == elm.innerText) {
          spanElm.innerText = elm.innerText;
          spanElm.dataset.letter = elm.matched = true;
        }
      });
      if (!elm.matched === true) guesses++;
      return elm;
    }

    function checkForEnd(elm) {
      if (guesses === 6) {
        removeBtnClickListner();
        renderMessage("Du har förlorat. Bättre lycka nästa gång.")
      }

    }





    pipe(null, renderButtons, getNewWord, renderLetters, listenForButtonClick);




  })(window);
});