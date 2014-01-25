var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', 
                           {preload: preload, create: create, update: update, render: render });

var keyboard, cursors
var debugBtn

function preload() {
  game.load.image('fab', 'http://gravatar.com/avatar/922c9fdc02ec0531cd152ca7cadb33bf?s=50');
}

function create() {
  game.stage.backgroundColor = '#2d2d2d';
  
  keyboard = game.input.keyboard
  cursors = game.input.keyboard.createCursorKeys()
  debugBtn = game.add.button(game.world.width - 30, 0, 'btn', activateDebug, this, 2, 1, 0);
}

function update() {

}


function activateDebug(){
  debugger
}

function render() {
  //game.debug.renderSpriteInfo(p1, 100, 10);
  //game.debug.renderSpriteInfo(p1, 100, 10);
  //enemyGroup.forEach(function(ball){
  //  if (ball && ball.exists ){
  //    game.debug.renderSpriteBody(ball);
  //  }
  //})
  //game.debug.renderSpriteCollision(sprite1, 32, 400);
  //game.debug.renderSpriteBody(sprite1);
  //game.debug.renderSpriteBody(sprite2);
}
