import { gameConfig, sceneSetup, startGame } from "../main";

export const startGameButton = document.getElementById('startGame');
export const nextLevelButton = document.getElementById('nextLevelButton');
export const startAgainButton = document.getElementById('startAgainButton');
export const shipStatus = document.getElementById('shipStatus');
export const crystalCountElement = document.getElementById('crystalCount');
export const shieldCountElement = document.getElementById('shieldCount');
export const progressUiElement = document.getElementById('courseProgress');
export const headsUpDisplayUiElement = document.getElementById('headsUpDisplay');
export const levelIndicator = document.getElementById('levelIndicator');

export const nextLevel = (reset: boolean = false) => {
    document.getElementById('endOfLevel')!.classList.add('is-hidden');


    gameConfig.cameraStartAnimationPlaying = false;
    gameConfig.rocketMoving = false;
    gameConfig.speed = gameConfig.level * 0.1;
    if (reset) {
        sceneSetup(1);
    } else {
        gameConfig.level++;
        sceneSetup(gameConfig.level);
    }

    startGame();
}

export const updateLevelEndUI = (damaged: boolean) => {
    if (damaged) {
        shipStatus!.innerText = 'Game Over';
        nextLevelButton!.classList.add('is-hidden');
        startAgainButton!.classList.remove('is-hidden');
    } else {
        nextLevelButton!.classList.remove('is-hidden');
        startAgainButton!.classList.add('is-hidden');

        const shieldCount = gameConfig.shieldsCollected;

        if (shieldCount >= 5) {
            shipStatus!.innerText = 'Your ship is in pristine condition!';
        }
        else if (shieldCount === 1) {
            shipStatus!.innerText = 'Your ship is in pretty bad shape. We\'ll patch it up, but try to hit less rocks.';
        }
        else {
            shipStatus!.innerText = 'Your ship is in good condition.';
        }
    }
}

export const showLevelEndScreen = () => {
    document.getElementById('endOfLevel')!.classList.remove('is-hidden');
    document.getElementById('crystalCountLeveLEnd')!.innerText = String(gameConfig.crystalsCollected);
}