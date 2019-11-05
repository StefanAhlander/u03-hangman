import wordArray from "./models/word-array.js";

import initialView from "./views/initial.js";
import gameView from "./views/game.js";
import lossView from "./views/loss.js";
import winView from "./views/win.js";

const gameBoard = document.querySelector("#app");

console.log(wordArray[0]);

const renderView = (view) => {
    gameBoard.innerHTML = view;
}

const init = () => {
    let state = {
        guesses: 0
    };

    renderView(initialView);
    initialControler();
}

const initialControler = () => {
    let startBtn = document.querySelector("#startBtn");
    startBtn.addEventListener("click", () => {
        renderView(gameView);
        gameController();
    });
}

window.onload = init;