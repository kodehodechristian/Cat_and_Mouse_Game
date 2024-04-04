const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const gameContainer = document.getElementById("gameContainer");
const jumpCounterDisplay = document.getElementById("jumpCounter");

let fps = 60; // Desired frame rate
let now;
let then = Date.now();
let interval = 1000 / fps;
let delta;

let playerJumping = false;
let jumpCounted = false;
let gameSpeed = 5;
let obstacleDirection = 1;
let gameOver = false;
let successfulJumps = 0;

let currentHeight = 0;
let staticJumpHeight = 200;
let jumpSpeed = 20;
let descending = false; // Flag to track descending state

let moveLeft = false;
let moveRight = false;
const moveAmount = 10; // Adjust as needed for speed

function gameLoop() {
  requestAnimationFrame(gameLoop);

  now = Date.now();
  delta = now - then;

  if (delta > interval) {
    then = now - (delta % interval);

    if (!gameOver) {
      jumpLogic();
      obstacleLogic();
      playerMovement();
    }
  }
}

function jumpLogic() {
  if (playerJumping) {
    if (currentHeight < staticJumpHeight && !descending) {
      currentHeight += jumpSpeed;
      player.style.bottom = currentHeight + "px";
    } else {
      descending = true;
      currentHeight -= jumpSpeed;
      player.style.bottom = currentHeight + "px";
      if (currentHeight <= 0) {
        playerJumping = false;
        descending = false; // Reset descending flag
        currentHeight = 0; // Reset currentHeight
      }
    }
  }
}

function jump() {
  if (!playerJumping && !gameOver && !descending) {
    playerJumping = true;
    descending = false;
  }
}

function obstacleLogic() {
  let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
  let playerLeft = parseInt(window.getComputedStyle(player).getPropertyValue("left"));
  let playerBottom = parseInt(window.getComputedStyle(player).getPropertyValue("bottom"));

  if ((obstacleLeft > 600 - 50 || obstacleLeft < 0) && !gameOver) {
    obstacleDirection *= -1;
    gameSpeed += 0.5;
    jumpCounted = false;
  }

  obstacle.style.left = obstacleLeft + gameSpeed * obstacleDirection + "px";

  checkJumpOver(obstacleLeft, playerLeft);
  checkCollision(obstacleLeft, playerLeft, playerBottom);
}

function updateJumpCounter() {
  jumpCounterDisplay.innerText = "Successful Jumps: " + successfulJumps;
}

function checkJumpOver(obstacleLeft, playerLeft) {
  if (playerJumping && obstacleLeft < playerLeft && obstacleLeft + 50 > playerLeft && !jumpCounted) {
    successfulJumps++;
    updateJumpCounter();
    jumpCounted = true;
  }
}

function checkCollision(obstacleLeft, playerLeft, playerBottom) {
  if (obstacleLeft < playerLeft + 50 && obstacleLeft > playerLeft - 30 && playerBottom < 30 && !gameOver) {
    gameOver = true;
    document.getElementById("gameOverMessage").style.display = "block";
  }
}

function playerMovement() {
  let playerLeft = parseInt(window.getComputedStyle(player).getPropertyValue("left"));
  let gameContainerWidth = parseInt(window.getComputedStyle(gameContainer).getPropertyValue("width"));

  if (moveLeft) {
    player.style.left = Math.max(0, playerLeft - moveAmount) + "px";
  }
  if (moveRight) {
    player.style.left = Math.min(gameContainerWidth - player.offsetWidth, playerLeft + moveAmount) + "px";
  }
}

document.body.addEventListener("keydown", function (event) {
  if (gameOver) {
    if (event.code === "Space") {
      event.preventDefault();
      window.location.reload();
    }
    return;
  }

  switch (event.code) {
    case "ArrowUp":
      event.preventDefault();
      jump();
      break;
    case "ArrowLeft":
      moveLeft = true;
      break;
    case "ArrowRight":
      moveRight = true;
      break;
  }
});

document.body.addEventListener("keyup", function (event) {
  switch (event.code) {
    case "ArrowLeft":
      moveLeft = false;
      break;
    case "ArrowRight":
      moveRight = false;
      break;
  }
});

gameLoop();
