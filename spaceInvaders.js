// create the application
let app = new PIXI.Application({
    width: 800,
    height: 600,
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
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 3; j++) {
        createEnemy(i * 60 + 100, j * 60);
    }
}

// bullets
let bullets = new PIXI.Container();
app.stage.addChild(bullets);

// function to create bullet
function createBullet(x, y) {
    let bullet = new PIXI.Graphics();
    bullet.beginFill(0xFFFFFF);
    bullet.drawCircle(0, 0, 5);
    bullet.endFill();
    bullet.x = x;
    bullet.y = y;
    bullets.addChild(bullet);
}

// game loop
app.ticker.add(() => {
    // move bullets
    for (let bullet of bullets.children) {
        bullet.y -= 5;

        // check for bullet-enemy collision
        for (let enemy of enemies.children) {
            if (bullet.x > enemy.x && bullet.x < enemy.x + enemy.width && bullet.y > enemy.y && bullet.y < enemy.y + enemy.height) {
                bullets.removeChild(bullet);
                enemies.removeChild(enemy);
                break;
            }
        }
    }

    // move enemies
    for (let enemy of enemies.children) {
        enemy.y += 1;
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
