/* jshint -W079 */
/* ^ tells jshint to ignore 'Redifinition of RO variable' error when checking code or line 240 throws a (nonfatal) error */

/* set up of game canvas' along with the expected game style (2D), and resize the canvas to fit the screen
   game: game state holder
   snake: snake character to be moved by user
   food: objects to be collected by snake character */
var canvas = document.getElementById("the-game");
var context = canvas.getContext("2d");
context.canvas.height = Math.floor(window.innerHeight / 15) * 15;
context.canvas.width = Math.floor(context.canvas.height * (4 / 3));
var game, snake, food;

/* game properties */
game = {
  
  /* set up of starting game state
     variables are initialized to represent a new game */
  score: 0,
  fps: 8,
  over: false,
  message: null, 
  
  
  /* variables are adjusted to represent the beginnning of a new game */
  start: function() { /* starting a new game */
    game.over = false;  /* game state has been changed to in progress */
    game.message = null; /* no message displayed to user */
    game.score = 0;       
    game.fps = 8;
    snake.init(); 
    food.set(); 
  },
  

  /* variables are adjusted to represent the end of a game */
  stop: function() {    /* stopping a game */
    game.over = true;   /* game state has been changed to over */
    game.message = 'GAME OVER - PRESS SPACEBAR'; /* message displayed to user notifying game has ended */
  },
  
  /* x: initial game board center represented by an x-coordinate
     y: initial game board center represented by a y-coordinate
     size: maximum size of the board in the x or y direction, used for both coordinates to create a square
     color: fill color of the game board */
  drawBox: function(x, y, size, color) {
    context.fillStyle = color;
    context.beginPath(); 
    context.moveTo(x - (size / 2), y - (size / 2)); /* begins fill path at bottom left from centre point */
    context.lineTo(x + (size / 2), y - (size / 2)); /* line from bottom left to bottom right */
    context.lineTo(x + (size / 2), y + (size / 2)); /* line from bottom right to top right */
    context.lineTo(x - (size / 2), y + (size / 2)); /* line from top right to top left */
    context.closePath(); /* paths created are closed off */
    context.fill(); /* area created by these lines are now filled with a solid color */
  },
  
  /* creates textfield for the scoreboard 
     fill color of scoreboard and font of scoreboard are chosen
     scoreboard text is aligned
     scoreboard textfield filled with score and textfield dimensions are set */
  drawScore: function() {
    context.fillStyle = '#999'; 
    context.font = (canvas.height) + 'px Impact, sans-serif'; 
    context.textAlign = 'center'; 
    context.fillText(game.score, canvas.width / 2, canvas.height * 0.9);
  },
  
  /* creates textfield for the display messages
     fill color of display message and font of display message are chosen
     display message text is aligned
     display message textfield filled with messages and textfield dimensions are set */
  drawMessage: function() {
    if (game.message !== null) {
      context.fillStyle = '#00F';
      context.strokeStyle = '#FFF';
      context.font = (canvas.height / 10) + 'px Impact';
      context.textAlign = 'center';
      context.fillText(game.message, canvas.width / 2, canvas.height / 2);
      context.strokeText(game.message, canvas.width / 2, canvas.height / 2);
    }
  },
  
  /* resets the gameboard */
  resetCanvas: function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  
};

