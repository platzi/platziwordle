/**
 * Aplicación de Subject en PlatziWordle:
 * Subject nos ayuda a generar un observable donde podemos insertar valores fuera del observable.
 * En PlatziWordle nos ayudará para alertar cuando el usuario ha ganado o ha perdido.
 * En esta clase, creamos el mecanismo para alertar cuando el usuario ha ganado.
 */

import { fromEvent, Subject } from "rxjs";
import WORDS_LIST from "./wordsList.json";

const letterRows = document.getElementsByClassName("letter-row");
const onKeyDown$ = fromEvent(document, "keydown");
let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer = [];
const getRandomWord = () =>
  WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
let rightWord = getRandomWord();
console.log(`Right word: ${rightWord}`);

const userWinOrLoose$ = new Subject();

const insertLetter = {
  next: (event) => {
    const pressedKey = event.key.toUpperCase();
    if (pressedKey.length === 1 && pressedKey.match(/[a-z]/i)) {
      let letterBox =
        Array.from(letterRows)[letterRowIndex].children[letterIndex];
      letterBox.textContent = pressedKey;
      letterBox.classList.add("filled-letter");
      letterIndex++;
      userAnswer.push(pressedKey);
    }
  },
};

const checkWord = {
  next: (event) => {
    if (event.key === "Enter") {
      // Si la respuesta del usuario es igual a la palabra correcta:
      if (userAnswer.join("") === rightWord) {
        // Emite un valor (vacío) hacia el observable `userWinOrLoose$` (ver línea 53)
        userWinOrLoose$.next();
      }
    }
  },
};

onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(checkWord);

// Cuando se emite un valor vacío, se ejecuta el siguiente observador:
userWinOrLoose$.subscribe(() => {
  let letterRowsWinned = letterRows[letterRowIndex];
  // Lo siguiente nos permite pintar los contenedores de las letras con color verde 🟩 🟩 🟩 🟩 🟩
  for (let i = 0; i < 5; i++) {
    letterRowsWinned.children[i].classList.add("letter-green");
  }
});
