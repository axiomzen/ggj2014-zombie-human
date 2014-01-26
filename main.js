

var game = new Phaser.Game(SCREEN_W, SCREEN_H, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render : render });

function preload() {

    game.stage.backgroundColor = '#007236';

    game.load.image('mushroom', 'phaser-master/examples/assets/sprites/mushroom2.png');
    game.load.image('wabbit',   'phaser-master/examples/assets/sprites/wabbit.png');
    game.load.image('sparkle',   'phaser-master/examples/assets/sprites/particle1.png');
}

var cursors;
var hero
var medEffectParticles

function create() {

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
}

function update() {

  hero.update()
  game.physics.collide( hero.sprite, Medicine.group, heroPickMed )
}

function heroPickMed (heroSprite, med) {
  med.kill()
  hero.pickMed(med)

  medEffectParticles.x = heroSprite.x;
  medEffectParticles.y = heroSprite.y-hero.sprite.body.height;
  //                      (explode, lifespan, frequency, quantity)
  medEffectParticles.start(true, 1.3*1000, null, 14);
}

function render() {

  game.debug.renderCameraInfo(game.camera, 32, 32);
  game.debug.renderSpriteInfo(hero.sprite, 320, 32);
  game.debug.renderSpriteBody(hero.sprite)

}