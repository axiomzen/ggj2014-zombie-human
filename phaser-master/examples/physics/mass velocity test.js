
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('car', 'assets/sprites/car90.png');
    game.load.image('baddie', 'assets/sprites/space-baddie.png');

}

var car;
var aliens;

function create() {

    aliens = game.add.group();

    for (var i = 0; i < 50; i++)
    {
        var s = aliens.create(game.world.randomX, game.world.randomY, 'baddie');
        s.name = 'alien' + s;
        s.body.collideWorldBounds = true;
        s.body.bounce.setTo(0.8, 0.8);
        s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
    }

    car = game.add.sprite(400, 300, 'car');
    car.anchor.setTo(0.5, 0.5);
    car.body.collideWorldBounds = true;
    car.body.bounce.setTo(0.8, 0.8);
    car.body.allowRotation = true;

}

function update() {

    car.body.velocity.x = 0;
    car.body.velocity.y = 0;
    car.body.angularVelocity = 0;

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        car.body.angularVelocity = -200;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        car.body.angularVelocity = 200;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        car.body.velocity.copyFrom(game.physics.velocityFromAngle(car.angle, 300));
    }

    game.physics.collide(car, aliens);

}

function render() {

    game.debug.renderSpriteInfo(car, 32, 32);

}
