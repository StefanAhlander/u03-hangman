export default function (state) {
  return `
<section id="current-word">
  <p>YES! Du har än en gång lurat bödeln och lever vidare.</p>
</section>

<section id="hangman-image-section">
  <img src="../../images/victory-image.jpg" id="hangman-image"></img>
</section>

<section id="message-bar">
  <p>Du lyckades klara av att gissa ordet och hade ${state.guesses} fel-gissning${(state.guesses ===1) ? "" : "ar"}.</p>
</section>

<section>
  <button id="restart" class="btn-restart">Starta om</button>
</section>`
}