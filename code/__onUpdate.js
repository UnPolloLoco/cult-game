function perFrame() {
  // camera movement
    let scrollPower = Math.abs((mousePos().x - width()/2) /3 /SCALE) ** 5.2;
    scrollPower = Math.min(scrollPower, 14);
    if (scrollPower > 0.15) {
      let spSign = (mousePos().x - width()/2) / Math.abs((mousePos().x - width()/2));
      camPos(Math.min(Math.max(camPos().x + (SCALE*scrollPower/80)*spSign, width()/2), SCALE*32), height()/2);
    };

    // turn your player towards mouse
    player.angle = player.pos.angle(toWorld(mousePos())) + 180;

    // arrow despawner
    get('arrow').forEach((a) => {
      if (Math.abs(a.start - a.pos.x)/SCALE > a.data.range) {
        destroy(a);
      };
    });

    // fighter onupdate
    get('fighter').forEach((f) => {
      let closest = f.target;

      // no target AND an enemy
      if (closest == 'none' && f.isEnemy) {
        if (f.pos.x <= wallSide + f.rangeToStop*SCALE) {
          f.mode = 'attacking';
          ATTACK(f);
        } else {
          f.mode = 'moving';
          f.angle = 180;
          f.pos = f.pos.add(Vec2.fromAngle(f.angle)
            .scale(f.speed*dt()*SCALE));
        };

      // no target AND a helper
      } else if (closest == 'none' && !f.isEnemy) {
        f.angle += 250 * dt() * f.spinDirection;

      // moving to target
      } else if (f.pos.dist(closest.pos) > f.rangeToStop*SCALE) {
        f.mode = 'moving';
        f.angle = closest.pos.angle(f.pos);
        f.pos = f.pos.add(Vec2.fromAngle(f.angle)
          .scale(f.speed*dt()*SCALE));

      // attack
      } else {
        f.mode = 'attacking';
        ATTACK(f);
      };
    });

    wallHealth.text = STUFF.wallHealth;

    get('attackEffect', { recursive: true }).forEach((a) => {
      if (a.opacity > 0 && a.effectType == 'stab') {
        a.opacity -= 1 / a.fadeTime * dt();
        if (a.opacity < 0) { 
          a.opacity = 0;
        } else {
          a.pos.x = SIZE*(0.5 + (1-a.opacity)*(0.3));
        };
      };
    });

    get('damageIndicator').forEach((d) => {
      let t = Math.sqrt(time() - d.time);
      let y = -0.5*( Math.sqrt(-2.9*(t**2) + 3*t) + t );
      d.pos = d.originalPos.add(t*SCALE*0.4, y*SCALE*0.7);
      d.opacity = 1 - (time() - d.time);
    });

    if (openMenu.type == 'deploy') {
      let mx;
      if (isMouseDown() && (deployCountDrag.isHovering() || deploySetBar.isHovering())) {
        let mx = mousePos().x / SCALE;
        let helperCount = Math.min(Math.max(
          Math.floor(8/5*mx + 1.25) -2
          ,1),9);
        let newPos = Math.min(Math.max(
          5/8 * Math.round(helperCount + 1)
          ,1.25),6.25); 
        deployCountDrag.pos.x = newPos*SCALE;
        deployCountDrag.scale = (helperCount + 15)/16;
        let majik = magicNumbers(helperCount);
        openMenu.data.sizeID = helperCount;
        deployMainText.text = `Deploying ${majik[0] * majik[1]}`;
      };
    };
};
