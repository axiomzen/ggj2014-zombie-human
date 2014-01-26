

var game = new Phaser.Game(SCREEN_W, SCREEN_H, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render : render });

function preload() {

    game.stage.backgroundColor = '#007236';

    game.load.image('mushroom', 'phaser-master/examples/assets/sprites/mushroom2.png');
    game.load.image('wabbit',   'phaser-master/examples/assets/sprites/wabbit.png');
}

var cursors;
var hero

function create() {

    //  Modify the world and camera bounds
    game.world.setBounds(0,0, WORLD_W,WORLD_H );

    Medicine.placeAll()

    // for (var i = 0; i < 200; i++)
    // {
    //     game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
    // }

    cursors = game.input.keyboard.createCursorKeys();

    hero = new Hero()

    game.camera.follow(hero.sprite);
}

function update() {

  hero.update()
}

function render() {

  game.debug.renderCameraInfo(game.camera, 32, 32);
  game.debug.renderSpriteInfo(hero.sprite, 320, 32);
  game.debug.renderSpriteBody(hero.sprite)

}