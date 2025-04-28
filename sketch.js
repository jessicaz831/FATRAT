/*
FAT RAT GAME
by Jessica Zhu and Thao Nguyen (Group 88)

Illustrations by Thao Nguyen

References:
Font: 
https://www.dafont.com/right-chalk.font

Sounds:
https://freesound.org/s/61259/
https://freesound.org/s/278151/
https://freesound.org/s/606981/
https://freesound.org/s/608645/
https://freesound.org/s/468442/

*/

let player; 
let ratAni;
let playerPoints;
let lastCheckpoint;

let cheeseImg;
let moldyCheeseImg;
let goldenCheeseImg;
let ratTrapImg;
let catAni;
let cheeses; 
let cheeseTypes = [
  {color: 'orange', points: 1, type: "cheese"},
  {color: 'orange', points: 1, type: "cheese"},
  {color: 'orange', points: 1, type: "cheese"},
  {color: 'orange', points: 1, type: "cheese"},
  {color: 'orange', points: 1, type: "cheese"},
  {color: 'orange', points: 1, type: "cheese"},
  {color: 'orange', points: 1, type: "cheese"},
  {color: 'orange', points: 1, type: "cheese"},
  {color: 'green', points: -2, type: "moldyCheese"},
  {color: 'green', points: -2, type: "moldyCheese"},
  {color: 'yellow', points: 5, type: "goldenCheese"},
  {color: 'brown', points: 0, type: "trap"},
  {color: 'black', points: 0, type: "cat"},
];

let gameState;

let minSpawnTime;
let maxSpawnTime;
let spawnTimer;

let newCheeseCounter;
let playerSpeed;
let cheeseSpeed;

let floorImg, kitchenImg, shadowImg;
let floorScrollY;

let startImg;
let gameOverImg;

let scoreFont;

let crunchSound;
let meowSound;
let chokeSound;
let trapSound;
let squeakSound;
let slideSound;

function preload() {
  
  ratAni = loadAnimation(imageSequence("assets/rat-", 7));
  cheeseImg = loadImage("assets/cheese.png");
  moldyCheeseImg = loadImage("assets/moldyCheese.png");
  goldenCheeseImg = loadImage("assets/goldenCheese.png");
  ratTrapImg = loadImage("assets/ratTrap.png");
  catAni = loadAnimation(imageSequence("assets/cat-", 2));
  floorImg = loadImage("assets/floor.png");
  kitchenImg = loadImage("assets/kitchen.png");
  shadowImg = loadImage("assets/shadow.png");
  startImg = loadImage("assets/startPage.png");
  gameOverImg = loadImage("assets/endPage.png");
  
  crunchSound = loadSound("assets/audio/crunch.wav");
  meowSound = loadSound("assets/audio/meow.wav");
  chokeSound = loadSound("assets/audio/choke.mp3");
  trapSound = loadSound("assets/audio/trap.wav");
  squeakSound = loadSound("assets/audio/squeak.wav");
  slideSound = loadSound("assets/audio/slide.wav");
  
  scoreFont = loadFont("assets/Right Chalk.ttf");
}

function setup() {
  new Canvas(600, 600);
  
  player = new Sprite();  
  player.rotationLock = true;
  player.visible = false;
  player.ani = ratAni;
  player.scale = 0.4;
  player.collider = "circle";
  player.diameter = 60;
  
  cheeses = new Group();
  cheeses.rotationLock = true;
  cheeses.overlaps(cheeses);
  
  gameState = "intro";
  player.x = width/2;
  player.y = height/2;
  playerPoints = 0;
  lastCheckpoint = 5;
    
  minSpawnTime = 120;
  maxSpawnTime = 240;
  newCheeseCounter = 0;
  playerSpeed = 2;
  cheeseSpeed = 1;
  
  spawnTimer = random(minSpawnTime, maxSpawnTime);
  
  floorScrollY = 0;
}

function draw() {  
  if (gameState == "intro") intro();
  if (gameState == "runGame") runGame();  
  if (gameState == "gameOver") gameOver(); 
}

function intro() {
  image(startImg, 0, 0);
  
  if (mouse.presses()) {
    squeakSound.play();
    player.visible = true;
    gameState = "runGame";  
  }
}

