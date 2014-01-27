
// DEBUG

var game = new Phaser.Game(SCREEN_W, SCREEN_H, (DEBUG ? Phaser.CANVAS : Phaser.AUTO), '', { preload: preload, create: create, update: update, render : render });

function preload() {

    game.stage.backgroundColor = '#007236';

    game.load.image('med', 'images/potion1.png');
    game.load.image('sparkle',   'images/particle1.png');

    game.load.spritesheet('linkBack', 'images/zombie1_back.png', 32, 32, 3);
    game.load.spritesheet('linkFront',   'images/zombie1_front.png', 32, 32, 3);
    game.load.spritesheet('linkLeft', 'images/zombie1_left.png', 32, 32, 3);
    game.load.spritesheet('linkRight', 'images/zombie1_right.png', 32, 32, 3);

    game.load.spritesheet('enemy', 'images/enemy.png', 32, 32, 3);
    //game.load.spritesheet('enemyLeft', 'images/enemy-left.png', 32, 32, 3);

    game.load.image('ground', 'images/earth.png') // light_grass, dark_grass
    game.load.image('titleBg', 'images/starfield.png')
    game.load.image('title1', 'images/title1.png')
    // game.load.image('startDown', 'images/startDown1.png')
    game.load.spritesheet('startBtn', 'images/startBtn.png', 382/2, 68);

    game.load.audio('ztitle', ['audio/music/ZombieTitle.mp3', 'audio/music/ZombieTitle.ogg']);
    game.load.audio('zvictory', ['audio/music/Victory.mp3', 'audio/music/Victory.ogg']);
    game.load.audio('z1', ['audio/music/Z1.mp3', 'audio/music/Z1.ogg']);
    game.load.audio('z2', ['audio/music/Z2.mp3', 'audio/music/Z2.ogg']);
    game.load.audio('z3', ['audio/music/Z3.mp3', 'audio/music/Z3.ogg']);
    game.load.audio('z4', ['audio/music/Z4.mp3', 'audio/music/Z4.ogg']);
    game.load.audio('z5', ['audio/music/Z5.mp3', 'audio/music/Z5.ogg']);
    game.load.audio('z6', ['audio/music/Z6.mp3', 'audio/music/Z6.ogg']);
    game.load.audio('z7', ['audio/music/Z7.mp3', 'audio/music/Z7.ogg']);
    game.load.audio('z8', ['audio/music/Z8.mp3', 'audio/music/Z8.ogg']);

    game.load.audio('medPickup', ['audio/fx/MedkitPickup.mp3','audio/fx/MedkitPickup.ogg'])
}

var cursors;
var hero
var medEffectParticles
var titleLayer
var scene;

function create() {

  game.music = null

  paintGround()

  game.world.setBounds(0,0, WORLD_W,WORLD_H );

  Medicine.placeAll()

  cursors = game.input.keyboard.createCursorKeys();

  hero = new Hero()
  game.camera.follow(hero.sprite);

  medEffectParticles = game.add.emitter(0, 0, 200);
  medEffectParticles.makeParticles('sparkle');
  medEffectParticles.minRotation = 0;
  medEffectParticles.maxRotation = 0;
  medEffectParticles.gravity = 0.0
  medEffectParticles.setXSpeed(-300,300)
  medEffectParticles.setYSpeed(-300,300)

  makeTitleScreen()

}

