import { MirroredRepeatWrapping, PlaneGeometry, Scene, ShaderMaterial, TextureLoader, Vector3 } from 'three';
import { Water } from './Water';
import { Game } from '../classes/Game';
import { Sun } from './Sun';

export class Sea extends Water {

    scene: Scene;
    gameConfig: Game;
    sun: Sun;

    constructor({
        scene,
        gameConfig,
        sun
    }: {
        scene: Scene;
        gameConfig: Game;
        sun: Sun;
    }) {
        super(
            new PlaneGeometry(10000, 10000),
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new TextureLoader().load('static/normals/waternormals.jpeg', function (texture) {
                    texture.wrapS = texture.wrapT = MirroredRepeatWrapping;
                }),
                sunDirection: new Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
                fog: scene.fog !== undefined
            }
        );

        this.scene = scene;
        this.gameConfig = gameConfig;
        this.sun = sun;

        this.rotation.x = -Math.PI / 2;
        this.rotation.z = 0;

        (this.material as ShaderMaterial).uniforms['sunDirection'].value.copy(this.sun).normalize();

        (this.material as ShaderMaterial).uniforms['speed'].value = 0.0;

        this.scene.add(this);

    }

    update() {
        (this.material as ShaderMaterial).uniforms['time'].value += 1 / 60.0;
        if (this.gameConfig.rocketMoving) {
            (this.material as ShaderMaterial).uniforms['speed'].value += this.gameConfig.speed / 30;
        }
    }
}