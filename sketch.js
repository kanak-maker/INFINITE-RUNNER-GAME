var PLAY = 1, END = 0, gameState = PLAY, trex, trex_running, trex_collided, ground, invisibleGround, groundImage, cloudsGroup, cloudImage, obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, score=0, gameOver, restart;
localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  bgSky = loadImage("sky.jpeg");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  canvas = createCanvas(displayWidth-20,displayHeight-30);
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  gameOver = createSprite(displayWidth/2, displayHeight/15);
  gameOver.addImage(gameOverImg);
  restart = createSprite(displayWidth/2, displayHeight/10);;
  restart.addImage(restartImg);
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  gameOver.visible = false;
  restart.visible = false;
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  score = 0;
}

function draw() {
  background(bgSky);
  textSize(20)
  fill("black")
  text("Score: "+ score, 1250, -150);
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    camera.position.x = displayWidth/2;
    camera.position.y = trex.y;
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
    trex.velocityY = trex.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("collided",trex_collided);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
}

function spawnClouds() {
  if (frameCount % 50 === 0) {
    var cloud = createSprite(displayWidth/1, displayHeight/200000);
    cloud.y = Math.round(random(10,100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.7;
    cloud.velocityX = -8;
    cloud.lifetime = 200;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(displayWidth/1, displayHeight/5.5);
    obstacle.velocityX = -(10 + 3*score/100);
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.y = 160;
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.y = 160; 
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.y = 160; 
              break;
      case 4: obstacle.addImage(obstacle4);
              obstacle.y = 150; 
              break;
      case 5: obstacle.addImage(obstacle5);
              obstacle.y = 150; 
              break;
      case 6: obstacle.addImage(obstacle6);
              obstacle.y = 150; 
              break;
      default: break;
    }          
    obstacle.scale = 0.6;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  score = 0;
}