export default function (state) {
    return `
<h2>Välkommen till spelet Hänga gubbe.</h2>
<p>När du trycker på starta spelet, kommer datorn att välja ett ord slumpmässigt. </p>
<p>Det kommer då dyka upp ett visst antal fält som motsvarar antalet bokstäver i ordet. </p>
<p>Ditt mål är att gissa ordet genom att trycka på bokstavsknapparna.</p>
<p>För varje bokstav du gissar rätt, så fylls dyker det upp en bokstav i på den plats som bokstaven du gissade på motsvarar i ordet.</p>
<button id="startBtn">Starta spelet</button>
`
}