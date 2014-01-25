var game = new Phaser.Game(400, 400, Phaser.CANVAS, '', 
                           {preload: preload, create: create, update: update, render: render });

var p1
var enemyGroup, ball0
var projectileGroup, weaponCD, bullet0
var floorGroup, floor, wallLeft, wallRight
var keyboard, cursors
var baseEnemies

  function preload() {
    game.load.image('fab', 'http://gravatar.com/avatar/922c9fdc02ec0531cd152ca7cadb33bf?s=50');
  }

  function create() {
    game.stage.backgroundColor = '#2d2d2d';
    
    p1 = game.add.sprite(10, game.world.height - 100, 'fab');
    projectileGroup = game.add.group()
    weaponCD = 0
    
    buildWalls()
    enemyGroup = game.add.group()
    ball0 = createEnemy(game.world.centerX, game.world.centerY )
    ball0.body.velocity.x = 100
    
    //p1.body.angularVelocity += 100
    keyboard = game.input.keyboard
    //debugger
    cursors = game.input.keyboard.createCursorKeys()
    
    debugBtn = game.add.button(game.world.width - 30, 0, 'btn', activateDebug, this, 2, 1, 0);
  }

function update() {
  p1.body.velocity.x = 0;
  p1.body.velocity.y = 100;
  
  if( cursors.right.isDown ){
    p1.body.velocity.x = 300
  }
  if( cursors.left.isDown ){
    p1.body.velocity.x = -300
  }
  
  if( cursors.up.isDown ){
    fireWeapon()
  }
  
  game.physics.collide(p1, floorGroup, null, null, this);
  game.physics.collide(enemyGroup, floorGroup, null, null, this);
  game.physics.collide(enemyGroup, projectileGroup, bulletHitsBall, null, this);
}

function bulletHitsBall(enemy,projectile){
  var x = enemy.x;
  var y = enemy.y;
  console.log("bulletHitsBall", x, y)
  enemy.kill()
  projectile.kill()
  var bl = createEnemy(x-10,y)
  bl.body.velocity.x = -100
  var br = createEnemy(x+10,y)
  br.body.velocity.x = 100
}

function buildWalls() {
  floorGroup = game.add.group()
  
  floor = floorGroup.create(0, game.world.height, null);
  floor.name = 'groundfloor';
  floor.body.immovable = true;
  floor.body.setSize(game.world.width,100,0,0)
  
  wallLeft = floorGroup.create(-30, 0, null);
  wallLeft.body.setSize(31,game.world.height,0,0)
  wallLeft.body.immovable = true;
  
  wallRight = floorGroup.create(game.world.width-1, 0, null);
  wallRight.body.setSize(31,game.world.height,0,0)
  wallRight.body.immovable = true;
}

function createEnemy(x,y) {
  var enemy = enemyGroup.create(x, y, 'null')
  enemy.anchor.setTo(0.5, 0.5);
  enemy.body.gravity.y = 10
  enemy.body.velocity.y = -200
  //enemy.body.velocity.x = ( Math.random() > 0.5 ? 100 : -100 )
  enemy.body.bounce.setTo(1.1,1);
  return enemy
}

function fireWeapon(){
  x = p1.x + (p1.width/2)
  if( weaponCD + 300 < Date.now() ) {
    console.log('fireWeapon',x, 'group has', projectileGroup.length)
    weaponCD = Date.now()
    bullet0 = projectileGroup.create(x, game.world.height - 50, 'fab')
    bullet0.alpha = 0.5
    bullet0.body.gravity.y = -10
    // http://gametest.mobi/phaser/examples/sideview.html
    bullet0.events.onOutOfBounds.add(function(b){b.kill()}, this);
    //projectileGroup.alpha = 0.5
    //projectileGroup.scale = new Phaser.Point(0.5,0.5)
  }
}

function activateDebug(){
  debugger
}

function render() {
  //game.debug.renderSpriteInfo(p1, 100, 10);
  game.debug.renderSpriteInfo(p1, 100, 10);
  enemyGroup.forEach(function(ball){
    if (ball && ball.exists ){
      game.debug.renderSpriteBody(ball);
    }
  })
  /*game.debug.renderSpriteCollision(sprite1, 32, 400);
  game.debug.renderSpriteBody(sprite1);
  game.debug.renderSpriteBody(sprite2);*/
}
