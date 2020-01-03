// Enemies our player must avoid
class Enemy {
  constructor(x, y, speed) {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
  }
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > 505) {
      this.x = -100;
      this.speed = 100 + Math.floor(Math.random() * 505);
    }
  }
  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

let defaultX = 200;
let defaultY = 380;
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/char-boy.png';
  }

  reset() {
    this.x = defaultX;
    this.y = defaultY;
  }

  update() {
    // Prevent the player from moving off screen
    if (this.y > 400) {
      this.y = 380;
    }
    if (this.x > 400) {
      this.x = 400;
    }
    if (this.x < 0) {
      this.x = 0;
    }
    // Reset to starting position if player reaches the top
    if (this.y < 0) {
      gameWin();
    }
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  handleInput(key) {
    switch (key) {
      case 'up':
        this.y -= this.speed + 30;
        break;
      case 'left':
        this.x -= this.speed + 50;
        break;
      case 'down':
        this.y += this.speed + 30;
        break;
      case 'right':
        this.x += this.speed + 50;
        break;
    }
  }
}

let gemSprites = ['gem-blue.png', 'gem-green.png', 'gem-orange.png'];

class Gem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // Random index source: https://stackoverflow.com/a/5915122
    this.spriteIndex = Math.floor(Math.random() * gemSprites.length);
    this.sprite = 'images/' + gemSprites[this.spriteIndex];
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  hide() {
    this.x = -100;
    this.y = -100;
  }
}

// 2D collision detection source: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function checkCollisions() {
	for (let i = 0; i < allEnemies.length; i++) {
		if (player.x < allEnemies[i].x + 60 &&
				player.x + 50 > allEnemies[i].x &&
				player.y < allEnemies[i].y + 25 &&
				player.y + 50 > allEnemies[i].y) {
					gameLose();
			}
  }
  
  // Detect gem collision and update score based on gem color
  // Using the following color-index pairs:
  // Blue = 0, Green = 1, Orange = 2
  for (let i = 0; i < allGems.length; i++) {
    if (player.x < allGems[i].x + 50 &&
      player.x + 50 > allGems[i].x &&
      player.y < allGems[i].y + 50 &&
      player.y + 50 > allGems[i].y) {
        if (allGems[i].spriteIndex === 0) {
          score += 5;
        } else if (allGems[i].spriteIndex === 1) {
          score += 10;
        } else if (allGems[i].spriteIndex === 2) {
          score += 15;
        }
        allGems[i].hide();
        updateScoreBoard();
    }
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var allGems = [];
var player = new Player(defaultX, defaultY, 50);
var enemy;
var gem;

let enemyYArr = [60, 140, 220];
let gemXArr = [0, 100, 200, 300, 400];
let gemYArr = [60, 140, 220, 300, 380];
let score = 0;
let currScore = document.getElementById('score');
updateScoreBoard();

function addEnemy(y) {
  enemy = new Enemy(0, y, 100 + Math.floor(Math.random() * 505));
  allEnemies.push(enemy);
}

enemyYArr.forEach(y => {
  addEnemy(y);
});

function addGems() {
  allGems = [];
  // Create a random number of gems between 1 and 3
  let j = 1 + Math.floor(Math.random() * 3);
  let usedX = []
  let usedY = [];
  for (let i = 0; i < j; i++) {
    // Make sure we don't reuse x and y coordinates for Gem creation
    // Array difference source: https://medium.com/@alvaro.saburido/set-theory-for-arrays-in-es6-eb2f20a61848
    let freeX = gemXArr.filter(x => !usedX.includes(x));
    let freeY = gemYArr.filter(y => !usedX.includes(y));
    let x = freeX[Math.floor(Math.random() * freeX.length)];
    let y = freeY[Math.floor(Math.random() * freeY.length)];

    gem = new Gem(x, y);
    usedX.push(x);
    usedY.push(y);
    allGems.push(gem);
  }
}

addGems();

function gameWin() {
  score += 100;
  updateScoreBoard();
  player.reset();
  addGems();
}

function gameLose() {
  score = 0;
  updateScoreBoard();
  player.reset();
  addGems();
}

function updateScoreBoard() {
  currScore.innerText = score;
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', (e) => {
  const allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
