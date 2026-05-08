class StartScreen extends Phaser.Scene {

    constructor() {
        super("startScreenScene");
    }

    preload() {
        this.load.setPath("./assets/");

        document.getElementById('description').innerHTML =
            '<h2>Start Screen</h2>';

        // Load Kenney font for title
        this.load.bitmapFont(
            "rocketSquare",
            "KennyRocketSquare_0.png",
            "KennyRocketSquare.fnt"
        );
    }

    create() {

        // Background color
        this.cameras.main.setBackgroundColor("#000000");

        // Title text
        this.add.bitmapText(
            game.config.width / 2 - 150,
            100,
            "rocketSquare",
            "Space Shooter",
            32
        );

        // Shared button style
        const buttonStyle = {
            fontFamily: "Arial",
            fontSize: "24px",
            color: "#ffffff",
            backgroundColor: "#222222",
            padding: {
                left: 20,
                right: 20,
                top: 10,
                bottom: 10
            }
        };

        // START button
        const startButton = this.add.text(
            game.config.width / 2,
            250,
            "Start Game",
            buttonStyle
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // Keyboard input
        this.spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        // CONTROLS button
        const controlsButton = this.add.text(
            game.config.width / 2,
            340,
            "Controls",
            buttonStyle
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // CREDITS button
        const creditsButton = this.add.text(
            game.config.width / 2,
            430,
            "Credits",
            buttonStyle
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // Hover effects
        startButton.on("pointerover", () => {
            startButton.setStyle({ backgroundColor: "#444444" });
        });

        startButton.on("pointerout", () => {
            startButton.setStyle({ backgroundColor: "#222222" });
        });

        controlsButton.on("pointerover", () => {
            controlsButton.setStyle({ backgroundColor: "#444444" });
        });

        controlsButton.on("pointerout", () => {
            controlsButton.setStyle({ backgroundColor: "#222222" });
        });

        creditsButton.on("pointerover", () => {
            creditsButton.setStyle({ backgroundColor: "#444444" });
        });

        creditsButton.on("pointerout", () => {
            creditsButton.setStyle({ backgroundColor: "#222222" });
        });

        // Button actions
        startButton.on("pointerdown", () => {
            this.scene.start("shooterScene");
        });

        controlsButton.on("pointerdown", () => {
            this.scene.start("controlsScene");
        });

        creditsButton.on("pointerdown", () => {
            this.scene.start("creditsScene");
        });

        // Space key action
        this.spaceKey.on("down", () => {
            this.scene.start("shooterScene");
        });
    }
}