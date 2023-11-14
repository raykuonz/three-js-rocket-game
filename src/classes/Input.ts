import { isTouchDevice } from '../game/utils';
import * as joystick from 'nipplejs';
import { JoystickManager } from "nipplejs";

export class Input {

    leftPressed: boolean;
    rightPressed: boolean;
    positionOffset: number;
    joystickManager: JoystickManager | null;


    constructor() {
        this.leftPressed = false;
        this.rightPressed = false;
        this.positionOffset = 0;
        this.joystickManager = null;
        this.init();
    }

    init() {
        document.addEventListener('keydown', this.handleKeyDown, false);
        document.addEventListener('keyup', this.handleKeyUp, false);

        if (isTouchDevice()) {
            let touchZone = document.getElementById('joystickZone');

            if (touchZone != null) {
               // Create a Joystick Manager
               this.joystickManager = joystick.create({ zone: touchZone });

               // Register what to do when the joystick moves
               this.joystickManager.on('move',(event, data) => {
                    this.positionOffset = data.vector.x;
               })

                // When the joystick isn't being interacted with anymore, stop moving the rocket
                this.joystickManager.on('end', (event, data) => {
                    this.positionOffset = 0.0;
                })
            }
        }
    }

    handleKeyDown = (event: KeyboardEvent) => {
        let keyCode = event.code;
        if (keyCode === 'ArrowLeft') {
            this.leftPressed = true;
        } else if (keyCode === 'ArrowRight') {
            this.rightPressed = true;
        }
    }

    handleKeyUp = (event: KeyboardEvent) => {
        let keyCode = event.code;
        if (keyCode === 'ArrowLeft') {
            this.leftPressed = false;
        } else if (keyCode === 'ArrowRight') {
            this.rightPressed = false;
        }
    }
}