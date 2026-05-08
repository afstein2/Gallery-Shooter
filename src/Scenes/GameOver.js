class GameOver extends Phaser.Scene {

    constructor() {
        super("gameOverScene");
    }

    init(data) {
        this.finalScore = data.score || 0;

        // Get high score from local storage
        this.highScore = localStorage.getItem("highScore") || 0;

        // Convert string to number
        this.highScore = Number(this.highScore);

        // Update high score if player beat it
        if (this.finalScore > this.highScore) {
            this.highScore = this.finalScore;

            localStorage.setItem("highScore", this.highScore);
        }
    }

    create() {

        // Game Over title
        this.add.bitmapText(
            game.config.width / 2 - 120,
            game.config.height / 2 - 80,
            "rocketSquare",
            "GAME OVER",
            32
        );

        // Final score
        this.add.bitmapText(
            game.config.width / 2 - 120,
            game.config.height / 2,
            "rocketSquare",
            "Score: " + this.finalScore,
            24
        );

        // High score
        this.add.bitmapText(
            game.config.width / 2 - 120,
            game.config.height / 2 + 40,
            "rocketSquare",
            "High Score: " + this.highScore,
            24
        );

        // Return to start screen after delay
        this.time.delayedCall(5000, () => {
            this.scene.start("startScreenScene");
        });
    }
}