export default function (state) {
  return `
<section id="current-word">
  <p>Ord att gissa: </p>
</section>

<section id="hangman-image-section">
  <img src="../../images/h0.png" id="hangman-image"></img>
</section>

<section id="message-bar"></section>

<section id="letters"></section>

<section>
  <button id="end-game" class="btn-end">Sluta spela</button>
</section>`
}