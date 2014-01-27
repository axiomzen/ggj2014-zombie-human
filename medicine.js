Medicine = function() {

};


/*
  place LEVELS number of medicine bottles
*/
Medicine.placeAll = function() {
  // should do some more treatment to re-initialize
  if(Medicine.initied){
    return false
  }
  Medicine.initied = true
  Medicine.group = game.add.group()
  d = WORLD_H / (LEVELS )
  for(var i = 0; i < LEVELS; i++){
    var m = Medicine.group.create(game.world.randomX, (d*i), 'med')
    m.body.immovable = true;
    m.heal = 30

    var tw = game.add.tween(m).to( { y:m.y+3 }, 1200, Phaser.Easing.Linear.None, true, 0, 1000, true)
    // tw.loop = true
  }
};