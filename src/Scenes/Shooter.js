class Shooter extends Phaser.Scene {
    constructor() {
        super("shooterScene");

        // Initialize a class variable "my" which is an object.
        // The object has two properties, both of which are objects
        //  - "sprite" holds bindings (pointers) to created sprites
        //  - "text"   holds bindings to created bitmap text objects
        this.my = {sprite: {}, text: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];
        this.my.sprite.zigzagEnemies = [];  // all zig-zag path enemies (original + clones)
        this.my.sprite.enemyBullets = [];    // bullets fired by zigzag enemies
        this.maxBullets = 10;           // Don't create more than this many bullets

        this.my.sprite.enemy2 = [];

        this.waveNumber   = 0;   // incremented before each spawn, so wave 1 starts with 2 enemies
        this.enemiesAlive = 0;   // decremented on each kill; hits 0 = next wave
        
        this.myScore = 0;       // record a score as a class variable
        // More typically want to use a global variable for score, since
        // it will be used across multiple scenes

        this.myHealth = 100;    // record health as a class variable
    }


    initGame() {
        let my = this.my;

        this.waveNumber   = 0;
        this.enemiesAlive = 0;
        this.myScore      = 0;
        this.myHealth     = 100;

        // Destroy any leftover zigzag enemies from the previous run
        for (let enemy of my.sprite.zigzagEnemies) {
            enemy.destroy();
        }

        my.sprite.zigzagEnemies = [];

        // Destroy any leftover bullets
        for (let bullet of my.sprite.bullet) {
            bullet.destroy();
        }

        my.sprite.bullet = [];
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("spaceship", "spaceship.png");
        this.load.image("bullet", "bullet.png");
        this.load.image("enemy", "enemy.png");
        this.load.image("enemy2", "SucideEnemy.png");

        // For animation
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        // Load the Kenny Rocket Square bitmap font
        // This was converted from TrueType format into Phaser bitmap
        // format using the BMFont tool.
        // BMFont: https://www.angelcode.com/products/bmfont/
        // Tutorial: https://dev.to/omar4ur/how-to-create-bitmap-fonts-for-phaser-js-with-bmfont-2ndc
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        // Sound asset from the Kenny Music Jingles pack
        // https://kenney.nl/assets/music-jingles
        // Upon pain of 💀 do not use in your game projects. 
        // (It's that bad)
        this.load.audio("dadada", "jingles_NES13.ogg");
    }

    create() {
        let my = this.my;


        // Initialize the game
        this.initGame();

        my.sprite.spaceship = this.add.sprite(game.config.width/2, game.config.height - 40, "spaceship");
        my.sprite.spaceship.setScale(0.25);

        // Define a Spline path that sweeps across the upper portion of the screen
        this.enemyPath = new Phaser.Curves.Spline([
            100, 60,
            300, 140,
            500, 60,
            700, 140,
            500, 60,
            300, 140,
            100, 60,
        ]);

        // enemy2: plain sprite that homes in on the player in real time
        // my.sprite.enemy2 = this.add.sprite(150, 20, "enemy2");
        // my.sprite.enemy2.setScale(0.25);
        // my.sprite.enemy2.scorePoints = 25;
        this.enemy2Speed = 120;   // pixels per second toward the player

        // Notice that in this approach, we don't create any bullet sprites in create(),
        // and instead wait until we need them, based on the number of space bar presses

        // Create white puff animation
        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 20,    // Note: case sensitive (thank you Ivy!)
            repeat: 5,
            hideOnComplete: true
        });

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("N");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/sec)
        this.playerSpeed = 300;
        this.bulletSpeed = 300;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Shooter.js<br><br>Space - shoot <br>A - move left<br> D - move right</h2>'

        // Put score on screen
        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);

        // Put wave number on screen
        my.text.wave = this.add.bitmapText(300, 0, "rocketSquare", "Wave " + this.waveNumber);

        // Put Health Percentage on screen
        my.text.health = this.add.bitmapText(10, 0, "rocketSquare", "Health " + this.myHealth + "%");


        // Kick off the first wave
        this.spawnWave();

    }


    // Spawns one new enemy2 at a random top position
    spawnEnemy2() {
        let e2 = this.add.sprite(
            Phaser.Math.Between(50, game.config.width - 50),
            20,
            "enemy2"
        );
        e2.setScale(0.25);
        e2.scorePoints = 25;
        this.my.sprite.enemy2.push(e2);
    }

    update(time, delta) {
        let my = this.my;
        let dt = delta / 1000;

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.spaceship.x > (my.sprite.spaceship.displayWidth/2)) {
                my.sprite.spaceship.x -= this.playerSpeed * dt;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.spaceship.x < (game.config.width - (my.sprite.spaceship.displayWidth/2))) {
                my.sprite.spaceship.x += this.playerSpeed * dt;
            }
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.length < this.maxBullets) {
                let bullet = this.add.sprite(
                    my.sprite.spaceship.x,
                    my.sprite.spaceship.y - (my.sprite.spaceship.displayHeight / 2),
                    "bullet"
                );

                bullet.angle = 90; // temporary rotation
                my.sprite.bullet.push(bullet);
            }
        }

        // Remove all of the bullets which are offscreen
        // filter() goes through all of the elements of the array, and
        // only returns those which **pass** the provided test (conditional)
        // In this case, the condition is, is the y value of the bullet
        // greater than zero minus half the display height of the bullet? 
        // (i.e., is the bullet fully offscreen to the top?)
        // We store the array returned from filter() back into the bullet
        // array, overwriting it. 
        // This does have the impact of re-creating the bullet array on every 
        // update() call. 
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        // Check for collision with zig-zag enemies (all waves)
        my.sprite.zigzagEnemies = my.sprite.zigzagEnemies.filter(enemy => {
            for (let bullet of my.sprite.bullet) {
                if (this.collides(enemy, bullet)) {
                    this.puff = this.add.sprite(enemy.x, enemy.y, "whitePuff03").setScale(0.25).play("puff");
                    bullet.y = -100;
                    enemy.stopFollow();
                    enemy.destroy();
                    this.myScore += enemy.scorePoints;
                    this.updateScore();
                    this.sound.play("dadada", { volume: 1 });
                    // Decrement alive count — if zero, start next wave
                    this.enemiesAlive--;
                    if (this.enemiesAlive <= 0) {
                        this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                            this.spawnWave();
                        }, this);
                    }
                    return false;   // remove from array
                }
            }
            return true;
        });

        // enemy2: homing, bullet collision, ram collision
        my.sprite.enemy2 = my.sprite.enemy2.filter(e2 => {
            if (!e2.visible) return true;

            // Check player bullet hits
            for (let bullet of my.sprite.bullet) {
                if (this.collides(e2, bullet)) {
                    this.puff = this.add.sprite(e2.x, e2.y, "whitePuff03").setScale(0.25).play("puff");
                    bullet.y = -100;
                    e2.visible = false;
                    e2.x = -100;
                    this.myScore += e2.scorePoints;
                    this.updateScore();
                    this.sound.play("dadada", { volume: 1 });
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        e2.x = Phaser.Math.Between(50, game.config.width - 50);
                        e2.y = 20;
                        e2.visible = true;
                    }, this);
                    return true;
                }
            }

            // Home toward player
            let dx = my.sprite.spaceship.x - e2.x;
            let dy = my.sprite.spaceship.y - e2.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 1) {
                e2.x += (dx / dist) * this.enemy2Speed * dt;
                e2.y += (dy / dist) * this.enemy2Speed * dt;
            }

            // Ram the player
            if (this.collides(e2, my.sprite.spaceship)) {
                this.puff = this.add.sprite(e2.x, e2.y, "whitePuff03").setScale(0.25).play("puff");
                e2.visible = false;
                e2.x = -100;
                this.myHealth -= 20;
                this.updateHealth();
                if (this.myHealth <= 0) {
                    this.scene.start("gameOverScene");
                }
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    e2.x = Phaser.Math.Between(50, game.config.width - 50);
                    e2.y = 20;
                    e2.visible = true;
                }, this);
            }

            return true;
        });

        // Move enemy bullets downward and check collision with player
        my.sprite.enemyBullets = my.sprite.enemyBullets.filter(eb => {
            eb.y += 250 * dt;

            if (eb.y > game.config.height + eb.displayHeight) {
                eb.destroy();
                return false;
            }

            if (this.collides(eb, my.sprite.spaceship)) {
                eb.destroy();
                this.myHealth -= 10;
                this.updateHealth();
                if (this.myHealth <= 0) {
                    this.scene.start("gameOverScene");
                }
                return false;
            }

            return true;
        });

        // Move all player bullets
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed * dt;
        }

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("singleBullet");
        }

    }

    // A center-radius AABB collision check
    collides(a, b) {
        
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {

        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
       
    }

    updateHealth() {

        let my = this.my;
        my.text.health.setText("Health " + this.myHealth + "%");
    }

    spawnWave() {
        let my = this.my;
        this.waveNumber++;

        // Every 2 waves, add one more enemy2
        let expectedEnemy2Count = 1 + Math.floor((this.waveNumber - 1) / 2);
        while (my.sprite.enemy2.length < expectedEnemy2Count) {
            this.spawnEnemy2();
        }

        // Build randomized zig-zag path
        const points = [];
        for (let i = 0; i < 6; i++) {
            let x;
            if (i % 2 === 0) {
                x = Phaser.Math.Between(50, 300);
            } else {
                x = Phaser.Math.Between(500, 750);
            }
            const y = Phaser.Math.Between(40, 200);
            points.push(x, y);
        }

        this.enemyPath = new Phaser.Curves.Spline(points);
        my.text.wave.setText("Wave " + this.waveNumber);

        // Wave 1 = 2 enemies, wave 2 = 3, etc.
        const count = 1 + this.waveNumber;

        for (let i = 0; i < count; i++) {
            const startAt = i / count;
            let enemy = this.add.follower(this.enemyPath, 100, 150, "enemy");
            enemy.setScale(0.25);
            enemy.scorePoints = 25;
            enemy.startFollow({
                duration: 8000,
                repeat: -1,
                rotateToPath: false,
                startAt: startAt
            });
            my.sprite.zigzagEnemies.push(enemy);
        }

        this.enemiesAlive = count;

        // Enemy shooting timer
        if (this.enemyFireTimer) this.enemyFireTimer.remove();
        this.enemyFireTimer = this.time.addEvent({
            delay: 800,
            loop: true,
            callback: () => {
                let alive = this.my.sprite.zigzagEnemies;
                if (alive.length === 0) return;
                for (let shooter of alive) {
                    if (Phaser.Math.Between(0, 1) === 0) {
                        let eb = this.add.sprite(shooter.x, shooter.y, "bullet");
                        eb.setScale(0.2);
                        this.my.sprite.enemyBullets.push(eb);
                    }
                }
            }
        });
    }
}