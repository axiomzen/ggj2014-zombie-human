(function(module, objects) {
var EnemyHuman = objects.EnemyHuman;

var Scene = Backbone.Model.extend({
  initialize: function() {
  },

  build: function() {
    this.buildEnemies();
  },

  buildBackground: function() {
  },

  buildEnemies: function() {
    var patrol = {
      point: {
        x: 200,
        y: WORLD_H - 200,
        degree: 0
      },
    
      turnDegree: -Math.PI,
      distance: 100,
      speed: 2,
      stand: 100
    };

    //this.enemy = new EnemyHuman(0, hero, patrol);
    this.enemies = [];
    
    for (var i = 0, len = TOTAL_ENEMY, Y = WORLD_H - 200; i < len; i++, Y -= 200) {
      var X = game.rnd.integerInRange(200, WORLD_W - 200);
      var enemy = this.buildOneEnemyWithXAndY(X, Y, i);
      this.enemies.push(enemy);
    }
  },

  buildOneEnemyWithXAndY: function(x, y, index) {
    var patrol = {
      point: {
        x: x,
        y: y,
        degree: game.rnd.angle()
      },
    
      turnDegree: game.rnd.realInRange(-Math.PI / 2, -Math.PI),
      distance: 100,
      speed: 2,
      stand: 100
    };

    return new EnemyHuman(index, hero, patrol);
  },

  update: function() {
    _.each(this.enemies, function(enemy) {
      enemy.update();
    });
  },

  render: function() {
    _.each(this.enemies, function(enemy) {
      game.debug.renderSpriteBody(enemy.sprite);  
    });
  }
});

module.Scene = Scene;
}(window, objects));
