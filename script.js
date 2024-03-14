const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const gameContainer = document.getElementById("gameContainer");
const jumpCounterDisplay = document.getElementById("jumpCounter");

let playerJumping = false;
let jumpCounted = false; // Flag to check if jump is already counted
let obstacleInterval;
let gameSpeed = 10;
let obstacleDirection = 1; // 1 for right, -1 for left
let gameOver = false;
let successfulJumps = 0;

// PLAYER JUMPING LOGIC
function jump() {
  if (!playerJumping && !gameOver) {
    playerJumping = true;
    let currentHeight = 0;
    let staticJumpHeight = 200; // The static height the player will jump to
    let jumpSpeed = 20; // How much the player's height changes per frame

    let jumpInterval = setInterval(function () {
      if (currentHeight < staticJumpHeight) {
        // Ascending
        currentHeight += jumpSpeed;
        player.style.bottom = currentHeight + "px";
      } else {
        // Descending
        clearInterval(jumpInterval); // Stop the ascent
        let fallInterval = setInterval(function () {
          if (currentHeight > 0) {
            currentHeight -= jumpSpeed;
            player.style.bottom = currentHeight + "px";
          } else {
            playerJumping = false;
            clearInterval(fallInterval); // Stop the descent once player reaches ground
          }
        }, 1); // Match this delay with the ascent for a symmetric jump
      }
    }, 1); // Delay between each frame, adjust for smoother or faster animation
  }
}

// JUMP COUNTER LOGIC
function updateJumpCounter() {
  jumpCounterDisplay.innerText = "Successful Jumps: " + successfulJumps;
}

// ENEMY MOVEMTNT AND COLLISON DETECTION
function startObstacle() {
  obstacleInterval = setInterval(function () {
    let obstacleLeft = parseInt(
      window.getComputedStyle(obstacle).getPropertyValue("left")
    );
    let playerLeft = parseInt(
      window.getComputedStyle(player).getPropertyValue("left")
    );
    let playerBottom = parseInt(
      window.getComputedStyle(player).getPropertyValue("bottom")
    );

    if ((obstacleLeft > 600 - 50 || obstacleLeft < 0) && !gameOver) {
      obstacleDirection *= -1;
      gameSpeed += 1;
      jumpCounted = false; // Reset the jump counted flag
    }

    obstacle.style.left = obstacleLeft + gameSpeed * obstacleDirection + "px";

    // Check if the player successfully jumped over the obstacle
    if (
      playerJumping &&
      obstacleLeft < playerLeft &&
      obstacleLeft + 50 > playerLeft &&
      !jumpCounted
    ) {
      successfulJumps++;
      updateJumpCounter();
      jumpCounted = true; // Set the flag to avoid multiple counts
    }

    if (
      obstacleLeft < playerLeft + 50 &&
      obstacleLeft > playerLeft - 30 &&
      playerBottom < 30 &&
      !gameOver
    ) {
      gameOver = true;
      clearInterval(obstacleInterval);
      clearInterval(moveInterval); // Stop any ongoing movement
      moveLeft = false; // Reset movement flags
      moveRight = false;
      // Display the game over message
      document.getElementById("gameOverMessage").style.display = "block";
    }
  }, 20);
}

// PLAYER MOVEMENT SECTION
let moveLeft = false;
let moveRight = false;
let moveInterval; // To hold the interval for continuous movement
const moveAmount = 10; // Adjust as needed for speed

function startMoving() {
  if (moveInterval || gameOver) return; // Prevent creating multiple intervals or moving after game over

  moveInterval = setInterval(() => {
    let playerLeft = parseInt(
      window.getComputedStyle(player).getPropertyValue("left")
    );
    let gameContainerWidth = parseInt(
      window.getComputedStyle(gameContainer).getPropertyValue("width")
    );

    if (moveLeft) {
      player.style.left = Math.max(0, playerLeft - moveAmount) + "px";
    }
    if (moveRight) {
      player.style.left =
        Math.min(
          gameContainerWidth - player.offsetWidth,
          playerLeft + moveAmount
        ) + "px";
    }
  }, 10); // Adjust for smoother or faster movement
}

// KEY-DOWN EVENT HANDLERS / Start movement
document.body.addEventListener("keydown", function (event) {
  if (gameOver) {
    if (event.code === "Space") {
      event.preventDefault();
      window.location.reload();
    }
    return; // Exit the function early if the game is over
  }

  switch (event.code) {
    case "ArrowUp":
      event.preventDefault(); // Prevent the default action (scrolling the page)
      jump();
      break;
    case "ArrowLeft":
      moveLeft = true;
      startMoving();
      break;
    case "ArrowRight":
      moveRight = true;
      startMoving();
      break;
  }
});

// KEY-UP EVENT HANDLERS / Stop movement
document.body.addEventListener("keyup", function (event) {
  switch (event.code) {
    case "ArrowLeft":
      moveLeft = false;
      break;
    case "ArrowRight":
      moveRight = false;
      break;
  }

  // Stop moving if no arrow keys are pressed
  if (!moveLeft && !moveRight) {
    clearInterval(moveInterval);
    moveInterval = null; // Clear the interval ID to allow for future movement
  }
});

startObstacle();
