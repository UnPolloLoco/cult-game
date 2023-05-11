scene('game', () => {
  debug.inspect = false;

  onKeyPress('d', () => { 
    debug.inspect = !debug.inspect; 
  });

  // variable things

  var currentBow = BOWS[STUFF.player.bow];

  const CRIT_CHANCE = 0.05;
  const CRIT_MULTI = 5;

  var openMenu = {
    type: 'none',
    data: {},
  };

  // short functions

  function newID() {
    return randi(1,10**8);
  };

  function isCrit() {
    return chance(CRIT_CHANCE);
  };

  function magicNumbers(x) { // for army size
    return [
      Math.floor(x/2) +1,
      Math.floor((x+1) /2),
    ];
  };
  
  /*function offsetScale(m,x) {
    return m * ((1-x) / (2*x));
    // m = sprite size
    // x = area scale
  };*/

  // ui

  add([
    sprite('deploy'),
    pos(SCALE*0.6, SCALE*0.6),
    anchor('center'),
    scale(TILE*0.8),
    z(Z.ui),
    area(),
    fixed(),
    "openDeploy",
  ]);
  
  onClick('openDeploy', () => { 
    menu(openMenu.type == 'none' ? 'open' : 'close', 'helperSpawnUI'); 
  });

  // environment
  
  add([
    sprite('temple'),
    pos(0,0),
    scale(TILE*6),
    z(Z.places),
  ]);

  add([
    sprite('cave'),
    pos(SCALE*32,0),
    scale(TILE*6),
    z(Z.places),
  ]);

  for (let i = 0; i < 2; i++) {
    add([
      pos(0, [-SCALE*0.6, SCALE*5.6][i]),
      rect(SCALE*40, SCALE),
      area(),
      body({ isStatic: true }),
      opacity(0),
    ]);
  };
  
  for (let i = 0; i < 6; i++) {
    add([
      sprite('path'),
      pos(SCALE*(2 + i*6), 0),
      scale(TILE*6),
      z(Z.ground),
    ]);
  };

  add([
    sprite('wall'),
    pos(SCALE*5,0),
    scale(TILE*6),
    area({
      scale: vec2(1/2, 1),
      offset: vec2(SIZE*0.5, 0),
    }),
    body({ isStatic: true }),
    z(Z.places),
    "wall",
    {
      attackedBy: [],
    }
  ]);

  const wallSide = SCALE*9.5;

  const wallHealth = add([
    text('', { size: SCALE*0.7 }),
    pos(SCALE*7, SCALE),
    z(Z.meters),
  ]);

  // player stuff

  const player = add([
    sprite('helper'),
    pos(SCALE*8, height()/2),
    scale(TILE*0.7),
    anchor('center'),
    rotate(0),
    area(),
    z(Z.wallFighters),
    "player",
    {
      lastAttack: 0,
    }
  ]);

  const bow = player.add([
    sprite('bow'),
    pos(SIZE, 0),
    rotate(0),
    anchor('center'),
  ]);

  // helper spawn ui
  menu_deploy();
  menu('close', 'helperSpawnUI');

  // fighting functions

  function spawnPerson(type, alignment, position) {
    let data = PEOPLE[type];
    let dws = data.weapon.split(':');
    let isR = dws[0] == 'ranged';
    let wpn = isR ? BOWS[dws[1]] : MELEE[dws[1]];
    let itemPos = isR ? vec2(SIZE, 0) : vec2(0, SIZE*0.5);
    if (position == undefined) {
      position = vec2(SCALE*36/2, SCALE*rand(1.3, 4.7));
    };
    let e = add([
      sprite(alignment == 'enemy' ? 'enemy' : 'helper'),
      pos(position),
      anchor('center'),
      scale(TILE*0.7),
      area({ scale: 0.6 }),
      body(),
      rotate(180),
      offscreen({ hide: true, distance: 64 }),
      z(Z.fieldFighters),
      `${alignment}`,
      'fighter',
      {
        data: data,
        weapon: wpn,
        wType: dws[0],
        speed: data.speed,
        rangeToStop: rand(0.65, 0.9) * wpn.range,
        mode: 'moving',
        lastAttack: 0,
        health: data.health,
        itemPos: itemPos,
        isEnemy: (alignment == 'enemy'),
        target: 'none',
        alignment: alignment,
        attackedBy: [],
        spinDirection: chance(0.5) ? 1:-1,
      }
    ]);
    e.add([
      sprite(isR ? 'bow' : 'sword'),
      pos(itemPos),
      anchor(isR ? 'center' : 'left'),
      {
        isWeapon: true,
      }
    ]);
    if (!isR) {
      e.add([
        sprite(wpn.style),
        pos(wpn.style == 'stab' ? itemPos : itemPos.add(SIZE*0.5, -SIZE/2)),
        anchor('center'),
        z(Z.effects),
        opacity(0),
        "attackEffect",
        {
          fadeTime: Math.min(0.5, wpn.cooldown*0.7),
          sliceStart: 0,
          isEffect: true,
          effectType: wpn.style,
        }
      ]);
    };
  };

  function shootArrow(from, to, type, data) {
    add([
      sprite('arrow'),
      pos(from),
      rotate(to),
      scale(TILE/3),
      move(to, SCALE*data.speed),
      anchor('center'),
      area(),
      offscreen({ hide: true, distance: SCALE }),
      z(Z.effects),
      "arrow",
      {
        damage: data.damage,
        start: from.x,
        data: data,
        from: type,
        alignment: type,
      }
    ]);
  };

  function meleeAttack(from, weapon, align) {
    let w;
    let e;
    from.children.forEach((child) => {
      if (child.isWeapon) w = child;
      if (child.isEffect) e = child;
    });

    let isS = weapon.style == 'stab';

    add([
      rect(SCALE*weapon.range, SCALE*(isS ? 0.7 : 0.9)),
      pos(from.pos
        .sub(Vec2.fromAngle(from.angle-90).scale(SCALE*0.2*(isS ? 1:0))) // weapon pos
        .add(Vec2.fromAngle(from.angle).scale(SCALE*0.7)) // move forward
      ),
      lifespan(0.2),
      anchor('center'),
      opacity(0.1),
      rotate(from.angle),
      area(),
      "attackHitbox",
      {
        attackID: newID(),
        weapon: weapon,
        alignment: from.alignment,
      }
    ]);

    if (isS) {
      e.opacity = 1;
      w.pos.x = SIZE*0.3;
      
      setTimeout(() => {
        w.pos.x = 0;
      }, weapon.cooldown * 250);
    } else if (weapon.style == 'slice') {
      e.opacity = 1;
      w.angle = -20;
      
      setTimeout(() => {
        e.opacity = 0;
        w.angle = 0;
      }, weapon.cooldown * 250);
    };
  };

  function damageIndicator(where, amount, alignment, crit) {
    if (crit == undefined) crit = false;
    add([
      text(amount, { size: SCALE/5 * (Number(crit)+1) }),
      color(alignment == 'enemy' ? WHITE : RED),
      pos(where),
      z(Z.dmg),
      opacity(1),
      lifespan(1),
      anchor('center'),
      "damageIndicator",
      {
        originalPos: where,
        time: time(),
      }
    ]);
  };

  function critEffect(position) {
    add([
      pos(position),
      sprite('critical'),
      scale(TILE*2),
      lifespan(0, { fade: 1 }),
      anchor('center'),
      opacity(1),
      z(Z.effects),
    ]);
  };

  function ATTACK(f) {
    if (f.lastAttack + f.weapon.cooldown <= time()/* && f.target != 'none'*/) {
      if (f.wType == 'ranged') {
        let angleToAttack;
        if (f.target == 'none') {
          angleToAttack = player.pos.angle(f.pos);
        } else {
          angleToAttack = f.target.pos.angle(f.pos);
        };
        f.angle = angleToAttack + rand(-3,3);
        let spawnPos = f.pos.add(Vec2.fromAngle(f.angle).scale(SCALE*0.9)); 
        shootArrow(spawnPos, f.angle, f.alignment, f.weapon);
      } else {
        meleeAttack(f, f.weapon, f.alignment);
      };
      f.lastAttack = time();
    };
  };
  
  function fighterEval() {
    get('fighter').forEach((f) => {
      let closest = 'none';
      let closestDist = 1000;
      let opposite = [
        'enemy',
        'you',
      ][Number(f.isEnemy)];
      get(opposite).forEach((o) => {
        let d = f.pos.dist(o.pos) / SCALE;
        if (d < closestDist) {
          closest = o;
          closestDist = d;
        };
      });
      setTimeout(() => {
        f.target = closest;
      }, 30);
    });
  };

  // loops and conditions
  
  loop(5, () => {
    spawnPerson('basicBow', 'enemy');
    spawnPerson('basicSword', 'enemy');
  });

  // shoot arrow manually
  onClick(() => {
    let spawnPos = player.pos.add(Vec2.fromAngle(player.angle).scale(SCALE*0.9)); 
    if (player.lastAttack + currentBow.cooldown <= time()) {
      shootArrow(spawnPos, player.angle, 'you', currentBow);
      player.lastAttack = time();
    };
  });

  onCollide('arrow', 'fighter', (a,e) => {
    if (a.from != e.alignment) {
      let dmg = a.damage;
      let crit = isCrit();
      if (crit) {
        dmg *= CRIT_MULTI;
        critEffect(e.pos);
      };
      e.health -= dmg;
      damageIndicator(e.pos, dmg, e.alignment, crit);
      destroy(a);
      if (e.health <= 0) destroy(e);
    };
  });
  onCollide('arrow', 'player', (a,p) => {
    if (a.from == 'enemy') {
      let dmg = a.damage;
      let crit = isCrit();
      if (crit) {
        dmg *= CRIT_MULTI;
        critEffect(p.pos);
      };
      damageIndicator(p.pos, dmg, 'you', crit);
      destroy(a);
    };
  });

  onCollide('attackHitbox', 'wall', (a,w) => {
    if (a.opacity > 0 && !w.attackedBy.includes(a.attackID)) {
      let dmg = a.weapon.damage;
      let crit = isCrit();
      if (crit) {
        dmg *= CRIT_MULTI;
        critEffect(a.pos);
      };
      w.attackedBy.push(a.attackID);
      w.attackedBy = w.attackedBy.slice(-15);
      STUFF.wallHealth -= dmg;
      damageIndicator(a.pos, dmg, 'you', crit);
    };
  });

  onCollide('attackHitbox', 'fighter', (a,w) => {
    if (a.opacity > 0 && !w.attackedBy.includes(a.attackID) && a.alignment != w.alignment) {
      let dmg = a.weapon.damage;
      let crit = isCrit();
      if (crit) {
        dmg *= CRIT_MULTI;
        critEffect(a.pos);
      };
      w.attackedBy.push(a.attackID);
      w.attackedBy = w.attackedBy.slice(-15);
      w.health -= dmg;
      damageIndicator(a.pos, dmg, w.alignment, crit);
      
      if (w.health <= 0) destroy(w);
    };
  });

  // temorary deploy button
  onKeyPress('s', () => {
    let helperCount = magicNumbers(openMenu.data.sizeID); // max 9
    let rows = helperCount[0];
    let columns = helperCount[1];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        spawnPerson('basicSword', 'you', toWorld(mousePos().add(
          (c + 0.5 - columns/2) * SCALE*0.7,
          (r + 0.5 - rows/2) * SCALE*0.7,
        )));
      };
    };
    fighterEval();
  });

  // fighters reeval their surroundings
  loop(0.5, () => {
    fighterEval();
  });


  onUpdate(() => {
    perFrame();
  });
});
