function menu_deploy() {
  const deploy = add([pos(0,0), rect(0,0)]);

  deploy.add([
    rect(10*SCALE, 2*SCALE),
    pos(0, height()),
    anchor('botleft'),
    color(rgb(120,120,120)),
    z(Z.ui),
    fixed(),
    "helperSpawnUI",
    {
      ogY: height(),
    }
  ]);

  const closeSpawnUI = deploy.add([
    rect(SCALE/2, SCALE/2),
    pos(SCALE, height() - SCALE*2),
    anchor('center'),
    color(RED),
    z(Z.ui),
    fixed(),
    area(),
    "helperSpawnUI",
    "closeDeploy",
    {
      ogY: height() - SCALE*2,
    }
  ]);

  const deploySetBar = deploy.add([
    rect(SCALE*6.125, SCALE/4),
    pos(SCALE*0.75, SCALE*5.25),
    color(rgb(100,100,100)),
    z(Z.ui),
    fixed(),
    area({ 
      scale: vec2(1, 3),
      offset: vec2(0, -SCALE/12),
    }),
    "helperSpawnUI",
    {
      ogY: SCALE*5.25,
    }
  ]);

  const deployCountDrag = deploy.add([
    rect(SCALE*0.5, SCALE*0.5),
    pos(SCALE*1.25, SCALE*(5.5 - 1/8)),
    // from 1.25 to 6.25 (0->5 +1.25)
    anchor('center'),
    scale(1),
    color(WHITE),
    z(Z.ui),
    fixed(),
    area(),
    "helperSpawnUI",
    {
      ogY: SCALE*(5.5 - 1/8),
    }
  ]);

  const deployMainText = deploy.add([
    text('Deploying 1', {size: SCALE*0.4}),
    pos(SCALE*0.75, SCALE*4.5),
    fixed(),
    z(Z.ui),
    "helperSpawnUI",
    {
      ogY: SCALE*4.5,
    }
  ]);
};
