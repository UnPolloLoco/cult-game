scene('menu', () => {
  add([
    rect(SCALE*3, SCALE*2),
    pos(center()),
    anchor('center'),
    color(GREEN),
    area(),
    "play",
  ]);

  try {
  onClick('play', (p) => {
    go('game')
  });
  } catch (e) { alert(e); };
});

go('menu')
