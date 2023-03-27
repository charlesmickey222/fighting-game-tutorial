const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0,1024,576);
const gravity = 0.6;


const background = new Sprite({
  position:{
    x:0,
    y:0
  },
  imgSrc: './img/background.png'
})
const shop = new Sprite({
  position:{
    x:600,
    y:160
  },
  imgSrc: './img/shop.png',
  scale:2.5,
  framesMax:6,
})
const player = new Fighter({
  position: {
  x:0,
  y:0},
  velocity:{
    x:0,
    y:10
  },
  offset:{
    x:0,
    y:0,
  },
  imgSrc : './img/samuraiMack/Idle.png',
  framesMax:8,
  scale:1.5,
  offset:{
    x:100,
    y:37,
  },
  sprites:{
    idle:{
      imgSrc:'./img/samuraiMack/Idle.png',
      framesMax:8
    },
    run:{
      imgSrc:'./img/samuraiMack/Run.png',
      framesMax:8
    },
    jump:{
      imgSrc:'./img/samuraiMack/Jump.png',
      framesMax:2
    },
    fall:{
      imgSrc:'./img/samuraiMack/Fall.png',
      framesMax:2
    },
    attack1:{
      imgSrc:'./img/samuraiMack/Attack1.png',
      framesMax:6
    },
    takeHit:{
      imgSrc:'./img/samuraiMack/Take hit 2.png',
      framesMax:4
    },
    death:{
      imgSrc:'./img/samuraiMack/Death.png',
      framesMax:6
    }
  },
  attackBox:{
    offset:{
      x:30,
      y:75,
    },
    width:130,
    height:30
  }
})

const enemy =  new Fighter({
  position: {
    x:500,
    y:100
  },
  velocity:{
    x:0,
    y:10
  },
  offset:{
    x:100,
    y:45,
  },
  imgSrc : './img/kenji/Idle.png',
  framesMax:4,
  scale:1.5,
  sprites:{
    idle:{
      imgSrc:'./img/kenji/Idle.png',
      framesMax:4
    },
    run:{
      imgSrc:'./img/kenji/Run.png',
      framesMax:8
    },
    jump:{
      imgSrc:'./img/kenji/Run.png',
      framesMax:2
    },
    fall:{
      imgSrc:'./img/kenji/Fall.png',
      framesMax:2
    },
    attack1:{
      imgSrc:'./img/kenji/Attack1.png',
      framesMax:4
    },
    takeHit:{
      imgSrc:'./img/kenji/Take hit.png',
      framesMax:3
    },
    death:{
      imgSrc:'./img/kenji/Death.png',
      framesMax:7
    }
  },
  attackBox:{
    offset:{
      x:-80,
      y:75,
    },
    width:140,
    height:30
  }
})

const keys = {
  a:{
    pressed: false
  },
  d:{
    pressed:false
  },
  w:{
    pressed:false
  },
  j:{
    pressed:false
  },
  l:{
    pressed:false
  },
  i:{
    pressed:false
  }
}
let lastKey;

timerTick()

function animate(){
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0,0,1024,576)
  background.update()
  shop.update()
  player.update()
  enemy.update()
  player.velocity.x = 0
  enemy.velocity.x = 0;
  if(keys.a.pressed && player.lastKey === 'a'){
    player.switchSprite('run')
    player.velocity.x =-5;
  }else if (keys.d.pressed && player.lastKey === 'd'){
    player.switchSprite('run')
    player.velocity.x = 5;
  }else{
    player.switchSprite('idle')
  }
  if(player.velocity.y <0){
    player.switchSprite('jump')
  }else if(player.velocity.y>0){
    player.switchSprite('fall')
  }


  if(keys.j.pressed && enemy.lastKey === 'j'){
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  }else if (keys.l.pressed && enemy.lastKey === 'l'){
    enemy.velocity.x = 5;
    enemy.switchSprite('run')
  }else{
    enemy.switchSprite('idle')
  }
  if(enemy.velocity.y <0){
    enemy.switchSprite('jump')
  }else if(enemy.velocity.y>0){
    enemy.switchSprite('fall')
  }

  if (rectangularCollision({rect1:player,rect2:enemy}) && player.isAttacking && player.framesCurrent === 4){
    enemy.takeHit()
    document.querySelector('#enemy-health').style.width = `${enemy.health}%`;
    player.isAttacking = false
  }
  if(player.isAttacking && player.framesCurrent === player.sprites.attack1.framesMax){
    player.isAttacking = false;
  }

  if (rectangularCollision({rect1:enemy,rect2:player}) && enemy.isAttacking && enemy.framesCurrent === 2){
    player.takeHit()
    document.querySelector('#player-health').style.width = `${player.health}%`;
    enemy.isAttacking = false
  }

  if(enemy.isAttacking && enemy.framesCurrent === enemy.sprites.attack1.framesMax){
    enemy.isAttacking = false;
  }

  if(enemy.health <= 0 || player.health <= 0){
    checkWinner({player,enemy, timerId})
  }
}

animate()

window.addEventListener('keydown',(evt)=>{
  if(!player.dead){
  switch(evt.key){
    case 'd':
      keys.d.pressed = true;

      player.lastKey='d'
      break
    case 'a':
      keys.a.pressed = true;
      player.lastKey='a'

      break
    case 'w':
      keys.w.pressed = true;
      player.velocity.y = -17;
      break
    case 'c':
      player.attack()
      break
    }
  }
  if(!enemy.dead){
    switch(evt.key){
    case 'j':
      keys.j.pressed = true;
      enemy.lastKey = 'j'
      break
    case 'l':
      keys.l.pressed = true;
      enemy.lastKey='l'
      break
    case 'i':
      keys.i.pressed = true;
      enemy.velocity.y = -17;
      break
    case 'n':
      enemy.attack()
      break
  }}
})

addEventListener('keyup',(evt)=>{
  switch(evt.key){
    case 'd':
      keys.d.pressed = false;
      break
    case 'a':
      keys.a.pressed = false;
      break
    case 'w':
      keys.w.pressed = false;
      break
    case 'j':
      keys.j.pressed = false;
      break
    case 'l':
      keys.l.pressed = false;
      break
    case 'i':
      keys.i.pressed = false;
      break
  }
})
