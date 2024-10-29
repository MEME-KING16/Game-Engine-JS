class GameEngine {
    constructor(opt) {
        this.width = opt.width
        this.height = opt.height
        this.canvasId = opt.canvasId
        this.sprites = []
        this.updatescripts = []
        this.physicsin = false
        this.physics = null
        if(!document.getElementById(this.canvasId)) {
            throw new Error("Canvas with the id \""+this.canvasId+"\" doen\'t exist ");
            
        }
        document.getElementById(this.canvasId).width = this.width
        document.getElementById(this.canvasId).height = this.height
    }
    addSprite(sprite) {
        if(!sprite)
        throw new Error("Sprite parameter is undefined");
        if(!(sprite instanceof Sprite))
        throw new Error("Sprite parameter is not a instance of Sprite");
        this.sprites.push(sprite)
        const canvas = document.getElementById(this.canvasId);
        const ctx = canvas.getContext("2d");
        let img = document.createElement("img")
        img.setAttribute("src",sprite.img)
        setTimeout(()=>{ctx.drawImage(img, sprite.x, sprite.y);}, 10)
        
    }
    onUpdate(script) {
    this.updatescripts.push(script)
    }
    onKeyDown(key,script) {
        addEventListener("keydown", (event) => {
            if(event.key == key) {
                script()
            }
        });
    }
    addPhysics(physics) {
        if(!physics)
            throw new Error("Physics parameter is undefined");
            if(!(physics instanceof Physics))
            throw new Error("Physics parameter is not a instance of Physics");
        this.physicsin = true
        this.physics = physics
    }
    start() {
        setInterval(() => {
            const canvas = document.getElementById(this.canvasId);
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let index = 0; index < this.sprites.length; index++) {
            if (this.physicsin) {
                this.sprites[index].speed = this.physics.calculateSpeed(0.01,this.sprites[index].speed)
                this.sprites[index].y = this.physics.calculateY(0.01,this.sprites[index].speed,this.sprites[index].y)
                console.log(this.physics.calculateY(0.01,this.sprites[index].speed,this.sprites[index].y),this.sprites[index].speed)
                if(this.sprites[index].y > this.height -12)
                this.sprites[index].y = this.height -12
                if(this.sprites[index].y < 0)
                this.sprites[index].y = 0
                if(this.sprites[index].x > this.width)
                    this.sprites[index].x = this.width
                if(this.sprites[index].x < 0)
                    this.sprites[index].x = 0
            }
            const sprite = this.sprites[index]
            let img = document.createElement("img")
            img.setAttribute("src",sprite.img)
            ctx.drawImage(img, sprite.x, sprite.y);
            
        }
        }, 10);
    }
}

class Sprite {
    constructor(img,cords) {
        if(!img)
        throw new Error("No sprite img given");
        if(!cords)
        throw new Error("No Starting cords given");
        if(!cords.x)
        throw new Error("No x cord given");
        if(!cords.y)
        throw new Error("No y cord given");
        
        this.img = img
        this.x = cords.x
        this.y = cords.y
        this.speed = 0
    }
    move(x,y) {
        this.x = this.x + x
        this.y = this.y + y
    }
}

class Physics {
    constructor(opt) {
        this.gravity = opt.gravity
    }
     calculateY(time,initSpeed,initY) {
        return initY + initSpeed * time + this.gravity * (time*time) / 2
     }
     calculateSpeed(time,initSpeed) {
        return initSpeed+this.gravity*time
     }
}

const game = new GameEngine({
    width: 800,
    height: 600,
    canvasId: 'gameCanvas',
  });
  
  // Add player sprite
  const player = new Sprite('https://www.w3schools.com/favicon-16x16.png', { x: 1, y: 1 });
 game.onKeyDown('ArrowRight',()=>{player.x += 1})
      
 game.onKeyDown('ArrowLeft',()=>{player.x -= 1})
 game.onKeyDown(' ',()=>{player.speed = -25})
      

  
   // Handle physics
   const gravity = new Physics({ gravity: 9.8 });
   game.addPhysics(gravity);
   game.addSprite(player);
   game.start()
  
//   // Add AI for enemy NPCs
//   const enemyAI = new AI();
//   enemyAI.on('detectPlayer', () => {
//     // AI logic to chase the player
//   });
//   game.addAI(enemyAI);
  
//   // Start game
//   game.start();
  