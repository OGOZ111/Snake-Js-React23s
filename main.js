const playBoard = document.querySelector(".play-board");
const scoreboard = document.querySelector(".score");
const scoreBoardLocale = document.querySelector(".topScores");

// Load the localestorage scores on the page load and set them in the field up top
document.addEventListener("DOMContentLoaded", function () {
  let topScores = JSON.parse(localStorage.getItem("topScores")) || [];
  let topScoresHtml = "Top 5 High Scores:  ";
  for (let i = 0; i < topScores.length; i++) {
    topScoresHtml += `${topScores[i]} `;
  }
  scoreBoardLocale.innerText = topScoresHtml;
});

// Declare the score. We are going to save high scores in the localsesion storage for that extra razzle dazzle boi.
let score = 0;

//Food Pos, randomized later
let foodX, foodY;
// Head grid pos
let snakeX = 5,
  snakeY = 10;
// Body queue
let snakeBody = []; // <<<<< this is the empty array that will be pushed into for the snakebody

let velocityX = 0,
  velocityY = 0;

// Max value is 30 because thats our grid size. 30 x 30. each time function is run, food is placed somewhere randomly on the 30x30, X/Y axis.
const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

// Bunch of keybinding so we can control our snake head.
const changeDirection = (e) => {
  //console.log(e);
  if (e.key === "ArrowUp") {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown") {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft") {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight") {
    velocityX = 1;
    velocityY = 0;
  }
};

// main game function
const initGame = () => {
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX} "></div>`;

  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]); // <-- Here is the magic where we will use the built in push function into the array that makes up the snakes body. These 2 values on the grid X,Y will be the pushed values into the array that makes up snakebody. Console log below will allow me to see the updated array if the above if statement was true, and the push was made.
    console.log(snakeBody);

    // add 10 points for every time this event happens
    score += 1;
    scoreboard.innerText = `Score: ${score}`;
  }

  // here in the loop below, we can shift the values forward by one in the array, to keep his body moving correctly
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY]; // declare the first part of the snake body to current position.

  // updating head position based on the keybinds in ChangeDirection function above.
  snakeX += velocityX;
  snakeY += velocityY;

  // This condition says if the snake head meets any of the grid postions below which are NOT in the 30x30 grid we made,  the function inside is run which is just pushing the score into the array that is in Localestorage followed by a basic reload, resetting the game.
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    // here we can save the top 5 scores into the localsession storage, and display them back later
    let topScores = JSON.parse(localStorage.getItem("topScores")) || [];
    topScores.push(score); // we save the score
    topScores.sort((a, b) => b - a); // Sort the score
    topScores = topScores.slice(0, 5); // Keep only the top 5 scores,
    //Now we can access them in the dev tools, read them back, display them back.
    scoreBoardLocale.innerText = `Score: ${topScores}`;

    // then reset the game bc you dead.
    location.reload();
  }

  // here is where we update the snakes body to render on the page and update his length after the push into the array above was made
  for (let i = 0; i < snakeBody.length; i++) {
    // we add a new div for each new body part as new grid values pushed into the array, new push, new div. this is snakebody :)
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]} "></div>`;

    // here is the if statement that if the values of the snake body match, the snake has collided with its own body as these values are already in the array (snakebody). we run the same function as wall, reload the page.
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      // here we can save the top 5 scores into the localsession storage, and display them back later
      let topScores = JSON.parse(localStorage.getItem("topScores")) || [];
      topScores.push(score); // we save the score
      topScores.sort((a, b) => b - a); // Sort the score
      topScores = topScores.slice(0, 5); // Keep only the top 5 scores
      //Now we can access them in the dev tools, read them back, display them back.
      localStorage.setItem("topScores", JSON.stringify(topScores));
      // then reset the game bc you dead.
      location.reload();
    }
  }

  playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();

// Speed settings. Interval must be set otherwise snake doesnt move automatically. Lower is faster
//initGame()
setInterval(initGame, 150);
//

document.addEventListener("keydown", changeDirection);
