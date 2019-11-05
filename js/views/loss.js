export default function (state) {
    return `
<section id="current-word">
  <p>Oh noooooo!!! </p>
</section>

<img src="../../images/h6.png" id="hangman-image"></img>

<section id="message-bar">Du lyckades inte klara av att gissa ordet på ${state.maxguesses} gissningar. Bättre lycka nästa gång...</section>

<section><button id="restart">Starta om</button></section>`
}