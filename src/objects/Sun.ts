import { MathUtils, Vector3 } from 'three';

export class Sun extends Vector3 {

    elevation: number;
    azimuth: number;
    phi: number;
    theta: number;

    constructor() {
        super();
        this.elevation = 3;
        this.azimuth = 115;
        this.phi = MathUtils.degToRad(90 - this.elevation);
        this.theta = MathUtils.degToRad(this.azimuth);
        this.setFromSphericalCoords(1, this.phi, this.theta)
    }
}