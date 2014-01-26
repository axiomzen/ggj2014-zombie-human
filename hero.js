
MAX_LEVEL = LEVELS

// rely on game && cursors
Hero = function () {
  this.sprite = game.add.sprite( WORLD_W/2, WORLD_H -100, 'wabbit' )
  this.sprite.body.collideWorldBounds = true
  this.sprite.x -= this.sprite.body.halfWidth
  // give up this and use this.currentSprite for visual
  this.sprite.renderable = false
  this.sprite.alpha = 0

  this.sprite.health = 100

  this.level = 0
  this.percentage = 0

  var st = this.spriteStates = {}
  st.frontStand = game.add.sprite( -100, -100, 'linkDown', 0 )
  st.frontStand.visible = false
  st.frontStand.scale.setTo( 1.7, 1.7 )
  st.frontStand.anchor.setTo( 0.25, 0.25 )
  st.frontStand.body.immovable = true

  st.frontWalk = game.add.sprite( -100, -100, 'linkDown', 1)
  st.frontWalk.animations.add('walk', [1,2])
  st.frontWalk.visible = false
  st.frontWalk.scale.setTo( 1.7, 1.7 )
  st.frontWalk.anchor.setTo( 0.25, 0.25 )
  st.frontWalk.body.immovable = true


  st.backStand = game.add.sprite( -100, -100, 'linkUp', 0 )
  st.backStand.visible = false
  st.backStand.scale.setTo( 1.7, 1.7 )
  st.backStand.anchor.setTo( 0.25, 0.25 )
  st.backStand.body.immovable = true

  st.backWalk = game.add.sprite( -100, -100, 'linkUp', 1)
  st.backWalk.animations.add('walk', [1,2])
  st.backWalk.visible = false
  st.backWalk.scale.setTo( 1.7, 1.7 )
  st.backWalk.anchor.setTo( 0.25, 0.25 )
  st.backWalk.body.immovable = true


  st.sideStand = game.add.sprite( -100, -100, 'linkSide', 0 )
  st.sideStand.visible = false
  st.sideStand.scale.setTo( 1.7, 1.7 )
  st.sideStand.anchor.setTo( 0.25, 0.25 )
  st.sideStand.body.immovable = true

  st.sideWalk = game.add.sprite( -100, -100, 'linkSide', 1)
  st.sideWalk.animations.add('walk', [1,2])
  st.sideWalk.visible = false
  st.sideWalk.scale.setTo( 1.7, 1.7 )
  st.sideWalk.anchor.setTo( 0.25, 0.25 )
  st.sideWalk.body.immovable = true
}

Hero.prototype.update = function() {
  if( this.sprite.alive ){
    this.sprite.body.velocity.x *= 0.2;
    this.sprite.body.velocity.y *= 0.2;

    // this.setVisual()

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
        this.sprite.body.velocity.x = -200;
    }
    else if (cursors.right.isDown){
        this.sprite.body.velocity.x = 200;
    }
    this.heal(0.1)
  }
};

Hero.prototype.setVisual = function() {
  var spr
  // TODO decision on what face
  var dX = this.sprite.body.deltaX()
  var dY = this.sprite.body.deltaY()
  var absX = Math.abs(dX)
  var absY = Math.abs(dY)

  game.debug.renderText( Math.round(absX)+" DELTA "+Math.round(absY) , 700, 32*2 )
  
  if( absX < 0.1 && absY < 0.1 ){ // STAND
    spr = this.spriteStates.frontStand
  } else if( 0.1 + absY > absX ){ // SIDE
    spr = (dY>0) ? this.spriteStates.frontWalk : this.spriteStates.backWalk
  } else { // VERTICAL
    spr = (dX>0) ? this.spriteStates.sideWalk : this.spriteStates.sideWalk
  }

  spr.x = this.sprite.x
  spr.y = this.sprite.y
  if( spr != this.currentSprite ){
    // 
    spr.visible = true
    if(this.currentSprite){
      this.currentSprite.visible = false
      this.currentSprite.animations.stop()
    }
    spr.play('walk', 12, true);
    this.currentSprite = spr
  }
}

Hero.prototype.render = function() {
  this.setVisual()
}

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