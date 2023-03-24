
function rectangularCollision({rect1,rect2}){
  return(rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x && 
    rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
    rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
    rect1.attackBox.position.y <= rect2.position.y + rect2.height &&
    rect1.isAttacking)
}

function checkWinner({player,enemy, timerId}){
clearTimeout(timerId)
if (player.health === enemy.health){
  document.querySelector('#message').innerHTML = 'tie'
}else if(player.health>enemy.health){
  document.querySelector('#message').innerHTML = 'p1 wins'
}else{
  document.querySelector('#message').innerHTML = 'p2 wins'
}
document.querySelector('#message').style.display = 'flex'
}
let timer = 60;
let timerId;
function timerTick(){
  if (timer > 0){
  timerId = setTimeout(timerTick, 1000)
  timer--
  document.querySelector('#timer').innerHTML = timer;
  }
  if(timer === 0){
    checkWinner({player,enemy, timerId})
  }
}
