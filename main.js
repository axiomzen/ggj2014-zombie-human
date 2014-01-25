SCREEN_W = 800
SCREEN_H = 500

WORLD_W = SCREEN_W
WORLD_H = SCREEN_H * 10

var game = new Phaser.Game(SCREEN_W, SCREEN_H, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render : render });

function preload() {

    game.stage.backgroundColor = '#007236';

    game.load.image('mushroom', 'phaser-master/examples/assets/sprites/mushroom2.png');
    game.load.image('wabbit',    'phaser-master/examples/assets/sprites/wabbit.png');
}

var cursors;
var hero

function create() {

    //  Modify the world and camera bounds
    game.world.setBounds(0,0, WORLD_W,WORLD_H );

    for (var i = 0; i < 200; i++)
    {
        game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');
    }

    cursors = game.input.keyboard.createCursorKeys();

    hero = game.add.sprite( WORLD_W/2, WORLD_H -100, 'wabbit' )
    hero.body.collideWorldBounds = true
    // hero.x =- hero.body.width
    hero.x -= hero.body.halfWidth


    game.camera.follow(hero);
}

function update() {

    hero.body.velocity.x *= 0.1;
    hero.body.velocity.y *= 0.1;

    if (cursors.up.isDown){
        hero.body.velocity.y = -200
    }
    else if (cursors.down.isDown){
        hero.body.velocity.y = 200
    }

    if (cursors.left.isDown) {
        hero.body.velocity.x = -300;
    }
    else if (cursors.right.isDown){
        hero.body.velocity.x = 300;
    }

}

function render() {

    game.debug.renderCameraInfo(game.camera, 32, 32);
    game.debug.renderSpriteInfo(hero, 320, 32);
    game.debug.renderSpriteBody(hero)

}