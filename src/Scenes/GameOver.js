class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene");
    }

    create() {
        // Gamer Over text
        this.add.text(game.config.width / 2, game.config.height / 2, "Game Over", {
            font: "64px Arial",
            fill: "#ff4444"
        }).setOrigin(0.5);

        // After delay, go back to the start screen
        this.time.delayedCall(2000, () => {
            this.scene.start("startScreenScene");
        });
    }
}