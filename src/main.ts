import {
    ACESFilmicToneMapping,
    AnimationClip,
    AnimationMixer,
    Clock,
    Euler,
    Group,
    InterpolateSmooth,
    LoopOnce,
    Mesh,
    PerspectiveCamera,
    Quaternion,
    QuaternionKeyframeTrack,
    Scene,
    SpotLight,
    Vector3,
    VectorKeyframeTrack,
    WebGLRenderer
} from "three";

import { Sea } from './objects/Sea';
import { Sky } from './objects/Sky';
import {
    objectsInit,
    challengeRows,
    environmentBits,
    rocketModel,
    starterBay,
    mothershipModal,
    addChallengeRow,
    addBackgroundBit,
} from "./game/objects";
import { detectCollisions } from "./game/collisionDetection";
import { crystalCountElement, headsUpDisplayUiElement, levelIndicator, nextLevel, nextLevelButton, progressUiElement, shieldCountElement, showLevelEndScreen, startAgainButton, startGameButton, updateLevelEndUI } from "./game/ui";
import { garbageCollector } from "./game/garbageCollectors";
import { moveCollectedBits } from "./game/physics";
import { Game } from "./classes/Game";
import { Input } from "./classes/Input";
import { clamp } from "./game/utils";
import { Sun } from './objects/Sun';

export const scene = new Scene();
export const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000,
);

// Game configuration
export const gameConfig = new Game();
let gameInput: Input;

// three rendered
let renderer: WebGLRenderer;

export const destructionBits = new Array<Mesh>();

const sun = new Sun();

// Water plane
const sea = new Sea({ scene, gameConfig, sun });


function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    sea.update();
}
window.addEventListener('resize', handleWindowResize, false);

export const startGame = () => {
    console.log('##### startGame clicked!');

    // Indicate that the animation from the camera starting position to the rocket location is running
    gameConfig.cameraStartAnimationPlaying = true;

    // Remove the red text on the shield item, if it existed from the last level
    shieldCountElement!.classList.remove('text-color-danger');

    // Show the heads up display (that shows crystals collected, etc)
    headsUpDisplayUiElement!.classList.remove('is-hidden');

    // Create an animation mixer on the rocket model
    camera.userData.mixer = new AnimationMixer(camera);

    // Create an animation from the cameras' current position to behind the rocket
    let track = new VectorKeyframeTrack('.position', [0, 2], [
        camera.position.x,
        camera.position.y,
        camera.position.z,
        0,
        30,
        100,
    ], InterpolateSmooth);

    // Create a Quaternion rotation for the "forwards" position on the camera
    let identityRotation = new Quaternion().setFromAxisAngle(new Vector3(-1, 0, 0), .3);

    // Create an animation clip that begins with the cameras' current rotation, and ends on the camera being
    // rotated towards the game space
    let rotationClip = new QuaternionKeyframeTrack('.quaternion', [0, 2], [
        camera.quaternion.x,
        camera.quaternion.y,
        camera.quaternion.z,
        camera.quaternion.w,
        identityRotation.x,
        identityRotation.y,
        identityRotation.z,
        identityRotation.w,
    ])

    // Associate both KeyFrameTracks to an AnimationClip, so they both play at the same time
    const animationClip = new AnimationClip('animateIn', 2, [track, rotationClip]);
    const animationAction = camera.userData.mixer.clipAction(animationClip);
    animationAction.setLoop(LoopOnce, 1);
    animationAction.clampWhenFinished = true;

    camera.userData.clock = new Clock();
    camera.userData.mixer.addEventListener('finished', handleStartGameAnimationFinished);

    // Play the animation
    animationAction.play();
    console.log('##### Start game animateIn played!');

    startGameButton!.classList.add('is-hidden');
}


function handleStartGameAnimationFinished() {
    console.log('##### Start game animateInfinished!');

    // console.log(camera.position);


    // TODO: Make sure the camera is facing in the right direction
    // camera.lookAt(new Vector3(0, 30, 100));
    // Indicate that the rocket has begun moving
    gameConfig.rocketMoving = true;
    camera.userData.mixer.removeEventListener('finished', handleStartGameAnimationFinished);
}


async function init() {
    renderer = new WebGLRenderer;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    nextLevelButton!.onclick = () => nextLevel(false);
    startAgainButton!.onclick = () => nextLevel(true);

    startGameButton!.onclick = startGame;

    // Sky
    const sky = new Sky({
        renderer,
        sun,
        scene
    });

    // Create some lighting for the foreground of the scene
    const shadowLight = new SpotLight();
    shadowLight.lookAt(rocketModel.position);
    shadowLight.position.z = 50;
    shadowLight.position.y = 100;
    shadowLight.position.x = 100;
    shadowLight.castShadow = true;
    scene.add(shadowLight);

    // Rocket
    rocketModel.scale.set(0.3, 0.3, 0.3);
    scene.add(rocketModel);
    scene.add(mothershipModal);

    mothershipModal.position.y = 200;
    mothershipModal.position.z = 100;
    mothershipModal.scale.set(15, 15, 15);

    gameConfig.ready = true;

    sceneSetup(gameConfig.level);

    gameInput = new Input();
}

