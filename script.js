window.onload = () => {
    const snake = new Snake();
    snake.startGame();
}

class Snake {
    wallSize = 20;
    snake = [];
    deltaX = 0;
    deltaY = 0;
    food = {
        x: 0,
        y: 0,
        color: "white"
    };
    score = 0;

    constructor() {
        this.errorSound = new Audio("./sounds/error.mp3");
        this.successSound = new Audio("./sounds/success.mp3");
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.scoreSpan = document.getElementById("score");
        document.querySelectorAll("input").forEach(button => {
            button.addEventListener("click", this.buttonClick);
        });
        document.addEventListener("keydown", this.keyDown);
    }

    buttonClick = (event) => {
        event.keyCode = Number(event.target.id);
        this.keyDown(event);
    }

    keyDown = (event) => {
        switch (event.keyCode) {
            case 39: //right
            case 68:
                this.deltaX = this.wallSize;
                this.deltaY = 0;
                break;
            case 37: //left
            case 65:
                this.deltaX = -this.wallSize;
                this.deltaY = 0;
                break;
            case 38: //up
            case 87:
                this.deltaX = 0;
                this.deltaY = -this.wallSize;
                break;
            case 40: //down
            case 83:
                this.deltaX = 0;
                this.deltaY = this.wallSize;
                break;
        }
    }

    getRandomNumber = (maxNumber) => {
        return Math.random() * maxNumber;
    }

    clearMap = () => {
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawSnake = () => {
        this.context.strokeStyle = document.getElementById("snake-color").value;
        this.context.lineJoin = "bevel"
        this.snake.forEach((value, index) => {
            if (index === 0) {
                this.context.lineWidth = 6; 
                this.context.strokeRect(value.x, value.y, this.wallSize, this.wallSize);
                return;
            } 
            this.context.lineWidth = 2;
            this.context.strokeRect(value.x, value.y, this.wallSize, this.wallSize);
        });
    }

    makeSnake = (size) => {
        for (let i = 0; i < size; i++) {
            const x = this.canvas.width / 2 + i * this.wallSize;
            const y = this.canvas.width / 2;
            this.snake.push({x, y});
        }
    }

    moveSnake = (deltaX, deltaY) => {
        const x = this.snake[0].x + deltaX;
        const y = this.snake[0].y + deltaY;
        this.snake.unshift({x, y});
        this.snake.pop();
    }

    restartGame = () => {
        this.score = 0;
        this.setScore();
        this.randomFood();
        this.snake = [];
        this.makeSnake(5);
        this.deltaX = 0;
        this.deltaY = 0;
    }

    foodCollision = () => {
        if (this.food.x === this.snake[0].x && this.food.y === this.snake[0].y) {
            this.score++;
            this.setScore();
            this.successSound.play();
            this.snake.push(Object.assign({}, this.snake[this.snake.length - 1]));
            this.randomFood();
        }
    }

    snakeCollision = () => { 
        this.snake.forEach((value, index) => {
            if (index !== 0) {
                if (value.x === this.snake[0].x && value.y === this.snake[0].y) { 
                    this.errorSound.play();
                    this.restartGame();
                } 
            }
        });
    } 

    wallCollision = () => {
        this.snake.forEach(value => {
            if (value.x > this.canvas.width || value.x < 0 || value.y < 0 || value.y > this.canvas.height) {
                this.errorSound.play();
                this.restartGame();
            }
        });
    }

    randomFood = () => {
        const randV = (min, max) => {
            return Math.floor( (Math.random() * (max-min) + min) / this.wallSize ) * this.wallSize;
        }
        this.food.color = `rgb(
        ${this.getRandomNumber(255)},
        ${this.getRandomNumber(255)},
        ${this.getRandomNumber(255)})`;
        let x = randV(this.wallSize, this.canvas.width - this.wallSize);
        let y = randV(this.wallSize, this.canvas.height - this.wallSize);
        this.snake.forEach(value => {
            while (value.x === x && value.y == y) { 
                x = randV(this.wallSize, this.canvas.width - this.wallSize);
                y = randV(this.wallSize, this.canvas.height - this.wallSize);
            } 
        });
        this.food.x = x;
        this.food.y = y;
    }

    drawFood = () => {
        this.context.fillStyle = this.food.color;
        this.context.fillRect(this.food.x, this.food.y, this.wallSize, this.wallSize);
    }

    setScore = () => {
        this.scoreSpan.textContent = this.score;
    }

    startGame = () => {
        this.restartGame();
        setInterval(() => {
            this.clearMap();
            this.foodCollision();
            this.snakeCollision();
            this.wallCollision();
            if (this.deltaX !== 0 || this.deltaY !== 0) {
                this.moveSnake(this.deltaX, this.deltaY);
            }
            this.drawFood();
            this.drawSnake();
        }, 100);
    }
}
