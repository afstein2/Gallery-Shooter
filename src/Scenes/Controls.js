class Controls extends Phaser.Scene {

    constructor() {
        super("controlsScene");
    }

    create() {

        // Background color
        this.cameras.main.setBackgroundColor("#000000");

        // Title (bitmap font)
        this.add.bitmapText(
            game.config.width / 2 - 110,
            60,
            "rocketSquare",
            "CONTROLS",
            32
        );

        // Shared styles
        const headerStyle = {
            fontFamily: "Arial Black",
            fontSize: "24px",
            color: "#ffffff"
        };

        const bodyStyle = {
            fontFamily: "Arial",
            fontSize: "20px",
            color: "#cccccc"
        };

        // Movement section
        this.add.text(
            120,
            160,
            "Movement",
            headerStyle
        );

        this.add.text(
            120,
            205,
            "A",
            bodyStyle
        );

        this.add.text(
            200,
            205,
            "- Move Left",
            bodyStyle
        );

        this.add.text(
            120,
            240,
            "D",
            bodyStyle
        );

        this.add.text(
            200,
            240,
            "- Move Right",
            bodyStyle
        );

        this.add.text(
            120,
            275,
            "SPACE",
            bodyStyle
        );

        this.add.text(
            200,
            275,
            "- Shoot",
            bodyStyle
        );

        // Return message
        this.add.text(
            game.config.width / 2 - 140,
            540,
            "Press SPACE to return to menu",
            {
                fontFamily: "Arial",
                fontSize: "18px",
                color: "#ffff66"
            }
        );

        // Keyboard input
        this.spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("startScreenScene");
        }
    }
}