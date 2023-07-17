// create the application
let app = new PIXI.Application({
    width: 800,
    height: 500,
    backgroundColor: 0x000000
});
document.body.appendChild(app.view);

// player's spaceship
let spaceship = new PIXI.Graphics();
spaceship.beginFill(0x00FF00);
spaceship.drawRect(0, 0, 50, 50);
spaceship.endFill();
spaceship.x = app.screen.width / 2;
spaceship.y = app.screen.height - spaceship.height;
app.stage.addChild(spaceship);

// enemies
let enemies = new PIXI.Container();
app.stage.addChild(enemies);

// function to create enemy
function createEnemy(x, y) {
    let enemy = new PIXI.Graphics();
    enemy.beginFill(0xFF0000);
    enemy.drawRect(0, 0, 50, 50);
    enemy.endFill();
    enemy.x = x;
    enemy.y = y;
    enemies.addChild(enemy);
}

// create enemies
function createEnemies() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 3; j++) {
            createEnemy(i * 60 + 100, j * 60);
        }
    }
}

createEnemies();

// bullets
let bullets = new PIXI.Container();
app.stage.addChild(bullets);

// function to create bullet
let bulletOnScreen = false;
function createBullet(x, y) {
    if (!bulletOnScreen) {
        let bullet = new PIXI.Graphics();
        bullet.beginFill(0xFFFFFF);
        bullet.drawCircle(0, 0, 5);
        bullet.endFill();
        bullet.x = x;
        bullet.y = y;
        bullets.addChild(bullet);
        bulletOnScreen = true;
        bulletSound.play(); // Moved here to only play sound when bullet is actually fired
    }
}

let direction = 1;  // enemy movement direction

let score = 0;  // score
let scoreText = new PIXI.Text('Score: ' + score, {fontFamily : 'Arial', fontSize: 24, fill : 0xffffff});
scoreText.x = 10;
scoreText.y = 10;
app.stage.addChild(scoreText);

let bulletSound = new Howl({ src: ['bulletSound.mp3'] });
let explosionSound = new Howl({ src: ['explosionSound.mp3'] });

// game loop
app.ticker.add(() => {
    // move bullets
    for (let bullet of bullets.children) {
        bullet.y -= 5;

        // check for bullet-enemy collision
        for (let enemy of enemies.children) {
            if (bullet.x > enemy.x && bullet.x < enemy.x + enemy.width && bullet.y > enemy.y && bullet.y < enemy.y + enemy.height) {
                bullets.removeChild(bullet);
                bulletOnScreen = false;
                enemies.removeChild(enemy);
                score += 100;
                scoreText.text = 'Score: ' + score;
                explosionSound.play();
                break;
            }
        }

        // remove bullets when they leave the screen
        if (bullet.y < 0) {
            bullets.removeChild(bullet);
            bulletOnScreen = false;
        }
    }

    // move enemies
    for (let enemy of enemies.children) {
        enemy.x += 2 * direction;

        // change direction if hit edge
        if (enemy.x <= 0 || enemy.x >= app.screen.width - enemy.width) {
            direction *= -1;
            for (let e of enemies.children) {
                e.y += enemy.height;
            }
            break;
        }

        // restart enemies at top if they reach bottom
        if (enemy.y >= app.screen.height) {
            enemies.removeChildren();
            createEnemies();
            break;
        }
    }
});

// keyboard controls
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        spaceship.x -= 10;
    }
    else if (e.key === 'ArrowRight') {
        spaceship.x += 10;
    }
    else if (e.key === ' ') {
        createBullet(spaceship.x + spaceship.width / 2, spaceship.y);
    }
});

// check if user is on mobile device
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    // mobile controls
    function createButton(text, x, y, action) {
        let button = new PIXI.Text(text, {fontFamily : 'Arial', fontSize: 24, fill : 0xffffff, align : 'center'});
        button.x = x;
        button.y = y;
        button.interactive = true;
        button.buttonMode = true;
        button
            .on('pointerdown', action)
            .on('pointerup', endAction)
            .on('pointerupoutside', endAction);
        document.body.appendChild(button); // append buttons to body, not game stage
    }

    createButton('LEFT', 10, app.screen.height + 20, () => spaceship.x -= 10);
    createButton('RIGHT', 100, app.screen.height + 20, () => spaceship.x += 10);
    createButton('FIRE', app.screen.width - 100, app.screen.height + 20, () => {
        createBullet(spaceship.x + spaceship.width / 2, spaceship.y);
    });

    function endAction() {
        // can be used to stop continuous movement if needed
    }
}
