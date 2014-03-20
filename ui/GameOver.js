(function() {
  ui.GameOver = {
    show: function() {
      alert("You lost! \nGame is restarting")
      window.location.href = window.location.href
      //var bg = new Phaser.Rectangle(0, 0, SCREEN_W, SCREEN_H);
      // var text = "Game Over";
      // var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

      // var center = {
      //   x: SCREEN_W/2, 
      //   y: WORLD_H - SCREEN_H / 2 - 100
      // };
      // var t = game.add.text(center.x, center.y, text, style);
      // t.anchor.setTo(0.5,0.5);
    }
  };
}(ui));
