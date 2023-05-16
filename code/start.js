let ratio = 0.6;

let ww = window.innerWidth;let wh = window.innerHeight;let kaboomDimensions = {};if (ww * ratio > wh) {kaboomDimensions = { w: wh / ratio,h: wh};} else {kaboomDimensions = {w: ww,h: ww * ratio};};

kaboom({
  background: [100,100,100],
  width: kaboomDimensions.w,
  height: kaboomDimensions.h,
  inspectColor: [255,255,255],
  pixelDensity: 1,
  crisp: true,
  touchToMouse: true,
});

function ls(a,b) {
  if (b == undefined) {
    loadSprite(a, `${a}.png`); 
  } else {
    loadSprite(a, `${a}.png`, b);
  };
};

const SCALE = width()/10;
const SIZE = 400;
const TILE = SCALE/SIZE;

const Z = {
  ground:        -100,
  fieldFighters:  0,
  places:         100,
  wallFighters:   200,
  effects:        300,
  dmg:            400,
  meters:         500,
  ui:             600,
};

var openMenu = {
  type: 'none',
  data: {},
};

function menu(action, name) {
  get(name).forEach((h) => {
    h.pos.y = action == 'open' ? h.ogY : height()*30;
  });
  if (action == 'open') {
    openMenu = MENU_DATA_DEFAULT[name];
  } else {
    openMenu = {
      type: 'none',
      data: {},
    };
  };
};

loadRoot('sprites/');

ls('temple');
ls('enemy');
ls('helper');
ls('bow');
ls('path');
ls('wall');
ls('cave');
ls('arrow');
ls('sword');
ls('stab');
ls('slice');
ls('critical');
ls('deploy');
ls('deployLocation');
