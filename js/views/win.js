export default function (state) {
    return `
<section id="current-word">
  <p>YES! Du har än en gång lurat bödeln och lever vidare.</p>
</section>

<img src="../../images/h5.png" id="hangman-image"></img>

<section id="message-bar">Du lyckades klara av att gissa ordet och hade ${state.guesses} fel-gissning${(state.guesses ===1) ? "" : "ar"}.</section>

<section><button id="restart">Starta om</button></section>`
}