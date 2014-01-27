(function(module) {

var EnemyMode = {
  'Angry': 'angry',
  'Happy': 'happy'
};

var EnemyBase = Backbone.Model.extend({});

var EnemyHuman = EnemyBase.extend({
  __sprite: function() {
  },

  initialize: function(index, player, patrol) {
    this.index = index;
    this.player = player;
    this.patrol = patrol;

    /* buildModes */
    this.modes = {};
    this.modes[EnemyMode.Angry] = new EnemyAngryStrategy(this, player, scene.bullets);
    this.modes[EnemyMode.Happy] = new EnemyHappyStrategy(this, player, scene.bullets);

    this.buildBody();
    this.buildVisibleArea();
  },

  /*
   * for Phaser.Game.create
   */
  create: function() {
  },

  buildBody: function() {
    /* sprite */
    this.sprite = game.add.sprite(this.patrol.point.x, this.patrol.point.y, 'enemy', this.index);
    this.sprite.animations.add('walk', [1, 0, 2]);
    this.sprite.play('walk', 12, true);
    
    this.sprite.name = this.index + "";
    this.sprite.anchor.setTo(0.5, 0.5);
    //this.sprite.body.collideWorldBounds = true;
    //this.sprite.body.setSize(100, 100, 0, 0);
  },

  buildVisibleArea: function() {
    return this.visibleArea;
  },

  /* 
   * mode() - get strategy mode by name
   * mode(mode) - update strategy mode by name
   */ 
  mode: function() {
    if (arguments.length) {
      var mode = arguments[0];
      if (!this.modes[mode]) {
        console.err('wrong mode:', mode);
      }

      this._mode = mode;
    }

    return this.modes[this._mode];
  },

  /* 
   * if human enemy "see" zombie
   *  enter "angry" mode
   *    "shoot" to zombie
   *
   * else, meaning "not see" zombie
   *  enter "happy" mode
   *    "walk around"
   */
  update: function() {
    var DISTANCE_ANGRY = 300;
    var isAngry = game.physics.distanceBetween(this.visibleArea(), this.player.sprite) < DISTANCE_ANGRY;
    this.mode(isAngry? EnemyMode.Angry : EnemyMode.Happy);
    //game.physics.collide(this.visibleArea(), this.player.sprite, this.seePlayer, null, this);
    this.mode().update();
  },

  /* 
   * Human's visible area is a rectangle in front of human body.
   * The size of visible area depends on zombie's percentage of human
   * The higher human percentage is, the bigger visible area is.
   */
  visibleArea: function() {
    return this.sprite;

    //var area = this.__sprite('visible_area');

    //var humanPercent = this.player.percentage;
    //var size = {
    //  width: humanPercent * 10,
    //  height: humanPercent * 10
    //};

    //var origin = {
    //  x: 0,
    //  y: 0
    //};

    //var angle = this.pos.angle;

    //var pos = _.extend({}, size, origin, angle);
    //area.position(pos);

    //return area;
  }

  //seePlayer: function() {
  //  console.log('see player');
  //  this.mode(EnemyMode.Angry);
  //}
});

var EnemyStrategy = EnemyBase.extend({
  initialize: function() {
  }
});

var EnemyHappyStrategy = EnemyStrategy.extend({
  name: EnemyMode.Happy,

  initialize: function(enemy, player) {
    this.enemy = enemy;
    this.player = player;
    
    this.steps = 0;
    this.point = this.patrol().point;
    this.updateStepOffsetRate();
  },

  patrol: function() {
    if (arguments.length) {
      this.enemy.patrol = arguments[0];
    }

    return this.enemy.patrol;
  },

  point: function() {
    if (arguments.length) {
      this.enemy.patrol.point = arguments[0];
    }

    return this.enemy.patrol.point;
  },

  /* 
   * if at the end
   *   if needs to stand
   *     "stand"
   *   else
   *     turn around
   *   return
   *
   * else
   *   "move" forward
   */
  update: function() {
    // console.log('happy');
    var isAtEnd = this.steps === this.patrol().distance;

    if (isAtEnd) {
      needStay = this.stand !== this.patrol().stand;

      if (needStay) {
        this.keepStanding();
      } else {
        this.turnAround(this.patrol().turnDegree);
      }
      return;
    }

    this.moveForward();
  },

  keepStanding: function() {
    this.stand = this.stand || 0;
    this.stand++;
    // TODO: stop animation
  },

  turnAround: function(degree) {
    // reset stand time counting
    this.stand = 0;
    
    // set end point as start point
    var oldDegree = this.point.degree;
    this.point = this.curPos();
    this.point.degree = oldDegree + degree;
    
    // reset step, update step offset
    this.steps = 0;
    this.updateStepOffsetRate();
    // TODO: update sprite
    
  },
  
  updateStepOffsetRate: function() {
    var deg = this.point.degree;
    var speed = this.patrol().speed;
    
    this.stepOffsetRate = {
      x: Math.cos(deg) * speed,
      y: Math.sin(deg) * speed
    };
  },
  
  curPos: function() {
    return {
      x: this.point.x + this.steps * this.stepOffsetRate.x,
      y: this.point.y + this.steps * this.stepOffsetRate.y
    };
  },

  moveForward: function() {
    this.steps++;

    var newPos = this.curPos();

    // TODO: move to new Point with this.patrol.speed
    this.enemy.sprite.preX = this.enemy.sprite.x;
    this.enemy.sprite.preY = this.enemy.sprite.y;
    this.enemy.sprite.x = newPos.x;
    this.enemy.sprite.y = newPos.y;
  }
});

var EnemyAngryStrategy = EnemyStrategy.extend({
  name: EnemyMode.Angry,

  initialize: function(enemy, player, bullets) {
    this.enemy = enemy;
    this.player = player;
    this.bullets = bullets;

    this.nextFire = 0;
    this.fireRate = FIRE_RATE;
  },

  /*
   * When human sees zombie,
   *  Phase 1) human would stand and shoot to zombie
   *  Phase 2) human would move toward zombie, and shoot to zombie
   */
  update: function() {
    // console.log('angry');
    this.stand();
    this.shootToPlayer();
  },

  stand: function() {
    // console.log('standing');
  },

  shootToPlayer: function() {
    // console.log('start shoot');
    //this.player.damage(1);
    if (game.time.now > this.nextFire && this.bullets.countDead()) {
      this.nextFire = game.time.now + this.fireRate;

      var bullet = this.bullets.getFirstDead();
      bullet.scale.setTo(0.8, 0.8);
      bullet.reset(this.enemy.sprite.x, this.enemy.sprite.y);

      bullet.rotation = game.physics.moveToObject(bullet, this.player.sprite, 250);
    }
  }

});

/*
var EnemyPatrol = {
  point: {
    x: 100,
    y: 100,
    degree: 0
  },

  turnDegree: 180,
  distance: 100,
  speed: 1,
  stand: 2000
};
*/

module.EnemyMode = EnemyMode;
module.EnemyHuman = EnemyHuman;
module.EnemyStrategy = EnemyStrategy;
module.EnemyAngryStrategy = EnemyAngryStrategy;
module.EnemyHappyStrategy = EnemyHappyStrategy;

}(window.objects));
