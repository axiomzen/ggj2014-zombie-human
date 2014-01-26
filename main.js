

var game = new Phaser.Game(SCREEN_W, SCREEN_H, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render : render });

function preload() {

    game.stage.backgroundColor = '#007236';

    game.load.image('mushroom', 'phaser-master/examples/assets/sprites/mushroom2.png');
    // game.load.image('wabbit',   'phaser-master/examples/assets/sprites/wabbit.png');
    game.load.image('sparkle',   'phaser-master/examples/assets/sprites/particle1.png');

    game.load.spritesheet('linkBack', 'images/zombie1_back.png', 32, 32, 3);
    game.load.spritesheet('linkFront',   'images/zombie1_front.png', 32, 32, 3);
    game.load.spritesheet('linkLeft', 'images/zombie1_left.png', 32, 32, 3);
    game.load.spritesheet('linkRight', 'images/zombie1_right.png', 32, 32, 3);

    game.load.image('ground', 'images/earth.png') // light_grass, dark_grass
    game.load.image('titleBg', 'images/starfield.png')
}

var cursors;
var hero
var medEffectParticles
var titleLayer

function create() {
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
  titleLayer = game.add.group()
  titleLayer.z = 10

  var bg = new Phaser.Sprite(game, 0,0, 'titleBg')
  bg.fixedToCamera = true
  bg.scale.x = 2
  titleLayer.add( bg )

  var text = "Humanize Me!";
  var style = { font: "bold 40pt Arial", fill: "#ffffff", align: "center", stroke: "#258acc", strokeThickness: 8 };
  h1 = new Phaser.Text(game, game.world.centerX, game.camera.y, text, style);
  h1.anchor.setTo(0.5, 0.5);
  // console.log(h1.x,h1.y)
  h1.y = game.camera.y + game.camera.height/2
  titleLayer.add(h1)

  walker = game.add.sprite( SCREEN_W/2, WORLD_H - SCREEN_H/2, 'linkRight', 1)
  walker.scale.x = 5
  walker.scale.y = 5
  walker.anchor.setTo(0.5, 0.5);
  walker.animations.add('walk', [1,0,2])
  walker.play('walk', 12, true);
  titleLayer.add( walker )

  startBtn = new Phaser.Button(game, SCREEN_W/2, WORLD_H - SCREEN_H/2 + 200, 'btn', startGame, this, 2, 1, 0);
  startBtn.anchor.setTo(0.5, 0.5);
  titleLayer.add( startBtn )

  // because it dont work: h1.fixedToCamera = true
  setTimeout(function() {
    h1.y = game.camera.y - 100
    game.add.tween(h1).to( { y: h1.y+game.camera.height/2 }, 1000, Phaser.Easing.Linear.None, true);
  }, 1000)
}

function winGame () {
  game.playing = false

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
  titleLayer.visible = false
  game.playing = true
}

function update() {


  hero.update()
  game.physics.collide( hero.sprite, Medicine.group, heroPickMed )

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

  hero.render()

  game.debug.renderCameraInfo(game.camera, 32, 32);
  game.debug.renderSpriteInfo(hero.sprite, 320, 32);
  // game.debug.renderSpriteBody(hero.sprite)
  game.debug.renderText( "health "+Math.round( hero.sprite.health) , 700,32 )
  // game.debug.renderSpriteBody(hero.sprite)
}