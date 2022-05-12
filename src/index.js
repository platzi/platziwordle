/**
 * Aplicamos takeUntil para completar los observables insertLetter$, checkWord$ y removeLetter$
 * takeUntil tomará como argumento userWinOrLoose$.
 * Entonces cuando el usuario/a pierda o gane (se señalará userWinOrLoose$), los observables
 * anteriores se completarán correctamente.
 */

import { fromEvent, Subject } from "rxjs";
import { map, filter, takeUntil } from "rxjs/operators";
import WORDS_LIST from "./wordsList.json";

const restartButton = document.getElementById("restart-button");
const letterRows = document.getElementsByClassName("letter-row");
const messageText = document.getElementById("message-text");
const onKeyDown$ = fromEvent(document, "keydown");
let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer = [];
const getRandomWord = () =>
  WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
let rightWord = getRandomWord();
console.log(`Right word: ${rightWord}`);

const userWinOrLoose$ = new Subject();

const insertLetter$ = onKeyDown$.pipe(
  map((event) => event.key.toUpperCase()),
  filter(
    (pressedKey) =>
      pressedKey.length === 1 && pressedKey.match(/[a-z]/i) && letterIndex < 5
  )
);

const insertLetter = {
  next: (letter) => {
    let letterBox =
      Array.from(letterRows)[letterRowIndex].children[letterIndex];
    letterBox.textContent = letter;
    letterBox.classList.add("filled-letter");
    letterIndex++;
    userAnswer.push(letter);
  },
};

const checkWord$ = onKeyDown$.pipe(
  map((event) => event.key),
  filter((key) => key === "Enter" && letterIndex === 5 && letterRowIndex <= 5)
);

const checkWord = {
  next: () => {
    if (userAnswer.length !== 5) {
      messageText.textContent = "¡Te faltan algunas letras!";
      return;
    }

    // También podemos cambiar el ciclo for/forEach/while en lugar de `userAnswer.map()`
    // Iteramos sobre las letras en índices `[0, 1, 2, 3, 4]`:
    userAnswer.map((_, i) => {
      let letterColor = "";
      let letterBox = letterRows[letterRowIndex].children[i];

      let letterPosition = rightWord.indexOf(userAnswer[i]);

      if (rightWord[i] === userAnswer[i]) {
        letterColor = "letter-green";
      } else {
        if (letterPosition === -1) {
          letterColor = "letter-grey";
        } else {
          letterColor = "letter-yellow";
        }
      }
      letterBox.classList.add(letterColor);
    });

    // if (userAnswer.length === 5) {
    //   letterIndex = 0;
    //   userAnswer = [];
    //   letterRowIndex++;
    // }

    if (userAnswer.join("") === rightWord) {
      messageText.textContent = `😊 ¡Sí! La palabra ${rightWord.toUpperCase()} es la correcta`;
      userWinOrLoose$.next();
      restartButton.disabled = false;
    } else {
      letterIndex = 0;
      letterRowIndex++;
      userAnswer = [];

      if (letterRowIndex === 6) {
        messageText.textContent = `😔 Perdiste. La palabra correcta era: "${rightWord.toUpperCase()}"`;
        userWinOrLoose$.next();
        restartButton.disabled = false;
      }
    }
  },
};

const removeLetter$ = onKeyDown$.pipe(
  map((event) => event.key),
  filter((key) => key === "Backspace" && letterIndex !== 0)
);

const removeLetter = {
  next: () => {
    let letterBox = letterRows[letterRowIndex].children[userAnswer.length - 1];
    letterBox.textContent = "";
    letterBox.classList = "letter";
    letterIndex--;
    userAnswer.pop();
  },
};

userWinOrLoose$.subscribe(() => {
  let letterRowsWinned = letterRows[letterRowIndex];
  for (let i = 0; i < 5; i++) {
    letterRowsWinned.children[i].classList.add("letter-green");
  }
});

// Ahora suscribimos los observables, pero antes los encadenamos con takeUntil(userWinOrLoose$):
// ✅ De esa forma, cuando se ejecuta userWinOrLoose$.next() (ver línea 85, línea 94), se completarán
// los observables devueltos por insertLetter$, checkWord$, removeLetter$.
insertLetter$.pipe(takeUntil(userWinOrLoose$)).subscribe(insertLetter);
checkWord$.pipe(takeUntil(userWinOrLoose$)).subscribe(checkWord);
removeLetter$.pipe(takeUntil(userWinOrLoose$)).subscribe(removeLetter);
