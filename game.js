var canvas = document.getElementById("the-game");
var context = canvas.getContext("2d");

game = {
  
  score: 0,

  over: false,
  
  start: function() {
    game.over = false;
    snake.init();
    food.set();
  },
  
  stop: function() {
    game.over = true;
    context.fillStyle = '#FFF';
    context.font = (canvas.height / 15) + 'px sans-serif';
    context.textAlign = 'center';
    context.fillText('GAME OVER', canvas.width/2, canvas.height/2);
  },
  
  resetCanvas: function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  
}

snake = {
  
  size: 8,
  x: null,
  y: null,
  color: '#0FF',
  direction: 'left',
  
  sections: [],
  
  init: function() {
    this.sections = [];
    this.x = canvas.width / 2 + snake.size / 2;
    this.y = canvas.height /2 + snake.size / 2;
    for (i = this.x + (5 * snake.size); i >= this.x; i-=snake.size) {
      this.sections.push(i + ',' + this.y); 
    }
  },
  
  move: function() {
    switch(this.direction) {
      case 'up':
        this.y-=snake.size;
        break;
      case 'down':
        this.y+=snake.size;
        break;
      case 'left':
        this.x-=snake.size;
        break;
      case 'right':
        this.x+=snake.size;
        break;
    }
    this.checkCollision();
    this.checkGrowth();
    this.sections.push(this.x + ',' + this.y);
  },
  
  draw: function() {
    for (i = 0; i < this.sections.length; i++) {
      this.drawSection(this.sections[i].split(','));
    }
  },
  
  drawSection: function(section) {
    section_x = parseInt(section[0]);
    section_y = parseInt(section[1]);
    context.fillStyle = snake.color;
    context.beginPath();
    context.moveTo(section_x - (snake.size / 2), section_y - (snake.size / 2));
    context.lineTo(section_x + (snake.size / 2), section_y - (snake.size / 2));
    context.lineTo(section_x + (snake.size / 2), section_y + (snake.size / 2));
    context.lineTo(section_x - (snake.size / 2), section_y + (snake.size / 2));
    context.closePath();
    context.fill();
  },
  
  checkCollision: function() {
    if (this.isCollision(this.x, this.y) === true) {
      game.stop();
    }
  },
  
  isCollision: function(x, y) {
    if (x < snake.size/2 ||
        x > canvas.width ||
        y < snake.size/2 ||
        y > canvas.height ||
        this.sections.indexOf(x+','+y) >= 0) {
      return true;
    }
  },
  
  checkGrowth: function() {
    if (snake.x == food.x && snake.y == food.y) {
      game.score++;
      food.set();
    } else {
      this.sections.shift();
    }
  }
  
}

food = {
  
  x: null,
  y: null,
  color: '#0F0',
  liftime: null,
  
  set: function() {
    ax = (Math.ceil(Math.random() * 10) * snake.size * 3) - snake.size / 2;
    ay = (Math.ceil(Math.random() * 10) * snake.size * 2) - snake.size / 2;
    food.x = ax;
    food.y = ay;
  },
  
  draw: function() {
    context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(food.x - (snake.size / 2), food.y - (snake.size / 2));
    context.lineTo(food.x + (snake.size / 2), food.y - (snake.size / 2));
    context.lineTo(food.x + (snake.size / 2), food.y + (snake.size / 2));
    context.lineTo(food.x - (snake.size / 2), food.y + (snake.size / 2));
    context.closePath();
    context.fill();
  }
  
}

inverseDirection = {
  'up':'down',
  'left':'right',
  'right':'left',
  'down':'up'
};

keys = {
  up: [38, 75, 87],
  down: [40, 74, 83],
  left: [37, 65, 72],
  right: [39, 68, 76],
  start_game: [13, 32]
};

Object.prototype.getKey = function(value){
  for(var key in this){
    if(this[key] instanceof Array && this[key].indexOf(value) >= 0){
      return key;
    }
  }
  return null;
};

addEventListener("keydown", function (e) {
    lastKey = keys.getKey(e.keyCode);
    if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0  && lastKey != inverseDirection[snake.direction]) {
      snake.direction = lastKey;
    } else if (['start_game'].indexOf(lastKey) >= 0  && game.over) {
      game.start();
    }
}, false);

loop = function() {
  if (game.over == false) {
    game.resetCanvas();
    snake.move();
    food.draw();
    snake.draw();    
  }
};

main = function(){
  game.start();
  setInterval(loop, 100);
}();