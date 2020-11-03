/**
 * Main class of this Game.
 */
class Game {

    private canvas: HTMLCanvasElement;

    private ballRadius: number;
    private ballPositionX: number;
    private ballPositionY: number;
    private ballSpeedX: number;
    private ballSpeedY: number;

    private playerPositionX: number;

    public static readonly WINDOW_WIDTH_OFFSET = 1;
    public static readonly WINDOW_HEIGHT_OFFSET = 4;

    public static readonly GRAVITY = 0.98;
    public static readonly FULL_CIRCLE = 2 * Math.PI;

    public static readonly MIN_BALL_RADIUS = 25;
    public static readonly BALL_RADIUS_SCATTER = 25;
    public static readonly MIN_BALL_X_SPEED = -50;
    public static readonly BALL_X_SPEED_SCATTER = 100;
    public static readonly MIN_BALL_Y_SPEED = 0;
    public static readonly BALL_Y_SPEED_SCATTER = 0;
    public static readonly BALL_Y_POSITION_AREA = 0.2;
    public static readonly BALL_COLOR = 'blue';

    public static readonly PLAYER_BALL_RADIUS = 50;
    public static readonly PLAYER_COLOR = 'red';

    public constructor(canvas: HTMLElement) {
        this.canvas = <HTMLCanvasElement>canvas;
        
        // Resize the canvas to full window size minus some small offset
        this.canvas.width = window.innerWidth - Game.WINDOW_WIDTH_OFFSET;
        this.canvas.height = window.innerHeight - Game.WINDOW_HEIGHT_OFFSET; 
        
        // Spawn a Ball
        this.ballRadius = Game.MIN_BALL_RADIUS + 
            Game.BALL_RADIUS_SCATTER * Math.random();
        this.ballSpeedX = Game.MIN_BALL_X_SPEED + 
            Game.BALL_X_SPEED_SCATTER * Math.random();
        this.ballSpeedY = Game.MIN_BALL_Y_SPEED + 
            Game.BALL_Y_SPEED_SCATTER * Math.random();
        this.ballPositionX = this.ballRadius +  
            (this.canvas.width - 2 * this.ballRadius)*Math.random();
        this.ballPositionY = 
            this.canvas.height * (1 - Game.BALL_Y_POSITION_AREA) + 
            this.canvas.height * Game.BALL_Y_POSITION_AREA * Math.random();
        
        // Set the player at the center
        this.playerPositionX = this.canvas.width / 2;

        // Start the animation
        console.log('start animation');
        requestAnimationFrame(this.animate);
    }


    /**
     * This MUST be an arrow method in order to keep the `this` variable 
     * working correctly. It will be overwritten by another object otherwise
     * caused by javascript scoping behaviour.
     */
    animate = () => {
        this.move();
        this.collide();
        const gameover = this.adjust();
        this.draw();

        // Call this method again on the next animation frame
        // A quick-and-dirty game over situation: just stop animating :/
        // The user must hit F5 to reload the game
        if (!gameover) {
            requestAnimationFrame(this.animate);
        }
    }

    /**
     * Move the items over the scene
     */
    private move() {
        // calculate the new position of the ball
        // Some physics here: the y-portion of the speed changes due to gravity
        // Formula: Vt = V0 + gt
        // 9.8 is the gravitational constant and time=1
        this.ballSpeedY -= Game.GRAVITY;
        // Calculate new X and Y parts of the position 
        // Formula: S = v*t
        this.ballPositionX += this.ballSpeedX;
        // Formula: S=v0*t + 0.5*g*t^2
        this.ballPositionY += this.ballSpeedY + 0.5 * Game.GRAVITY;
    }

    /**
     * Check if gameitems are colliding, and handle them.
     */
    private collide() {
        // check if the ball hits the walls and let it bounce
        // Left wall
        this.ballPositionX >= this.canvas.width - this.ballRadius;
        if (this.ballPositionX <= this.ballRadius && this.ballSpeedX < 0) {
            this.ballSpeedX = -this.ballSpeedX;
        }
        // Right wall
        if (this.ballPositionX >= this.canvas.width - this.ballRadius
            && this.ballSpeedX > 0) {
            this.ballSpeedX = -this.ballSpeedX;
        }

        // Bottom only (ball will always come down)
        if (this.ballPositionY <= this.ballRadius && this.ballSpeedY < 0) {
            this.ballSpeedY = -this.ballSpeedY;
        }
    }

    /**
     * Adjust the game state if needed
     */
    private adjust() {
        // Check if the ball collides with the player. It's game over then
        const distX = this.playerPositionX - this.ballPositionX;
        const distY = 50 - this.ballPositionY;
        // Calculate the distance between ball and player using Pythagoras'
        // theorem
        const distance = Math.sqrt(distX * distX + distY * distY);
        // Collides is distance <= sum of radii of both circles
        const gameover = distance <= (this.ballRadius + Game.PLAYER_BALL_RADIUS);
        return gameover;
    }

    /**
     * Draw the scene on the screen.
     */
    private draw() {
        // Get the canvas rendering context
        const ctx = this.canvas.getContext('2d');
        // Clear the entire canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the player
        ctx.fillStyle = Game.PLAYER_COLOR;
        ctx.beginPath();
        const playerPositionY = this.canvas.height - Game.PLAYER_BALL_RADIUS;
        ctx.ellipse(this.playerPositionX, playerPositionY, 
            Game.PLAYER_BALL_RADIUS, Game.PLAYER_BALL_RADIUS, 0, 0, Game.FULL_CIRCLE);
        ctx.fill();

        // Draw the ball
        ctx.fillStyle = Game.BALL_COLOR;
        ctx.beginPath();
        // reverse height, so the ball falls down
        const y = this.canvas.height - this.ballPositionY;
        ctx.ellipse(this.ballPositionX, y, this.ballRadius, this.ballRadius, 
            0, 0, Game.FULL_CIRCLE);
        ctx.fill();
    }
}