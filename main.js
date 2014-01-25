var game = new Phaser.Game(800, 600, Phaser.AUTO, '', 
                           {preload: preload, create: create, update: update, render: render });

var keyboard, cursors
var debugBtn
var map, groundLayer, tileset

var z1

function preload() {
  game.load.image('fab', 'http://gravatar.com/avatar/922c9fdc02ec0531cd152ca7cadb33bf?s=50');
  game.load.tilemap('map', 'tiles/map3.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.tileset('tiles', 'tiles/mini-tiles.png',20,20);
//    game.load.tileset('tiles', 'phaser-master/examples/assets/maps/mario1.png',16,16);
  game.load.image('player', 'phaser-master/examples/assets/sprites/phaser-dude.png');
}

function create() {
  game.stage.backgroundColor = '#2d2d2d';
  
  keyboard = game.input.keyboard
  cursors = game.input.keyboard.createCursorKeys()
  debugBtn = game.add.button(game.world.width - 30, 0, 'btn', activateDebug, this, 2, 1, 0);
//   debugBtn.fixedToCamera = true
  
  map = game.add.tilemap('map')
  tileset = game.add.tileset('tiles')
  
  //  floor
//   tileset.setCollisionRange(10, 97, true, true, true, true);
  tileset.setCollision(74, true, true, true, true)
  
  groundLayer = game.add.tilemapLayer(0, 0, 800, 600, tileset, map, 0)
  groundLayer.fixedToCamera=false
  groundLayer.resizeWorld()

  z1 = game.add.sprite(30,30,'player')
  z1.body.gravity.y = 10;
  z1.body.bounce.y = 0.1;
  z1.anchor.setTo(0.5, 0.5);
  z1.body.collideWorldBounds = true
  
  game.camera.follow(z1);
}

function update() {
    game.physics.collide(z1,groundLayer);

    z1.body.velocity.x = 0;

    if (cursors.up.isDown)
    {
//         if (z1.body.touching.down)
//         {
            z1.body.velocity.y = -400;
//         }
    }
    else if (cursors.down.isDown)
    {
        // game.camera.y += 4;
    }

    if (cursors.left.isDown)
    {
        z1.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        z1.body.velocity.x = 150;
    }

}


function activateDebug(){
  debugger
}

function render() {
  game.debug.renderSpriteInfo(z1, 100, 100);
//   console.log(z1.x, z1.y)
  //game.debug.renderSpriteInfo(p1, 100, 10);
  //enemyGroup.forEach(function(ball){
  //  if (ball && ball.exists ){
  //    game.debug.renderSpriteBody(ball);
  //  }
  //})
  //game.debug.renderSpriteCollision(sprite1, 32, 400);
//   game.debug.renderSpriteBody(z1);
//   game.debug.renderSpriteBounds(z1);
  //game.debug.renderSpriteBody(sprite2);
}