export const endLevel = (damaged : boolean) => {

    updateLevelEndUI(damaged);

    gameConfig.rocketMoving = false;
    gameConfig.levelOver = true;
    rocketModel.userData.flyingAway = true;
    destructionBits.forEach((mesh) => {
        scene.remove(mesh);
    });
    destructionBits.length = 0;

     // make the camera look at the rocket before it flies away

     let cubeLook = new Group();
     let rocketPositionCopy = rocketModel.position.clone();
     cubeLook.position.copy(rocketPositionCopy);
     cubeLook.lookAt(rocketModel.position);

     let lookAtRocketQuaternion = cubeLook.quaternion;

     let cameraRotationTrack = new QuaternionKeyframeTrack('.quaternion', [0, 2], [
        camera.quaternion.x,
        camera.quaternion.y,
        camera.quaternion.z,
        camera.quaternion.w,
        lookAtRocketQuaternion.x,
        lookAtRocketQuaternion.y,
        lookAtRocketQuaternion.z,
        lookAtRocketQuaternion.w,
     ]);

     const lookAtRocketAnimationClip = new AnimationClip('lookAtRocket', 2, [cameraRotationTrack]);
     const lookAtRocketAnimationAction = camera.userData.mixer.clipAction(lookAtRocketAnimationClip);
     lookAtRocketAnimationAction.setLoop(LoopOnce, 1);
     lookAtRocketAnimationAction.clampWhenFinished = true;


     camera.userData.mixer.addEventListener('finished', function () {
         console.log('##### lookAtRocket finished');
    })


     lookAtRocketAnimationAction.play();
     console.log('##### lookAtRocket played');



    rocketModel.userData.mixer = new AnimationMixer(rocketModel);
    let track = new VectorKeyframeTrack('.position', [2, 3, 5], [
        rocketModel.position.x, rocketModel.position.y, rocketModel.position.z,
        20, 100, 20,
        40, 400, 100
    ]);


    let destinationQuaternion = new Quaternion().setFromEuler(new Euler(-90, 0, -90))

    let rotationTrack = new QuaternionKeyframeTrack('.quaternion', [0, 2], [
        rocketModel.quaternion.x,
        rocketModel.quaternion.y,
        rocketModel.quaternion.z,
        rocketModel.quaternion.w,
        destinationQuaternion.x,
        destinationQuaternion.y,
        destinationQuaternion.z,
        destinationQuaternion.w
    ]);

    const animationClip = new AnimationClip('flyAway', 6, [track, rotationTrack]);
    const animationAction = rocketModel.userData.mixer.clipAction(animationClip);
    animationAction.setLoop(LoopOnce, 1);
    animationAction.clampWhenFinished = true;

    rocketModel.userData.mixer.addEventListener('finished', function() {
        console.log('##### flyAway finished');

        showLevelEndScreen();
    });

    rocketModel.userData.clock = new Clock();
    animationAction.play();
    console.log('##### flyAway played');

}

