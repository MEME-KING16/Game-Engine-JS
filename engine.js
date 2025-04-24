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
    const loop = (timestamp) => {
        const canvas = document.getElementById(this.canvasId);
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let sprite of this.sprites) {
            if (this.physicsin) {
                sprite.speed = this.physics.calculateSpeed(0.016, sprite.speed);
                sprite.y = this.physics.calculateY(0.016, sprite.speed, sprite.y);
                sprite.y = Math.min(Math.max(sprite.y, 0), this.height - 12);
                sprite.x = Math.min(Math.max(sprite.x, 0), this.width);
            }

            let img = new Image();
            img.src = sprite.img;
            ctx.drawImage(img, sprite.x, sprite.y);
        }

        for (let script of this.updatescripts) {
            script();
        }

        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
}
}

class Sprite {
    constructor(img,cords) {
        if(!img)
        throw new Error("No sprite img given");
        if(!cords)
        throw new Error("No Starting cords given");
        if(!cords.x && cords.x != 0)
        throw new Error("No x cord given");
        if(!cords.y && cords.y != 0)
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
