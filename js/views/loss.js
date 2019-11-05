export default function (state) {
  return `
<section id="current-word">
  <p>Oh noooooo!!! </p>
</section>

<section id="hangman-image-section">
  <img src="./images/h6.png" id="hangman-image"></img>
</section>

<section id="message-bar">
  <p>Du lyckades inte klara av att gissa ordet. Du gissade fel ${state.maxguesses} gånger. Bättre lycka nästa gång...</P>
</section>

<section>
  <button id="restart" class="btn-restart">Starta om</button>
</section>`
}