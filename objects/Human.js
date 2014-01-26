(function(module) {

var EnemyMode = {
  'Angry': 'angry',
  'Happy': 'happy'
};

var EnemyHuman = {
  __sprite: function() {
  },

  initialize: function(index, player, patrol) {
    this.index = index;
    this.player = player;
    this.patrol = patrol;

    /* buildModes */
    this.modes = {};
    this.modes[EnemyMode.Angry] = new EnemyAngryStrategy(this, player);
    this.modes[EnenyMode.Happy] = new EnemyHappyStrategy(this, player);

    /* init position */
    this.pos = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    this.buildVisibleArea();
  },

  /*
   * for Phaser.Game.create
   */
  create: function() {
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
      return this.modes[this._mode];
    }

    var mode = arguments[0];
    if (!this.models[mode]) {
      console.err('wrong mode: ', mode);
    }

    this._mode = mode;
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
    this.mode(EnemyMode.Happy);
    game.physics.collide(this.visibleArea(), this.player.body(), this.seePlayer, null, this);
    this.mode().update();
  },

  /* 
   * Human's visible area is a rectangle in front of human body.
   * The size of visible area depends on zombie's percentage of human
   * The higher human percentage is, the bigger visible area is.
   */
  visibleArea: function() {
    var area = this.__sprite('visible_area');

    var humanPercent = this.player.humanPercent();
    var size = {
      width: humanPercent * 10,
      height: humanPercent * 10
    };

    var origin = {
      x: 0,
      y: 0
    };

    var angle = this.pos.angle;

    var pos = _.extend({}, size, origin, angle);
    area.position(pos);

    return area;
  },

  seePlayer: function() {
    this.mode(EnemyMode.Angry);
  }
});

var EnemyStrategy = {
  initialize: function() {
  }
};

var EnemyHappyStrategy = EnemyStrategy.extend({
  name: EnemyMode.Happy,

  initialize: function(enemy, player) {
    this.enemy = enemy;
    this.player = player;
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
    var isAtEnd = this.steps === this.patrol().distance;

    if (isAtEnd) {
      needStay = this.stand === this.patrol().stand;

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
    this.stand++;
    // TODO: stop animation
  },

  turnAround: function(degree) {
    this.point().degree += degree;
    // TODO: update sprite
  },

  moveForward: function() {
    var dist = this.patrol().distance;
    var deg = this.point().degree;

    var newPoint = {
      x: this.point().x + dist * Math.cos(deg),
      y: this.point().y + dist * Math.sin(deg)
    };

    // TODO: move to new Point with this.patrol.speed
  }
});

var EnemyAngryStrategy = EnemyStrategy.extend({
  name: EnemyMode.Angry,

  initialize: function(enemy, player) {
    this.enemy = enemy;
    this.player = player;
  },

  /*
   * When human sees zombie,
   *  Phase 1) human would stand and shoot to zombie
   *  Phase 2) human would move toward zombie, and shoot to zombie
   */
  update: function() {
    this.stand();
    this.shootToZombie();
  },

  stand: function() {
  },

  shootToPlayer: function() {
    this.player.gotShot();
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
