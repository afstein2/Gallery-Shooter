class StartScreen extends Phaser.Scene {

    constructor() {
        super("startScreenScene");
    }

    preload() {
        this.load.setPath("./assets/");

        document.getElementById('description').innerHTML =
            '<h2>Start Screen<br><br>Press SPACE to Start</h2>';
    }

    create() {

        // Title text
        this.add.text(400, 250, "Space Shooter", {
            font: "48px Arial",
            fill: "#ffffff"
        }).setOrigin(0.5);

        // Instruction text
        this.add.text(400, 350, "Press SPACE to Start", {
            font: "24px Arial",
            fill: "#aaaaaa"
        }).setOrigin(0.5);

        // Proper keyboard input (recommended Phaser way)
        this.spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }

    update() {
        // clean, frame-safe input check
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("shooterScene");
        }
    }
}