# Uppgift - Hangman

Detta spel är en inlämningsuppgift. Uppgiften har gått ut på att implementera ett hänga gubbe spel.
Spelet ska vara responsivt och kunna spelas på flera olika plattformar, operativsystem och i olika webbläsare.

# Implementation

Jag har byggt spelet lite mer modulärt än vad som var absolut nödvändigt för att klara uppgiften men detta ger
möjlighet att implementera förändringar, förbättringar och att lokalisera spelet lättare än annars.

Exempelvis ligger spelets data och textinnehåll i externa moduler och kan på så sätt enkelt bytas ut.

En live-version av spelet ligger upp på https://aahlander.se/u03-hangman/

# Extra

Jag har också byggte en annan version av spelet där mitt syfte varit att lämna så litet avtryck i det globala scopet som möjligt samt att leka med funktionell programmering.

Koden ligger i branch module-version och en live-version ligger på https://aahlander.se/u03-hangman-alt