function runGame() {
  drawFloor();
  image(shadowImg, 0, 5);
  image(kitchenImg, 0, 0);
  mouse.visible = false;
  
   // movement
  if (kb.pressing('left')) {
    player.x -= playerSpeed;
  }
  if (kb.pressing('right')) {
    player.x += playerSpeed;
  }
  if (kb.pressing('up')) {
    player.y -= playerSpeed;
  }
  if (kb.pressing('down')) {
    player.y += playerSpeed;
  }
  
  // bounds
  if (player.x > width - player.diameter/2) {
    player.x = width - player.diameter/2;
  }
  if (player.x < 0 + player.diameter/2) {
    player.x = player.diameter/2;
  }
  if (player.y > height - player.diameter/2) {
    player.y = height - player.diameter/2;
  }
  if (player.y < height/3 - player.diameter/2) {
    player.y = height/3 - player.diameter/2;
  }
  
  // spawn cheese
  newCheeseCounter++; 
  if (newCheeseCounter > spawnTimer) {
    newCheeseCounter = 0;
    spawnTimer = random(minSpawnTime, maxSpawnTime);
    let cheeseType = random(cheeseTypes);
    let newCheese = new cheeses.Sprite();
    newCheese.x = random(newCheese.width/2, width - newCheese.width/2);
    newCheese.y = height;
    newCheese.color = cheeseType.color;
    newCheese.points = cheeseType.points;
    newCheese.type = cheeseType.type;
    if (cheeseType.type == "cheese") {
      newCheese.img = cheeseImg;
      newCheese.scale = 0.25;  
    }
    else if (cheeseType.type == "moldyCheese") {
      newCheese.img = moldyCheeseImg;
      newCheese.scale = 0.25;  
    }
    else if (cheeseType.type == "goldenCheese") {
      newCheese.img = goldenCheeseImg;
      newCheese.scale = 0.25;  
    }
    else if (cheeseType.type == "trap") {
      newCheese.img = ratTrapImg;
      newCheese.scale = 0.25;  
    }
    else if (cheeseType.type == "cat") {
      newCheese.ani = catAni;
      newCheese.scale = 0.4; 
      newCheese.vel.x = 4;
    }
    newCheese.w = 70;
    newCheese.h = 50;
  }
  
  // remove cheese when passed bound or collected
  for (let c of cheeses) {

    // move cat
    if (c.type == "cat") {
      c.y -= 1;
      if (c.x < 0 + c.width/2) {
        c.vel.x = -c.vel.x;
        c.scale.x = -c.scale.x;
      }
      else if (c.x > width - c.width/2) {
        c.vel.x = -c.vel.x;
        c.scale.x = -c.scale.x;
      }
      c.x += c.vel.x;
    }
    else {
      c.y -= cheeseSpeed;
    }
    if (c.y < height/3 - 10) {
      c.remove();
    }
    
    // cheese collision
    if (c.overlaps(player)) {
      
      if (c.type == "cheese" || c.type == "goldenCheese") {
        crunchSound.play();
      } else if (c.type == "moldyCheese") {
        chokeSound.play();
      } else if (c.type == "cat") {
        meowSound.play();
      } else if (c.type == "trap") {
        trapSound.play();
      }
      
      if (c.type == "trap" || c.type == "cat") {
        gameState = "gameOver";
      }
      c.remove();
      playerPoints += c.points;
      if (playerPoints <= 0) {
        playerPoints = 0;
        gameState = "gameOver";
      }
    }
  }
  
  // speed up
  if (playerPoints >= lastCheckpoint) {
    cheeseSpeed++;
    playerSpeed++;
    lastCheckpoint += 5;
    
    if (minSpawnTime > 40) {
        minSpawnTime -= 40
    }
    if (maxSpawnTime > 80) {
      maxSpawnTime -= 40
    }
  }  
  
  drawScore();
}

function gameOver() {
  mouse.visible = true;
  allSprites.removeAll();
  
  image(gameOverImg, 0, 0);
  
  fill('white');
  textSize(60);
  textFont(scoreFont);
  text(playerPoints, width/2 - 30, height - 125);

  
  if (mouse.presses()) {
    player = new Sprite(); 
    player.collider = "circle";
    player.diameter = 50;
    player.rotationLock = true;
    player.ani = ratAni;
    player.scale = 0.4;
    player.collider = "circle";
    player.diameter = 70;

    player.x = width/2;
    player.y = height/2;
    player.scale = 0.4;
    playerPoints = 0;
    lastCheckpoint = 5;

    minSpawnTime = 120;
    maxSpawnTime = 240;
    newCheeseCounter = 0;
    playerSpeed = 2;
    cheeseSpeed = 1;

    spawnTimer = random(minSpawnTime, maxSpawnTime);
    gameState = "runGame";
  }
}

function imageSequence(prefix, numberOfFrames, ext=".png") {
  let sequence = []; 
  for (let i=0; i < numberOfFrames; i++) {
    sequence[i] = prefix + i + ext;  
  }
  return sequence;  
}

function drawScore() {  
  noStroke();
  fill('white');
  textSize(20);
  textFont(scoreFont);
  textAlign(LEFT);
  text("SCORE: " + playerPoints, 20, 30);
}

function drawFloor() {
  floorScrollY -= cheeseSpeed;

  image(floorImg, 0, floorScrollY);
  image(floorImg, 0, floorScrollY + floorImg.height);
  
  if (floorScrollY < -floorImg.height) {
    floorScrollY = 0;
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    slideSound.play();
    slideSound.setVolume(0.5);
  }
}


