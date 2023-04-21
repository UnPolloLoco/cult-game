const deployMenuBG = add([
  rect(10*SCALE, 2*SCALE),
  pos(0, height()),
  anchor('botleft'),
  color(rgb(120,120,120)),
  z(600),
  fixed(),
  "helperSpawnUI",
  {
    ogY: height(),
  }
]);

const closeSpawnUI = add([
  rect(SCALE/2, SCALE/2),
  pos(SCALE, height() - SCALE*2),
  anchor('center'),
  color(RED),
  z(600),
  fixed(),
  area(),
  "helperSpawnUI",
  "closeDeploy",
  {
    ogY: height() - SCALE*2,
  }
]);

const deploySetBar = add([
  rect(SCALE*6.125, SCALE/4),
  pos(SCALE*0.75, SCALE*5.25),
  color(rgb(100,100,100)),
  z(600),
  fixed(),
  area({ 
    scale: vec2(1, 3),
    offset: vec2(0, offsetScale(SCALE/4, 3)),
  }),
  "helperSpawnUI",
  {
    ogY: SCALE*5.25,
  }
]);

const deployCountDrag = add([
  rect(SCALE*0.5, SCALE*0.5),
  pos(SCALE*1.25, SCALE*(5.5 - 1/8)),
  // from 1.25 to 6.25 (0->5 +1.25)
  anchor('center'),
  scale(1),
  color(WHITE),
  z(600),
  fixed(),
  area(),
  "helperSpawnUI",
  {
    ogY: SCALE*(5.5 - 1/8),
  }
]);

const deployMainText = add([
  text('Deploying 1', {size: SCALE*0.4}),
  pos(SCALE*0.75, SCALE*4.5),
  fixed(),
  z(600),
  "helperSpawnUI",
  {
    ogY: SCALE*4.5,
  }
]);

console.log('wahoo');

export default 1;
