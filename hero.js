
MAX_LEVEL = LEVELS

// rely on game && cursors
Hero = function () {
  this.sprite = game.add.sprite( WORLD_W/2, WORLD_H -100, 'wabbit' )
  this.sprite.body.collideWorldBounds = true
  this.sprite.x -= this.sprite.body.halfWidth
  this.sprite.anchor.setTo(0.5, 0.5);

  this.sprite.health = 100

  this.level = 0
  this.percentage = 0
}

Hero.prototype.update = function() {
  if( this.sprite.alive ){
    this.sprite.body.velocity.x *= 0.1;
    this.sprite.body.velocity.y *= 0.1;

    // Phaser.Rectangle.contains(this.sprite.body, game.input.x, game.input.y)
    if (game.input.mousePointer.isDown && !Phaser.Rectangle.contains(this.sprite.body, game.input.x + game.camera.x, game.input.y +  game.camera.y) ) {
      game.physics.moveToPointer(this.sprite, 300);
    }

    if (cursors.up.isDown){
        this.sprite.body.velocity.y = -200
    }
    else if (cursors.down.isDown){
        this.sprite.body.velocity.y = 200
    }

    if (cursors.left.isDown) {
        this.sprite.body.velocity.x = -300;
    }
    else if (cursors.right.isDown){
        this.sprite.body.velocity.x = 300;
    }
    this.heal(0.1)
  }
};

// random damage for debug
// setInterval( function() {
//   if( hero ) hero.damage( 10 )
// },1000)

Hero.prototype.pickMed = function(med) {
  this.level++
  this.percentage = this.level / MAX_LEVEL
  this.heal( med.heal )
};

Hero.prototype.heal = function(amt) {
  this.sprite.health += amt
  if( this.sprite.health > 100 ){
    this.sprite.health = 100
  } 
};

Hero.prototype.damage = function(amt) {
  this.sprite.damage(amt)
  // TODO some effect / frame
};

Hero.prototype.body = function() {
  return this.sprite.body
};