const STUFF = {
  player: {
    bow: 'handmade',
  },
  helpers: [],
  money: 0,
  wallHealth: 100,
}

const BOWS = {
  handmade: {
    name: 'Handmade Bow',
    desc: 'Not exactly the most well crafted, but it gets the job done... usually.',
    speed: 16,
    cooldown: 1,
    damage: 5,
    range: 10,
    special: [],
  },
};

const MELEE = {
  stick: {
    name: 'Sharpened Stick',
    desc: 'Cheap and plentiful, but definitely not ideal.',
    cooldown: 0.6,
    range: 0.8,
    damage: 2,
    style: 'stab',
    special: [],
  },
  shortsword: {
    name: 'Shortsword',
    desc: 'Easy to maneuver, but, well, short.',
    cooldown: 0.8,
    range: 0.9,
    damage: 5,
    style: 'slice',
    special: [],
  },
};

const PEOPLE = {
  basicBow: {
    health: 10,
    speed: 1.3,
    weapon: 'ranged:handmade',
  },
  basicSword: {
    health: 10,
    speed: 1,
    weapon: 'melee:shortsword',
  },
};
