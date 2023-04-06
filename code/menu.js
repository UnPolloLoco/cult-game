scene('menu', () => {
  add([
    rect(SCALE*3, SCALE*2),
    pos(center()),
    anchor('center'),
    color(GREEN),
    area(),
    "play",
  ]);

  onClick('play', (p) => {
    go('game')
  })
});

go('menu')
