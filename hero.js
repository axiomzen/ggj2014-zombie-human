
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
  st.frontStand = game.add.sprite( -100, -100, 'linkFront', 0 )
  st.frontStand.visible = false
  st.frontStand.scale.setTo( 2, 2 )
  st.frontStand.anchor.setTo( 0.25, 0.25 )
  st.frontStand.body.immovable = true
  st.frontStand.stand = true

  st.frontWalk = game.add.sprite( -100, -100, 'linkFront', 1)
  st.frontWalk.animations.add('walk', [1,0,2])
  st.frontWalk.visible = false
  st.frontWalk.scale.setTo( 2, 2 )
  st.frontWalk.anchor.setTo( 0.25, 0.25 )
  st.frontWalk.body.immovable = true


  st.backStand = game.add.sprite( -100, -100, 'linkBack', 0 )
  st.backStand.visible = false
  st.backStand.scale.setTo( 2, 2 )
  st.backStand.anchor.setTo( 0.25, 0.25 )
  st.backStand.body.immovable = true
  st.backStand.stand = true

  st.backWalk = game.add.sprite( -100, -100, 'linkBack', 1)
  st.backWalk.animations.add('walk', [1,0,2])
  st.backWalk.visible = false
  st.backWalk.scale.setTo( 2, 2 )
  st.backWalk.anchor.setTo( 0.25, 0.25 )
  st.backWalk.body.immovable = true


  st.leftStand = game.add.sprite( -100, -100, 'linkLeft', 0 )
  st.leftStand.visible = false
  st.leftStand.scale.setTo( 2, 2 )
  st.leftStand.anchor.setTo( 0.25, 0.25 )
  st.leftStand.body.immovable = true
  st.leftStand.stand = true

  st.leftWalk = game.add.sprite( -100, -100, 'linkLeft', 1)
  st.leftWalk.animations.add('walk', [1,0,2])
  st.leftWalk.visible = false
  st.leftWalk.scale.setTo( 2, 2 )
  st.leftWalk.anchor.setTo( 0.25, 0.25 )
  st.leftWalk.body.immovable = true


  st.rightStand = game.add.sprite( -100, -100, 'linkRight', 0 )
  st.rightStand.visible = false
  st.rightStand.scale.setTo( 2, 2 )
  st.rightStand.anchor.setTo( 0.25, 0.25 )
  st.rightStand.body.immovable = true
  st.rightStand.stand = true

  st.rightWalk = game.add.sprite( -100, -100, 'linkRight', 1)
  st.rightWalk.animations.add('walk', [1,0,2])
  st.rightWalk.visible = false
  st.rightWalk.scale.setTo( 2, 2 )
  st.rightWalk.anchor.setTo( 0.25, 0.25 )
  st.rightWalk.body.immovable = true
  
  // this.currentSprite.x = this.sprite.x
  // this.currentSprite.y = this.sprite.y
  // this.currentSprite.visible = true
  // this.currentSprite = st.frontStand

  this.medPickupSound = game.add.audio('medPickup')
}

Hero.prototype.update = function() {
  if( this.sprite.alive && game.playing ){
    this.sprite.body.velocity.x *= 0.2;
    this.sprite.body.velocity.y *= 0.2;

    // this.setVisual()

    // Phaser.Rectangle.contains(this.sprite.body, game.input.x, game.input.y)
    if (game.input.mousePointer.isDown && !Phaser.Rectangle.contains(this.sprite.body, game.input.x + game.camera.x, game.input.y +  game.camera.y) ) {
      game.physics.moveToPointer(this.sprite, 220);
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

  // game.debug.renderText( Math.round(absX)+" DELTA "+Math.round(absY) , 700, 32*2 )
  
  if( absX < 0.1 && absY < 0.1 ){ // STAND
    // var pdX = this.sprite.body.preX
    // var pdY = this.sprite.body.preY
    // var abspX = Math.abs(pdX)
    // var abspY = Math.abs(pdY)
    if( this.currentSprite && !this.currentSprite.stand ){ // just STOPPED?
      if( absY > absX ) // STOP VERTICAL
        spr = (dY>0) ? this.spriteStates.frontStand : this.spriteStates.backStand
      else
        spr = (dX>0) ? this.spriteStates.rightStand : this.spriteStates.leftStand
    }
  } else if( 0.1 + absY > absX ){ // VERTICAL
    spr = (dY>0) ? this.spriteStates.frontWalk : this.spriteStates.backWalk
  } else { // SIDE
    spr = (dX>0) ? this.spriteStates.rightWalk : this.spriteStates.leftWalk
  }

  // initial state
  if(!spr) spr = this.currentSprite || this.spriteStates.frontStand

  // this is acting a bit choppy/jumpy compared to only 1 frame, but its how they do in Tanks demo
  spr.x = this.sprite.x
  spr.y = this.sprite.y
  if( spr != this.currentSprite ){
    // 
    spr.visible = true
    if(this.currentSprite){
      this.currentSprite.visible = false
      this.currentSprite.animations.stop()
    }
    if( spr && spr.animations._anims.walk ){
      spr.play('walk', 12, true);
    }
    this.currentSprite = spr
  }
  //game.debug.renderSpriteBody(this.sprite);
}

Hero.prototype.render = function() {
  this.setVisual()
}

Hero.prototype.winMode = function() {
  this.medPickupSound.stop()
  this.sprite.body.velocity.setTo(0,0.001)
  // not sure why Tween target becomes undefined sometimes
  // game.add.tween(this.currentSprite.scale).to( { x:30, y:30 }, 2000, Phaser.Easing.Linear.None, true);
};

// random damage for debug
// setInterval( function() {
//   if( hero ) hero.damage( 10 )
// },1000)

Hero.prototype.pickMed = function(med) {
  this.medPickupSound.stop()
  this.medPickupSound.play('',0,1,false,true)

  if( this.level+1 <= 8 ){
    game.music.stop()
    game.music = game.add.audio('z'+(this.level+1))
    game.music.play( '', 0, 1, true )
  }
  
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
  console.log("hero damage", this.sprite.health);
  // TODO some effect / frame
  if (this.sprite.health < 0) {
    ui.GameOver.show();
  }
};

Hero.prototype.body = function() {
  return this.sprite.body
};
