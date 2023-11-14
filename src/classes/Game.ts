import { PerspectiveCamera, Scene } from 'three';

export class Game {

    level: number;
    ready: boolean;
    cameraMovingToStartPosition: boolean;
    rocketMoving: boolean;
    crystalsCollected: number;
    shieldsCollected: number;
    courseLength: number;
    courseProgress: number;
    levelOver: boolean;
    cameraStartAnimationPlaying: boolean;
    cameraAngleStartAnimation: number;
    backgroundBitCount: number;
    challengeRowCount: number;
    speed: number;

    constructor() {

        // Whether the scene is ready (i.e.: All models have been loaded and can be used)
        this.ready = false;

        // Whether the camera is moving from the beginning circular pattern to behind the ship
        this.cameraMovingToStartPosition = false;

        // Whether the rocket is moving forward
        this.rocketMoving = false;

        // How many crystals the player has collected on this run
        this.crystalsCollected = 0;

        // How many shields the player has collected on this run (can be as low as -5 if player hits rocks)
        this.shieldsCollected = 3;

        // The length of the current level, increases as levels go up
        this.courseLength = 500;

        // How far the player is through the current level, initialises to zero.
        this.courseProgress = 0;

        // Whether the level has finished
        this.levelOver = false;

        // The current level, initialises to one.
        this.level = 1;

        // Whether the start animation is playing (the circular camera movement while looking at the ship)
        this.cameraStartAnimationPlaying = false;

        // Stores the current position of the camera, while the opening camera animation is playing
        this.cameraAngleStartAnimation = 0;

        // How many 'background bits' are in the scene (the cliffs)
        this.backgroundBitCount = 0;

        // How many 'challenge rows' are in the scene (the rows that have rocks, shields, or crystals in them).
        this.challengeRowCount = 0;

        // The current speed of the ship
        this.speed = 0.0;

    }

    // Gives the completion amount of the course thus far, from 0.0 to 1.0.
    coursePercentComplete(): number {
        return this.courseProgress / this.courseLength;

    }

}