function makeTitleScreen () {

  game.music = game.add.audio('ztitle', 1, true)
  //(marker, position, volume, loop, forceRestart)
  game.music.play('',0,1,true);

  titleLayer = game.add.group()
  titleLayer.z = 10

  var bg = new Phaser.Sprite(game, 0,0, 'titleBg')
  bg.fixedToCamera = true
  bg.scale.x = 2
  titleLayer.add( bg )

  // var text = "Humanize Me!";
  // var style = { font: "bold 40pt Arial", fill: "#ffffff", align: "center", stroke: "#258acc", strokeThickness: 8 };
  // h1 = new Phaser.Text(game, game.world.centerX, game.camera.y, text, style);
  // h1.anchor.setTo(0.5, 0.5);
  // // console.log(h1.x,h1.y)
  // h1.y = game.camera.y + game.camera.height/2
  // titleLayer.add(h1)

  h1 = game.add.sprite( SCREEN_W/2, WORLD_H - (SCREEN_H*2), 'title1', 1)
  h1.scale.setTo(1.1,1.5)
  h1.anchor.setTo(0.5, 0.5);
  titleLayer.add( h1 )
  // h1.animations.add('walk', [1,0,2])
  // h1.play('walk', 12, true);

  walker = game.add.sprite( SCREEN_W/2, WORLD_H - (SCREEN_H/2)*0.9, 'linkRight', 1)
  walker.scale.x = 5
  walker.scale.y = 5
  walker.anchor.setTo(0.5, 0.5);
  walker.animations.add('walk', [1,0,2])
  walker.play('walk', 12, true);
  titleLayer.add( walker )

  // walker = game.add.sprite( SCREEN_W/2, WORLD_H - (SCREEN_H/2)*0.6, 'linkRight', 1)
  // walker.scale.x = 5
  // walker.scale.y = 5
  // walker.anchor.setTo(0.5, 0.5);
  // walker.animations.add('walk', [1,0,2])
  // walker.play('walk', 12, true);
  // titleLayer.add( walker )


  startBtn = new Phaser.Button(game, SCREEN_W/2, WORLD_H - SCREEN_H/2 + 200, 'startBtn', startGame, this, 1, 0, 1);
  startBtn.anchor.setTo(0.5, 0.5);
  titleLayer.add( startBtn )

  // because it dont work: h1.fixedToCamera = true
  setTimeout(function() {
    h1.y = game.camera.y*0.97
    game.add.tween(h1).to( { y: h1.y+game.camera.height/2 }, 1000, Phaser.Easing.Linear.None, true);
  }, 1000)
}

function winGame () {
  game.playing = false
  game.music.stop()
  hero.medPickupSound.stop()

  game.music = game.add.audio('zvictory')

  game.music.play()

  var text = "You are now seen as Human!\nVICTORY";
  var style = { font: "bold 40pt Arial", fill: "#ffffff", align: "center", stroke: "#258acc", strokeThickness: 8 };
  h1 = new Phaser.Text(game, game.world.centerX, hero.sprite.y, text, style);
  h1.anchor.setTo(0.5, 0.5);
  // console.log(h1.x,h1.y)
  h1.y = game.camera.y + game.camera.height/2
  game.world.add(h1)

  hero.winMode()
}

function startGame () {
  game.music.stop()
  titleLayer.visible = false
  game.playing = true
  game.music = game.add.audio('z1')
  game.music.play('', 10*1000)
  // music.play('',0,1,true);
  scene = new Scene();
  scene.build();
}

function update() {


  hero.update()
  game.physics.collide( hero.sprite, Medicine.group, heroPickMed )

  if (scene) {
    scene.update();  
  }

  // auto-complete the game // game.physics.moveToObject(hero.sprite, Medicine.group.getFirstAlive(), 500)
}

function paintGround () {
  var sprite = game.add.sprite(-100,0, 'ground')

  var blocks_x = WORLD_W/sprite.width
  var blocks_y = WORLD_H/sprite.height
  // console.log(blocks_x,blocks_y)
  for (var i = 0; i < blocks_x; i++) {
    for (var j = 0; j < blocks_y; j++) {
      // console.log('ground', sprite.width*i, sprite.height*j)
      game.add.sprite(sprite.width*i, sprite.height*j, 'ground')
    };
  };
}

function heroPickMed (heroSprite, med) {
  med.kill()
  hero.pickMed(med)

  medEffectParticles.x = heroSprite.x;
  medEffectParticles.y = heroSprite.y-hero.sprite.body.height;
  //                      (explode, lifespan, frequency, quantity)
  medEffectParticles.start(true, 1.3*1000, null, 14);

  if( hero.percentage == 1 ){
    winGame()
  }
}

function render() {

  hero.render();

  if( DEBUG ){
    game.debug.renderCameraInfo(game.camera, 32, 32);
    game.debug.renderSpriteInfo(hero.sprite, 320, 32);
    // game.debug.renderSpriteBody(hero.sprite)
    game.debug.renderText( "health "+Math.round( hero.sprite.health) , 700,32 )
    // game.debug.renderSpriteBody(hero.sprite)
  }
}
