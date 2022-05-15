/**
 * Finalmente, terminamos el botón de Reiniciar en PlatziWordle.
 */

import { merge, fromEvent, Subject } from "rxjs";
import { map, filter, takeUntil } from "rxjs/operators";
import WORDS_LIST from "./wordsList.json";

const restartButton = document.getElementById("restart-button");
const letterRows = document.getElementsByClassName("letter-row");
const messageText = document.getElementById("message-text");
const onKeyDown$ = fromEvent(document, "keydown");
let letterIndex;
let letterRowIndex;
let userAnswer;
const getRandomWord = () =>
  WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
let rightWord;

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
  filter((key) => key === "Enter" && letterRowIndex < 6)
);

const checkWord = {
  next: () => {
    if (userAnswer.length != 5) {
      messageText.textContent =
        userAnswer.length === 4
          ? "Te falta 1 letra"
          : `Te faltan ${5 - userAnswer.length} letras`;
      return;
    }

    if (!WORDS_LIST.includes(userAnswer.join(""))) {
      messageText.textContent = `¡La palabra ${userAnswer
        .join("")
        .toUpperCase()} no está en la lista!`;
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

const onRestartClick$ = fromEvent(restartButton, "click");
const onWindowLoad$ = fromEvent(window, "load");
const restartGame$ = merge(onWindowLoad$, onRestartClick$);

restartGame$.subscribe(() => {
  Array.from(letterRows).map((row) =>
    Array.from(row.children).map((letterBox) => {
      letterBox.textContent = "";
      letterBox.classList = "letter";
    })
  );

  letterRowIndex = 0;
  letterIndex = 0;
  userAnswer = [];
  messageText.textContent = "";
  rightWord = getRandomWord();

  restartButton.disabled = true;

  console.log(`Right word: ${rightWord}`);

  let insertLetterSubscription = insertLetter$
    .pipe(takeUntil(userWinOrLoose$))
    .subscribe(insertLetter);
  let checkWordSubscription = checkWord$
    .pipe(takeUntil(userWinOrLoose$))
    .subscribe(checkWord);
  let removeLetterSubscription = removeLetter$
    .pipe(takeUntil(userWinOrLoose$))
    .subscribe(removeLetter);
});