/* snake properties */
snake = {
  
  /* variables are initialized to represent a new snake */
  size: canvas.width / 40,
  x: null,
  y: null,
  color: '#0F0',
  direction: 'left',
  sections: [],
  
  /* creates a new snake */
  init: function() {
    snake.sections = [];  /* array holds segements of the snake */
    snake.direction = 'left'; /* starting direction initialized to left */
    snake.x = canvas.width / 2 + snake.size / 2; /* starting xcoordinate for the snake */
    snake.y = canvas.height / 2 + snake.size / 2; /* starting ycoordinate for the snake */
    for (var i = snake.x + (5 * snake.size); i >= snake.x; i -= snake.size) { /* array tracks segements of snake via turn points */
      snake.sections.push(i + ',' + snake.y); 
    }
  },
  
  /* snake movement */
  move: function() {
    switch (snake.direction) {
      case 'up': /* when the up arrow key is pressed */
        snake.y -= snake.size; /* moves snake in upward direction based on current size */
        break;
      case 'down': /* when the down arrow key is pressed */
        snake.y += snake.size; /* moves snake in downward direction based on current size */
        break;
      case 'left': /* when the left arrow key is pressed */
        snake.x -= snake.size; /* moves snake in leftward direction based on current size */
        break;
      case 'right': /* when the right arrow key is pressed */
        snake.x += snake.size; /* moves snake in rightward direction based on current size */
        break;
    }
    snake.checkCollision(); /* collision detection */
    snake.checkGrowth(); /* growth detection */
    snake.sections.push(snake.x + ',' + snake.y); /* array tracks segements of snake via turn points */
  },
  
  /* draws all segments of the snake */
  draw: function() {
    for (var i = 0; i < snake.sections.length; i++) {
      snake.drawSection(snake.sections[i].split(',')); /* concatenation of snake sections are drawn around current turn points */
    }    
  },
  
  /* section: an individual section of the snake */
  drawSection: function(section) {
    game.drawBox(parseInt(section[0]), parseInt(section[1]), snake.size, snake.color); /* snake sections are drawn individially inside the box */
  },
  
  /* collision detection */
  checkCollision: function() {
    if (snake.isCollision(snake.x, snake.y) === true) { /* if the head of the snake collides with something */
      game.stop();  /* game state is changed to over */
    }
  },
  
  /* x: xcoordinate for collision detection
     y: ycoordinate for collision detection */
  isCollision: function(x, y) {
    if (x < snake.size / 2 || /* if snake collides with itself horizontally */
        x > canvas.width ||   /* if snake collides with canvas horizontally */
        y < snake.size / 2 || /* if snake collides with itself vertically */
        y > canvas.height ||  /* if snake collides with canvas vertically */
        snake.sections.indexOf(x + ',' + y) >= 0) {
      return true; /* a collision has happened */
    }
  },
  
  /* food collection, sees if the snake has collided with food */
  checkGrowth: function() {
    if (snake.x == food.x && snake.y == food.y) { /* if the snake head collides with a food */
      game.score++; /* add to score */
      if (game.score % 5 === 0 && game.fps < 60) { 
        game.fps++; /* increase the fps when game score increases by 5 points */
      }
      food.set(); /* set another food on the game board */
    } else {
      snake.sections.shift();
    }
  }
  
};

/* food properties */
food = {
  
  /* variables are initialized to represent a new food piece */
  size: null,
  x: null,
  y: null,
  color: '#0FF',
  
  /* food pieces set on the game board */
  set: function() {
    food.size = snake.size;
    food.x = (Math.ceil(Math.random() * 10) * snake.size * 4) - snake.size / 2; /* random x-coordinate chosen for the food piece within game board dimensions */
    food.y = (Math.ceil(Math.random() * 10) * snake.size * 3) - snake.size / 2; /* random y-coordinate chosen for the food piece within game board dimensions */
   },
  
  /* draws food piece on gameboard based on x-coord, y-coord, size, and color */
   draw: function() {
     while (snake.sections.indexOf(food.x + ',' + food.y) >= 0) {
       food.set();
     }
      game.drawBox(food.x, food.y, food.size, food.color);
   }
};

/* sets values to change directional key commands */
var inverseDirection = {
  'up': 'down', /* up key press maps to downwards movement */
  'left': 'right',  /* left key press maps to rightwards movement */
  'right': 'left', /* right key press maps to leftwards movement */
  'down': 'up'  /* down key press maps to upwards movement */
};

/* sets values for directional key commands */
var keys = {
  up: [38, 75, 87],
  down: [40, 74, 83],
  left: [37, 65, 72],
  right: [39, 68, 76],
  start_game: [13, 32]
};

/* value: integer associated with direction key
   gets the value of directional key being pressed */
function getKey(value){
  for (var key in keys){
    if (keys[key] instanceof Array && keys[key].indexOf(value) >= 0){
      return key;
    }
  }
  return null;
}

/* function(e) checks for an event (a key press) to happen */
addEventListener("keydown", function (e) {
    var lastKey = getKey(e.keyCode); /* gets value of directional key */
    if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0  && lastKey != inverseDirection[snake.direction]) {/* if a key is pressed and key direction is not inversed */
      snake.direction = lastKey; /* changes snake direction to inverse of last key pressed */
    } else if (['start_game'].indexOf(lastKey) >= 0 && game.over) { /* waits for a key to be pressed after a game has ended */
      game.start(); /* game state changed to begin */
    }
}, false);

/* updates frames (visual display of the game) */
var requestAnimationFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame;

/* loops through the game if game state isnt equal to over */
function loop() {
  if (game.over === false) {
    context.canvas.height = Math.floor(window.innerHeight / 15) * 15;
	 context.canvas.width = Math.floor(context.canvas.height * (4 / 3));
    game.resetCanvas();
    game.drawScore();
    snake.move();
    food.draw();
    snake.draw();
    game.drawMessage();
  }
  setTimeout(function() {
    requestAnimationFrame(loop);
  }, 1000 / game.fps);
}

requestAnimationFrame(loop);
