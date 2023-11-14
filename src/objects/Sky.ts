import { PMREMGenerator, Scene, WebGLRenderer } from 'three';
import { Sky as SkyExample } from 'three/examples/jsm/objects/Sky';
import { Sun } from './Sun';

export class Sky extends SkyExample {

    renderer: WebGLRenderer;
    sun: Sun;
    scene: Scene;

    constructor({
        renderer,
        sun,
        scene,
    }: {
        renderer: WebGLRenderer;
        sun: Sun;
        scene: Scene;
    }) {
        super();

        this.renderer = renderer;
        this.sun = sun;
        this.scene = scene;

        const skyUniforms = this.material.uniforms;
        skyUniforms['turbidity'].value = 10;
        skyUniforms['rayleigh'].value = 2;
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.8;

        const pmremGenerator = new PMREMGenerator(this.renderer);

        this.material.uniforms['sunPosition'].value.copy(this.sun);
        this.scene.environment = pmremGenerator.fromScene(this as any).texture;
        this.scale.setScalar(10000);

        this.scene.add(this);
    }
}