const animate = () => {
    requestAnimationFrame(animate);

    // If the left arrow is pressed, move the rocket to the left
    if (gameInput.leftPressed) {
        rocketModel.position.x -= 0.5;
    }

    // If the right arrow is pressed, move the rocket to the right
    if (gameInput.rightPressed) {
        rocketModel.position.x += 0.5
    }

     // If the joystick is in use, update the current location of the rocket accordingly
    rocketModel.position.x += gameInput.positionOffset;

    // Clamp the final position of the rocket to an allowable region
    rocketModel.position.x = clamp(rocketModel.position.x, -20, 25);

    if (gameConfig.rocketMoving) {

        progressUiElement!.style.width = String(gameConfig.coursePercentComplete() * 100) + '%';

        gameConfig.speed += 0.001;
        gameConfig.courseProgress += gameConfig.speed;

        garbageCollector();
    }

    if (gameConfig.ready) {

        if (rocketModel.userData.mixer != null) {
            rocketModel.userData.mixer.update(rocketModel.userData.clock.getDelta());
        }

        if (!gameConfig.cameraStartAnimationPlaying) {
            camera.position.x = 20 * Math.cos(gameConfig.cameraAngleStartAnimation);
            camera.position.z = 20 * Math.sin(gameConfig.cameraAngleStartAnimation);
            camera.position.y = 30;
            camera.lookAt(rocketModel.position);
            gameConfig.cameraAngleStartAnimation += 0.005;
        }

        if (gameConfig.levelOver) {
            if (gameConfig.speed > 0) {
                gameConfig.speed -= 0.1;
            }
        }

        destructionBits.forEach((mesh) => {
            if (mesh.userData.clock && mesh.userData.mixer) {
                mesh.userData.mixer.update(mesh.userData.clock.getDelta());
            }
        });

        camera.userData?.mixer?.update(camera.userData?.clock?.getDelta());

        if (gameConfig.rocketMoving) {

            // Detect collisions
            detectCollisions();

            // Move the rock towards the player
            for (let i = 0; i < environmentBits.length; i++) {
                let mesh = environmentBits[i];
                mesh.position.z += gameConfig.speed;
            }

            // Move the challenge rows towards the player
            for (let i = 0; i < challengeRows.length; i++) {
                challengeRows[i].rowParent.position.z += gameConfig.speed;
            }


            // If the furtherest rock is less than a certain distance, create a new one on the horizon
            if ((!environmentBits.length || environmentBits[0].position.z > -1300) && !gameConfig.levelOver) {
                addBackgroundBit(gameConfig.backgroundBitCount++, true);
            }

            // If the furtherest challenge row is less than a certain distance, create a new one on the horizon
            if ((!challengeRows.length || challengeRows[0].rowParent.position.z > -1300) && !gameConfig.levelOver) {
                addChallengeRow(gameConfig.challengeRowCount++, true);
            }

            // IF the starter bay hasn't already been removed from the scene, moe it toward the player
            if (starterBay != null) {
                starterBay.position.z += gameConfig.speed;
            }

            if (starterBay.position.z > 200) {
                scene.remove(starterBay);
            }
        }

        // Call the function to relocate the current bits on the screen and move them towards the rocket so it looks like the rocket is collecting them
        moveCollectedBits();

        // If the rockets progress equals the length of the course...
        if (gameConfig.courseProgress >= gameConfig.courseLength) {
            // ...check that we haven't already started the level-end process
            if (!rocketModel.userData.flyingAway) {
                 // ...and end the level
                 endLevel(false);
            }
        }

        // If the level end-scene is playing...
        if (rocketModel.userData.flyingAway) {
             // Rotate the camera to look at the rocket on it's return journey to the mothership
            camera.lookAt(rocketModel.position);
        }
    }

    sea.update();
    renderer.render(scene, camera);
}

export const sceneSetup = (level: number) => {

    gameConfig.level = level;

    // Remove all references to old "challenge rows" and background bits
    gameConfig.challengeRowCount = 0;
    gameConfig.backgroundBitCount = 0;

    // Reset the camera position back to slightly infront of the ship, for the start-up animation
    camera.position.z = 50;
    camera.position.y = 12;
    camera.position.x = 15;
    camera.rotation.y = 2.5;

    // Add the starter bay to the scene (the sandy shore with the rocks around it)
    scene.add(starterBay);

    // Set the starter bay position to be close to the ship
    starterBay.position.copy(new Vector3(10, 0, 120));

    // Rotate the rocket model back to the correct orientation to play the level
    rocketModel.rotation.x = Math.PI;
    rocketModel.rotation.z = Math.PI;

    // Set the location of the rocket model to be within the starter bay
    rocketModel.position.z = 70;
    rocketModel.position.y = 10;
    rocketModel.position.x = 0;

    // Remove any existing challenge rows from the scene
    challengeRows.forEach((row) => {
        scene.remove(row.rowParent);
    });

    // Remove any existing environment bits from the scene
    environmentBits.forEach((bit) => {
        scene.remove(bit);
    });

     // Setting the length of these arrays to zero clears the array of any values
     environmentBits.length = 0;
     challengeRows.length = 0;

    // Render some challenge rows and background bits into the distance
    for (let i = 0; i < 60; i++) {
        // Add challenge rows and background bits;
        addChallengeRow(gameConfig.challengeRowCount++);
        addBackgroundBit(gameConfig.backgroundBitCount++);
    }

    // Set the variables back to their beginning state

    // Indicates that the animation where the camera flies from the current position isn't playing
    gameConfig.cameraStartAnimationPlaying = false;

    // The level isn't over
    gameConfig.levelOver = false;

    // The rocket isn't flying away back to the mothership
    rocketModel.userData.flyingAway = false;

    // Resets the current progress of the course to 0
    gameConfig.courseProgress = 0;

    // Sets the length of the course based on the current level
    gameConfig.courseLength = 1000 * level;

    // Reset collected items
    gameConfig.shieldsCollected = 3;
    gameConfig.crystalsCollected = 0;

    // Update the UI to reset the collected items
    crystalCountElement!.innerText = String(gameConfig.crystalsCollected);
    shieldCountElement!.innerText = String(gameConfig.shieldsCollected);

    // Sets the current level Id in the UI
    levelIndicator!.innerText = `LEVEL ${gameConfig.level}`;

    // Indicate the scene setup has completed
    gameConfig.ready = true;
}

objectsInit().then(() => {
    init();
    animate();
})