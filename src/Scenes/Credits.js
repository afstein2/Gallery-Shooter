class Credits extends Phaser.Scene {

    constructor() {
        super("creditsScene");
    }

    create() {

        // Background color
        this.cameras.main.setBackgroundColor("#000000");

        // Title (bitmap font)
        this.add.bitmapText(
            game.config.width / 2 - 90,
            60,
            "rocketSquare",
            "CREDITS",
            32
        );

        // Shared body text style
        const bodyStyle = {
            fontFamily: "Arial",
            fontSize: "20px",
            color: "#ffffff",
            align: "left"
        };

        const smallBodyStyle = {
            fontFamily: "Arial",
            fontSize: "16px",
            color: "#cccccc",
            align: "left"
        };

        // Developer section
        this.add.text(
            120,
            150,
            "Developer",
            {
                fontFamily: "Arial Black",
                fontSize: "24px",
                color: "#ffffff"
            }
        );

        this.add.text(
            120,
            185,
            "Allie Stein",
            bodyStyle
        );

        // Assets section
        this.add.text(
            120,
            260,
            "Assets",
            {
                fontFamily: "Arial Black",
                fontSize: "24px",
                color: "#ffffff"
            }
        );

        this.add.text(
            120,
            295,
            "- Kenny Alien UFO Pack\n- Kenny Particle Pack\n- Kenny Space Shooter Extension Pack\n- Kenny Rocket Square Font",
            smallBodyStyle
        );

        // Audio section
        this.add.text(
            120,
            400,
            "Audio",
            {
                fontFamily: "Arial Black",
                fontSize: "24px",
                color: "#ffffff"
            }
        );

        this.add.text(
            120,
            435,
            "Custom sound effects created by\nAllie Stein",
            smallBodyStyle
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