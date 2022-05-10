/**
 * Simplificando código JavaScript a través de funciones como map y filter.
 * En esta clase aplicamos los operadores map y filter para reemplazar algunas líneas de código.
 * También se han convertido insertLetter, removeLetter (deleteLetter) y checkWord a observables.
 */

import { fromEvent, Subject } from "rxjs";
import { map, filter } from "rxjs/operators";
import WORDS_LIST from "./wordsList.json";

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

// Ahora el observable insertLetter$ se encarga de convertir una letra a mayúscula,
// y luego a comprobar si cumple con una serie de condiciones (línea 30).
const insertLetter$ = onKeyDown$.pipe(
  map((event) => event.key.toUpperCase()),
  filter(
    (pressedKey) =>
      pressedKey.length === 1 && pressedKey.match(/[a-z]/i) && letterIndex < 5
  )
);

// Nuestro observador insertLetter ahora sólo se ocupa de agregar una letra a través de next (letter)
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

// Ahora el observable checkWord$ se encargará de verificar si es momento de revisar una palabra
// Primero comprobando que se presiona `Enter`, y luego verificando que hayamos completado la palabra
// antes de proceder a verificarla. 🔍
const checkWord$ = onKeyDown$.pipe(
  map((event) => event.key),
  filter((key) => key === "Enter" && letterIndex === 5 && letterRowIndex <= 5)
);

// El observador checkWord se encarga directamente de verificar la palabra
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

    if (userAnswer.length === 5) {
      letterIndex = 0;
      userAnswer = [];
      letterRowIndex++;
    }

    if (userAnswer.join("") === rightWord) {
      userWinOrLoose$.next();
    }
  },
};

// El observable removeLetter$ se encarga de verificar que se oprimió la tecla correcta
// y que hayamos escrito al menos una letra (línea 98).
const removeLetter$ = onKeyDown$.pipe(
  map((event) => event.key),
  filter((key) => key === "Backspace" && letterIndex !== 0)
);

// El observador removeLetter sólo remueve la última palabra.
const removeLetter = {
  next: () => {
    let letterBox = letterRows[letterRowIndex].children[userAnswer.length - 1];
    letterBox.textContent = "";
    letterBox.classList = "letter";
    letterIndex--;
    userAnswer.pop();
  },
};

// Finalmente suscribimos los observadores con los observables 🎉
insertLetter$.subscribe(insertLetter);
checkWord$.subscribe(checkWord);
removeLetter$.subscribe(removeLetter);

userWinOrLoose$.subscribe(() => {
  let letterRowsWinned = letterRows[letterRowIndex];
  for (let i = 0; i < 5; i++) {
    letterRowsWinned.children[i].classList.add("letter-green");
  }
});
