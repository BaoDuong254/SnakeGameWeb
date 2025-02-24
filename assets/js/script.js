const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
let repoName = window.location.pathname.split("/")[1]; // Lấy tên repo từ URL
let basePath;
if (repoName === "index.html") {
	basePath = "/assets/image/";
} else {
	basePath = `/${repoName}/assets/image/`;
}
const boxSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = "right";
let score = 0;
let highScore = 0;
let gameOver = false;
let gamePaused = false;
let gameRunning = false; // Biến để theo dõi trạng thái của trò chơi
let playerName = "Anonymous";

const snakeImage = new Image();
snakeImage.src = `${basePath}snake.png`; // Thay đổi đường dẫn đến hình ảnh của con rắn

const foodImage = new Image();
foodImage.src = `${basePath}apple.png`; // Thay đổi đường dẫn đến hình ảnh của thức ăn

function toggleGame() {
	if (gameRunning) {
		stopGame();
	} else {
		startGame();
	}
}

function startGame() {
	if (gameOver) {
		resetGame();
	}

	playerName = prompt("Enter your name:");
	resetGame();
	const gameInterval = setInterval(() => {
		if (!gamePaused) {
			move();
		}
	}, 150);

	// Lưu interval để có thể dừng sau này
	window.gameInterval = gameInterval;
	gameRunning = true;
	document.querySelector("button").innerText = "Stop Game";
}

function stopGame() {
	gamePaused = !gamePaused;
	const buttonText = gamePaused ? "Continue" : "Stop Game";
	document.querySelector("button").innerText = buttonText;
}

function draw() {
	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw snake
	for (let i = 0; i < snake.length; i++) {
		ctx.drawImage(
			snakeImage,
			snake[i].x * boxSize,
			snake[i].y * boxSize,
			boxSize,
			boxSize
		);
	}

	// Draw food
	ctx.drawImage(
		foodImage,
		food.x * boxSize,
		food.y * boxSize,
		boxSize,
		boxSize
	);

	// Update the score
	document.getElementById("currentScore").innerText = score;
	document.getElementById("highScore").innerText = highScore;
	document.getElementById("playerName").innerText = playerName;

	// Display "Game over" message if game over
	if (gameOver) {
		const playAgain = confirm(
			"Game over! Press OK to play again or Cancel to exit."
		);
		if (playAgain) {
			resetGame();
		} else {
			alert("Goodbye!");
			document.location.reload();
		}
	}
}

function move() {
	if (gameOver) {
		return;
	}

	let head = { x: snake[0].x, y: snake[0].y };

	// Move the snake in the current direction
	switch (direction) {
		case "up":
			head.y--;
			break;
		case "down":
			head.y++;
			break;
		case "left":
			head.x--;
			break;
		case "right":
			head.x++;
			break;
	}

	// Check for collisions with walls or itself
	if (
		head.x < 0 ||
		head.x >= canvas.width / boxSize ||
		head.y < 0 ||
		head.y >= canvas.height / boxSize ||
		checkCollision(head, snake)
	) {
		// Check if the current score is higher than the high score
		if (score > highScore) {
			highScore = score;
		}

		gameOver = true;
		draw();
		return;
	}

	// Check if the snake ate the food
	if (head.x === food.x && head.y === food.y) {
		// Generate new food
		food = generateFood();

		// Increase the score and update the high score if needed
		score++;
		if (score > highScore) {
			highScore = score;
		}

		// Increase the length of the snake
		snake.unshift({});
	}

	// Move the snake
	for (let i = snake.length - 1; i > 0; i--) {
		snake[i] = { ...snake[i - 1] };
	}
	snake[0] = head;

	// Draw the updated game state
	draw();
}

function checkCollision(point, array) {
	return array.some(
		(element) => element.x === point.x && element.y === point.y
	);
}

function generateFood() {
	// Generate random coordinates for food
	return {
		x: Math.floor(Math.random() * (canvas.width / boxSize)),
		y: Math.floor(Math.random() * (canvas.height / boxSize)),
	};
}

function resetGame() {
	snake = [{ x: 10, y: 10 }];
	food = generateFood();
	direction = "right";
	score = 0;
	gameOver = false;
	gamePaused = false;
	draw();
}

function handleKeyPress(event) {
	if (gameOver && event.key === "Enter") {
		startGame();
	} else {
		switch (event.key) {
			case "w":
				direction = "up";
				break;
			case "s":
				direction = "down";
				break;
			case "a":
				direction = "left";
				break;
			case "d":
				direction = "right";
				break;
			case "Enter":
				toggleGame();
				break;
			case "Escape":
				stopGame();
				break;
		}
	}
}

// Set up event listeners
document.addEventListener("keydown", handleKeyPress);
