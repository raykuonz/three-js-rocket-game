(()=>{"use strict";var e,t={384:(e,t,o)=>{o.d(t,{Z:()=>n});const n="uniform sampler2D mirrorSampler;\nuniform float alpha;\nuniform float time;\nuniform float size;\nuniform float distortionScale;\nuniform sampler2D normalSampler;\nuniform vec3 sunColor;\nuniform vec3 sunDirection;\nuniform vec3 eye;\nuniform vec3 waterColor;\nvarying vec4 mirrorCoord;\nvarying vec4 worldPosition;\nuniform float speed;\n\nvec4 getNoise(vec2 uv) {\n    float offset;\n    if (speed == 0.0){\n        offset = time / 10.0;\n    }\n    else {\n        offset = speed;\n    }\n    vec2 uv3 = uv / vec2(50.0, 50.0) - vec2(speed / 1000.0, offset);\n    vec2 uv0 = vec2(0, 0);\n    vec2 uv1 = vec2(0, 0);\n    vec2 uv2 = vec2(0, 0);\n    vec4 noise = texture2D(normalSampler, uv0) +\n    texture2D(normalSampler, uv1) +\n    texture2D(normalSampler, uv2) +\n    texture2D(normalSampler, uv3);\n    return noise * 0.5 - 1.0;\n}\nvoid sunLight(const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor) {\n    vec3 reflection = normalize(reflect(-sunDirection, surfaceNormal));\n    float direction = max(0.0, dot(eyeDirection, reflection));\n    specularColor += pow(direction, shiny) * sunColor * spec;\n    diffuseColor += max(dot(sunDirection, surfaceNormal), 0.0) * sunColor * diffuse;\n}\n    #include <common>\n    #include <packing>\n    #include <bsdfs>\n    #include <fog_pars_fragment>\n    #include <logdepthbuf_pars_fragment>\n    #include <lights_pars_begin>\n    #include <shadowmap_pars_fragment>\n    #include <shadowmask_pars_fragment>\nvoid main() {\n    #include <logdepthbuf_fragment>\n    vec4 noise = getNoise(worldPosition.xz * size);\n    vec3 surfaceNormal = normalize(noise.xzy * vec3(1.5, 1.0, 1.5));\n    vec3 diffuseLight = vec3(0.0);\n    vec3 specularLight = vec3(0.0);\n    vec3 worldToEye = eye-worldPosition.xyz;\n    vec3 eyeDirection = normalize(worldToEye);\n    sunLight(surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight);\n    float distance = length(worldToEye);\n    vec2 distortion = surfaceNormal.xz * (0.001 + 1.0 / distance) * distortionScale;\n    vec3 reflectionSample = vec3(texture2D(mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion));\n    float theta = max(dot(eyeDirection, surfaceNormal), 0.0);\n    float rf0 = 0.3;\n    float reflectance = rf0 + (1.0 - rf0) * pow((1.0 - theta), 5.0);\n    vec3 scatter = max(0.0, dot(surfaceNormal, eyeDirection)) * waterColor;\n    vec3 albedo = mix((sunColor * diffuseLight * 0.3 + scatter) * getShadowMask(), (vec3(0.1) + reflectionSample * 0.9 + reflectionSample * specularLight), reflectance);\n    vec3 outgoingLight = albedo;\n    gl_FragColor = vec4(outgoingLight, alpha);\n    #include <tonemapping_fragment>\n    #include <fog_fragment>\n}"},266:(e,t,o)=>{o.d(t,{Z:()=>n});const n="uniform mat4 textureMatrix;\nuniform float time;\nvarying vec4 mirrorCoord;\nvarying vec4 worldPosition;\nvarying float speed;\n#include <common>\n#include <fog_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\nvoid main() {\n    mirrorCoord = modelMatrix * vec4( position, 1.0 );\n    worldPosition = mirrorCoord.xyzw;\n    mirrorCoord = textureMatrix * mirrorCoord;\n    vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );\n    gl_Position = projectionMatrix * mvPosition;\n    #include <beginnormal_vertex>\n    #include <defaultnormal_vertex>\n    #include <logdepthbuf_vertex>\n    #include <fog_vertex>\n    #include <shadowmap_vertex>\n}"},53:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Game=void 0,t.Game=class{constructor(){this.ready=!1,this.cameraMovingToStartPosition=!1,this.rocketMoving=!1,this.crystalsCollected=0,this.shieldsCollected=3,this.courseLength=500,this.courseProgress=0,this.levelOver=!1,this.level=1,this.cameraStartAnimationPlaying=!1,this.cameraAngleStartAnimation=0,this.backgroundBitCount=0,this.challengeRowCount=0,this.speed=0}coursePercentComplete(){return this.courseProgress/this.courseLength}}},737:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Input=void 0;const n=o(790),i=o(694);t.Input=class{constructor(){this.handleKeyDown=e=>{let t=e.code;"ArrowLeft"===t?this.leftPressed=!0:"ArrowRight"===t&&(this.rightPressed=!0)},this.handleKeyUp=e=>{let t=e.code;"ArrowLeft"===t?this.leftPressed=!1:"ArrowRight"===t&&(this.rightPressed=!1)},this.leftPressed=!1,this.rightPressed=!1,this.positionOffset=0,this.joystickManager=null,this.init()}init(){if(document.addEventListener("keydown",this.handleKeyDown,!1),document.addEventListener("keyup",this.handleKeyUp,!1),(0,n.isTouchDevice)()){let e=document.getElementById("joystickZone");null!=e&&(this.joystickManager=i.create({zone:e}),this.joystickManager.on("move",((e,t)=>{this.positionOffset=t.vector.x})),this.joystickManager.on("end",((e,t)=>{this.positionOffset=0})))}}}},21:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.detectCollisions=void 0;const n=o(232),i=o(519),r=o(404),a=o(542),s=o(46);t.detectCollisions=()=>{if(i.gameConfig.levelOver)return;const e=(new n.Box3).setFromObject(r.rocketModel);r.challengeRows.forEach((t=>{t.rowParent.updateMatrixWorld(),t.rowParent.children.forEach((t=>{t.children.forEach((o=>{const a=(new n.Box3).setFromObject(o);if(a.intersectsBox(e)){let e=a.getCenter(o.position);if(l(e),t.remove(o),void 0!==t.userData.objectType)switch(t.userData.objectType){case r.ObjectType.ROCK:i.gameConfig.shieldsCollected--,s.shieldCountElement.innerText=String(i.gameConfig.shieldsCollected),i.gameConfig.shieldsCollected<=1&&s.shieldCountElement.classList.add("text-color-danger"),i.gameConfig.shieldsCollected<=0&&(0,i.endLevel)(!0);break;case r.ObjectType.CRYSTAL:i.gameConfig.crystalsCollected++,s.crystalCountElement.innerText=String(i.gameConfig.crystalsCollected);break;case r.ObjectType.SHIELD_ITEM:i.gameConfig.shieldsCollected++,s.shieldCountElement.innerText=String(i.gameConfig.shieldsCollected),i.gameConfig.shieldsCollected>1&&s.shieldCountElement.classList.remove("text-color-danger")}}}))}))}))};const l=e=>{for(let t=0;t<6;t++){let o=new n.Mesh(new n.BoxGeometry(1,1,1),new n.MeshBasicMaterial({color:"black",transparent:!0,opacity:.4}));o.userData.lifetime=0,o.position.set(e.x,e.y,e.z),o.userData.mixer=new n.AnimationMixer(o);let s=t/45,l=15*Math.cos((0,a.radToDeg)(s)),c=15*Math.sin((0,a.radToDeg)(s)),d=new n.VectorKeyframeTrack(".position",[0,.3],[r.rocketModel.position.x,r.rocketModel.position.y,r.rocketModel.position.z,r.rocketModel.position.x+l,r.rocketModel.position.y,r.rocketModel.position.z+c]);const m=new n.AnimationClip("destructionOut",10,[d]),u=o.userData.mixer.clipAction(m);u.setLoop(n.LoopOnce,1),u.clampWhenFinished=!0,u.play(),o.userData.clock=new n.Clock,i.scene.add(o),i.destructionBits.push(o)}}},39:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.garbageCollector=void 0;const n=o(519),i=o(404);t.garbageCollector=()=>{let e=i.environmentBits.filter((e=>e.position.z>100)),t=i.challengeRows.filter((e=>e.rowParent.position.z>100));for(let t=0;t<e.length;t++){let o=i.environmentBits.indexOf(e[t]);n.scene.remove(i.environmentBits[o]),i.environmentBits.splice(o,1)}for(let e=0;e<t.length;e++){const o=i.challengeRows.indexOf(t[e]);n.scene.remove(t[e].rowParent),i.challengeRows.splice(o,1)}}},404:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.addChallengeRow=t.addBackgroundBit=t.objectsInit=t.ObjectType=t.mothershipModal=t.shieldModal=t.rockModel=t.crystalModel=t.cliffsModel=t.starterBay=t.rocketModel=t.challengeRows=t.environmentBits=void 0;const n=o(232),i=o(90),r=o(519);t.environmentBits=new Array,t.challengeRows=new Array;const a=new i.GLTFLoader;var s;!function(e){e[e.ROCK=0]="ROCK",e[e.CRYSTAL=1]="CRYSTAL",e[e.SHIELD_ITEM=2]="SHIELD_ITEM"}(s||(t.ObjectType=s={})),t.objectsInit=async()=>{t.cliffsModel=(await a.loadAsync("static/models/cliffs/scene.gltf")).scene.children[0],t.crystalModel=(await a.loadAsync("static/models/glowing_crystals/scene.gltf")).scene.children[0],t.rockModel=(await a.loadAsync("static/models/glowing_rock/scene.gltf")).scene.children[0],t.shieldModal=(await a.loadAsync("static/models/shield_item/scene.gltf")).scene.children[0],t.rocketModel=(await a.loadAsync("static/models/rocket/scene.gltf")).scene.children[0],t.starterBay=(await a.loadAsync("static/models/start_bay/scene.gltf")).scene,t.mothershipModal=(await a.loadAsync("static/models/spaceship_nortend/scene.gltf")).scene},t.addBackgroundBit=(e,o=!1)=>{let i=o?-1400:-60*e,a=t.cliffsModel.clone();a.scale.set(.02,.02,.02),a.position.set(e%2==0?60-Math.random():-60-Math.random(),0,i),a.rotation.set(n.MathUtils.degToRad(-90),0,Math.random()),r.scene.add(a),t.environmentBits.unshift(a)};const l=e=>{let o=t.crystalModel.clone();return o.position.x=11*e-20,o.scale.set(.02,.02,.02),o.userData.objectType=s.CRYSTAL,o},c=e=>{let o=t.rockModel.clone();return o.position.x=11*e-20,o.scale.set(5,5,5),o.position.setY(5),o.userData.objectType=s.ROCK,o},d=e=>{let o=t.shieldModal.clone();return o.position.x=11*e-20,o.position.y=8,o.userData.objectType=s.SHIELD_ITEM,o};t.addChallengeRow=(e,o=!1)=>{let i=o?-1400:-60*e,a=new n.Group;a.position.z=i;for(let e=0;e<5;e++){const t=10*Math.random();if(t<2){let t=l(e);a.add(t)}else if(t<4){let t=c(e);a.add(t)}else if(t>9){let t=d(e);a.add(t)}}t.challengeRows.unshift({rowParent:a,index:r.gameConfig.challengeRowCount++}),r.scene.add(a)}},427:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.moveCollectedBits=void 0;const n=o(232),i=o(519),r=o(404);t.moveCollectedBits=()=>{for(let e=0;e<i.destructionBits.length;e++){let t=i.destructionBits[e];if(t.userData.lifetime>500)i.scene.remove(t),i.destructionBits.splice(e,1);else{let e=r.rocketModel.position,o=new n.Vector3(0,0,0);o.x=e.x-t.position.x,o.y=e.y-t.position.y,o.z=e.z-t.position.z,o.normalize(),t.translateOnAxis(o,.8),t.userData.lifetime++}}}},46:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.showLevelEndScreen=t.updateLevelEndUI=t.nextLevel=t.levelIndicator=t.headsUpDisplayUiElement=t.progressUiElement=t.shieldCountElement=t.crystalCountElement=t.shipStatus=t.startAgainButton=t.nextLevelButton=t.startGameButton=void 0;const n=o(519);t.startGameButton=document.getElementById("startGame"),t.nextLevelButton=document.getElementById("nextLevelButton"),t.startAgainButton=document.getElementById("startAgainButton"),t.shipStatus=document.getElementById("shipStatus"),t.crystalCountElement=document.getElementById("crystalCount"),t.shieldCountElement=document.getElementById("shieldCount"),t.progressUiElement=document.getElementById("courseProgress"),t.headsUpDisplayUiElement=document.getElementById("headsUpDisplay"),t.levelIndicator=document.getElementById("levelIndicator"),t.nextLevel=(e=!1)=>{document.getElementById("endOfLevel").classList.add("is-hidden"),n.gameConfig.cameraStartAnimationPlaying=!1,n.gameConfig.rocketMoving=!1,n.gameConfig.speed=.1*n.gameConfig.level,e?(0,n.sceneSetup)(1):(n.gameConfig.level++,(0,n.sceneSetup)(n.gameConfig.level)),(0,n.startGame)()},t.updateLevelEndUI=e=>{if(e)t.shipStatus.innerText="Game Over",t.nextLevelButton.classList.add("is-hidden"),t.startAgainButton.classList.remove("is-hidden");else{t.nextLevelButton.classList.remove("is-hidden"),t.startAgainButton.classList.add("is-hidden");const e=n.gameConfig.shieldsCollected;t.shipStatus.innerText=e>=5?"Your ship is in pristine condition!":1===e?"Your ship is in pretty bad shape. We'll patch it up, but try to hit less rocks.":"Your ship is in good condition."}},t.showLevelEndScreen=()=>{document.getElementById("endOfLevel").classList.remove("is-hidden"),document.getElementById("crystalCountLeveLEnd").innerText=String(n.gameConfig.crystalsCollected)}},790:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.clamp=t.isTouchDevice=void 0,t.isTouchDevice=function(){return"ontouchstart"in window||navigator.maxTouchPoints>0},t.clamp=function(e,t,o){return Math.min(Math.max(e,t),o)}},519:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.sceneSetup=t.endLevel=t.startGame=t.destructionBits=t.gameConfig=t.camera=t.scene=void 0;const n=o(232),i=o(403),r=o(972),a=o(404),s=o(21),l=o(46),c=o(39),d=o(427),m=o(53),u=o(737),g=o(790),p=o(659);let f,h;t.scene=new n.Scene,t.camera=new n.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,2e3),t.gameConfig=new m.Game,t.destructionBits=new Array;const v=new p.Sun,y=new i.Sea({scene:t.scene,gameConfig:t.gameConfig,sun:v});function w(){console.log("##### Start game animateInfinished!"),t.gameConfig.rocketMoving=!0,t.camera.userData.mixer.removeEventListener("finished",w)}window.addEventListener("resize",(function(){t.camera.aspect=window.innerWidth/window.innerHeight,t.camera.updateProjectionMatrix(),h.setSize(window.innerWidth,window.innerHeight),y.update()}),!1),t.startGame=()=>{console.log("##### startGame clicked!"),t.gameConfig.cameraStartAnimationPlaying=!0,l.shieldCountElement.classList.remove("text-color-danger"),l.headsUpDisplayUiElement.classList.remove("is-hidden"),t.camera.userData.mixer=new n.AnimationMixer(t.camera);let e=new n.VectorKeyframeTrack(".position",[0,2],[t.camera.position.x,t.camera.position.y,t.camera.position.z,0,30,100],n.InterpolateSmooth),o=(new n.Quaternion).setFromAxisAngle(new n.Vector3(-1,0,0),.3),i=new n.QuaternionKeyframeTrack(".quaternion",[0,2],[t.camera.quaternion.x,t.camera.quaternion.y,t.camera.quaternion.z,t.camera.quaternion.w,o.x,o.y,o.z,o.w]);const r=new n.AnimationClip("animateIn",2,[e,i]),a=t.camera.userData.mixer.clipAction(r);a.setLoop(n.LoopOnce,1),a.clampWhenFinished=!0,t.camera.userData.clock=new n.Clock,t.camera.userData.mixer.addEventListener("finished",w),a.play(),console.log("##### Start game animateIn played!"),l.startGameButton.classList.add("is-hidden")},t.endLevel=e=>{(0,l.updateLevelEndUI)(e),t.gameConfig.rocketMoving=!1,t.gameConfig.levelOver=!0,a.rocketModel.userData.flyingAway=!0,t.destructionBits.forEach((e=>{t.scene.remove(e)})),t.destructionBits.length=0;let o=new n.Group,i=a.rocketModel.position.clone();o.position.copy(i),o.lookAt(a.rocketModel.position);let r=o.quaternion,s=new n.QuaternionKeyframeTrack(".quaternion",[0,2],[t.camera.quaternion.x,t.camera.quaternion.y,t.camera.quaternion.z,t.camera.quaternion.w,r.x,r.y,r.z,r.w]);const c=new n.AnimationClip("lookAtRocket",2,[s]),d=t.camera.userData.mixer.clipAction(c);d.setLoop(n.LoopOnce,1),d.clampWhenFinished=!0,t.camera.userData.mixer.addEventListener("finished",(function(){console.log("##### lookAtRocket finished")})),d.play(),console.log("##### lookAtRocket played"),a.rocketModel.userData.mixer=new n.AnimationMixer(a.rocketModel);let m=new n.VectorKeyframeTrack(".position",[2,3,5],[a.rocketModel.position.x,a.rocketModel.position.y,a.rocketModel.position.z,20,100,20,40,400,100]),u=(new n.Quaternion).setFromEuler(new n.Euler(-90,0,-90)),g=new n.QuaternionKeyframeTrack(".quaternion",[0,2],[a.rocketModel.quaternion.x,a.rocketModel.quaternion.y,a.rocketModel.quaternion.z,a.rocketModel.quaternion.w,u.x,u.y,u.z,u.w]);const p=new n.AnimationClip("flyAway",6,[m,g]),f=a.rocketModel.userData.mixer.clipAction(p);f.setLoop(n.LoopOnce,1),f.clampWhenFinished=!0,a.rocketModel.userData.mixer.addEventListener("finished",(function(){console.log("##### flyAway finished"),(0,l.showLevelEndScreen)()})),a.rocketModel.userData.clock=new n.Clock,f.play(),console.log("##### flyAway played")};const C=()=>{var e,o,n,i;if(requestAnimationFrame(C),f.leftPressed&&(a.rocketModel.position.x-=.5),f.rightPressed&&(a.rocketModel.position.x+=.5),a.rocketModel.position.x+=f.positionOffset,a.rocketModel.position.x=(0,g.clamp)(a.rocketModel.position.x,-20,25),t.gameConfig.rocketMoving&&(l.progressUiElement.style.width=String(100*t.gameConfig.coursePercentComplete())+"%",t.gameConfig.speed+=.001,t.gameConfig.courseProgress+=t.gameConfig.speed,(0,c.garbageCollector)()),t.gameConfig.ready){if(null!=a.rocketModel.userData.mixer&&a.rocketModel.userData.mixer.update(a.rocketModel.userData.clock.getDelta()),t.gameConfig.cameraStartAnimationPlaying||(t.camera.position.x=20*Math.cos(t.gameConfig.cameraAngleStartAnimation),t.camera.position.z=20*Math.sin(t.gameConfig.cameraAngleStartAnimation),t.camera.position.y=30,t.camera.lookAt(a.rocketModel.position),t.gameConfig.cameraAngleStartAnimation+=.005),t.gameConfig.levelOver&&t.gameConfig.speed>0&&(t.gameConfig.speed-=.1),t.destructionBits.forEach((e=>{e.userData.clock&&e.userData.mixer&&e.userData.mixer.update(e.userData.clock.getDelta())})),null===(o=null===(e=t.camera.userData)||void 0===e?void 0:e.mixer)||void 0===o||o.update(null===(i=null===(n=t.camera.userData)||void 0===n?void 0:n.clock)||void 0===i?void 0:i.getDelta()),t.gameConfig.rocketMoving){(0,s.detectCollisions)();for(let e=0;e<a.environmentBits.length;e++)a.environmentBits[e].position.z+=t.gameConfig.speed;for(let e=0;e<a.challengeRows.length;e++)a.challengeRows[e].rowParent.position.z+=t.gameConfig.speed;a.environmentBits.length&&!(a.environmentBits[0].position.z>-1300)||t.gameConfig.levelOver||(0,a.addBackgroundBit)(t.gameConfig.backgroundBitCount++,!0),a.challengeRows.length&&!(a.challengeRows[0].rowParent.position.z>-1300)||t.gameConfig.levelOver||(0,a.addChallengeRow)(t.gameConfig.challengeRowCount++,!0),null!=a.starterBay&&(a.starterBay.position.z+=t.gameConfig.speed),a.starterBay.position.z>200&&t.scene.remove(a.starterBay)}(0,d.moveCollectedBits)(),t.gameConfig.courseProgress>=t.gameConfig.courseLength&&(a.rocketModel.userData.flyingAway||(0,t.endLevel)(!1)),a.rocketModel.userData.flyingAway&&t.camera.lookAt(a.rocketModel.position)}y.update(),h.render(t.scene,t.camera)};t.sceneSetup=e=>{t.gameConfig.level=e,t.gameConfig.challengeRowCount=0,t.gameConfig.backgroundBitCount=0,t.camera.position.z=50,t.camera.position.y=12,t.camera.position.x=15,t.camera.rotation.y=2.5,t.scene.add(a.starterBay),a.starterBay.position.copy(new n.Vector3(10,0,120)),a.rocketModel.rotation.x=Math.PI,a.rocketModel.rotation.z=Math.PI,a.rocketModel.position.z=70,a.rocketModel.position.y=10,a.rocketModel.position.x=0,a.challengeRows.forEach((e=>{t.scene.remove(e.rowParent)})),a.environmentBits.forEach((e=>{t.scene.remove(e)})),a.environmentBits.length=0,a.challengeRows.length=0;for(let e=0;e<60;e++)(0,a.addChallengeRow)(t.gameConfig.challengeRowCount++),(0,a.addBackgroundBit)(t.gameConfig.backgroundBitCount++);t.gameConfig.cameraStartAnimationPlaying=!1,t.gameConfig.levelOver=!1,a.rocketModel.userData.flyingAway=!1,t.gameConfig.courseProgress=0,t.gameConfig.courseLength=1e3*e,t.gameConfig.shieldsCollected=3,t.gameConfig.crystalsCollected=0,l.crystalCountElement.innerText=String(t.gameConfig.crystalsCollected),l.shieldCountElement.innerText=String(t.gameConfig.shieldsCollected),l.levelIndicator.innerText=`LEVEL ${t.gameConfig.level}`,t.gameConfig.ready=!0},(0,a.objectsInit)().then((()=>{!async function(){h=new n.WebGLRenderer,h.toneMapping=n.ACESFilmicToneMapping,h.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(h.domElement),l.nextLevelButton.onclick=()=>(0,l.nextLevel)(!1),l.startAgainButton.onclick=()=>(0,l.nextLevel)(!0),l.startGameButton.onclick=t.startGame,new r.Sky({renderer:h,sun:v,scene:t.scene});const e=new n.SpotLight;e.lookAt(a.rocketModel.position),e.position.z=50,e.position.y=100,e.position.x=100,e.castShadow=!0,t.scene.add(e),a.rocketModel.scale.set(.3,.3,.3),t.scene.add(a.rocketModel),t.scene.add(a.mothershipModal),a.mothershipModal.position.y=200,a.mothershipModal.position.z=100,a.mothershipModal.scale.set(15,15,15),t.gameConfig.ready=!0,(0,t.sceneSetup)(t.gameConfig.level),f=new u.Input}(),C()}))},403:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Sea=void 0;const n=o(232),i=o(495);class r extends i.Water{constructor({scene:e,gameConfig:t,sun:o}){super(new n.PlaneGeometry(1e4,1e4),{textureWidth:512,textureHeight:512,waterNormals:(new n.TextureLoader).load("static/normals/waternormals.jpeg",(function(e){e.wrapS=e.wrapT=n.MirroredRepeatWrapping})),sunDirection:new n.Vector3,sunColor:16777215,waterColor:7695,distortionScale:3.7,fog:void 0!==e.fog}),this.scene=e,this.gameConfig=t,this.sun=o,this.rotation.x=-Math.PI/2,this.rotation.z=0,this.material.uniforms.sunDirection.value.copy(this.sun).normalize(),this.material.uniforms.speed.value=0,this.scene.add(this)}update(){this.material.uniforms.time.value+=1/60,this.gameConfig.rocketMoving&&(this.material.uniforms.speed.value+=this.gameConfig.speed/30)}}t.Sea=r},972:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Sky=void 0;const n=o(232),i=o(47);class r extends i.Sky{constructor({renderer:e,sun:t,scene:o}){super(),this.renderer=e,this.sun=t,this.scene=o;const i=this.material.uniforms;i.turbidity.value=10,i.rayleigh.value=2,i.mieCoefficient.value=.005,i.mieDirectionalG.value=.8;const r=new n.PMREMGenerator(this.renderer);this.material.uniforms.sunPosition.value.copy(this.sun),this.scene.environment=r.fromScene(this).texture,this.scale.setScalar(1e4),this.scene.add(this)}}t.Sky=r},659:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Sun=void 0;const n=o(232);class i extends n.Vector3{constructor(){super(),this.elevation=3,this.azimuth=115,this.phi=n.MathUtils.degToRad(90-this.elevation),this.theta=n.MathUtils.degToRad(this.azimuth),this.setFromSphericalCoords(1,this.phi,this.theta)}}t.Sun=i},495:(e,t,o)=>{o.r(t),o.d(t,{Water:()=>h});var n=o(150),i=o(532),r=o(282),a=o(6),s=o(158),l=o(245),c=o(980),d=o(96),m=o(14),u=o(542),g=o(369),p=o(963),f=o(407);class h extends n.K{constructor(e,t={}){super(e);const n=this,h=void 0!==t.textureWidth?t.textureWidth:512,v=void 0!==t.textureHeight?t.textureHeight:512,y=void 0!==t.clipBias?t.clipBias:0,w=void 0!==t.alpha?t.alpha:1,C=void 0!==t.time?t.time:0,x=void 0!==t.waterNormals?t.waterNormals:null,M=void 0!==t.sunDirection?t.sunDirection:new i.P(.70707,.70707,0),k=new r.I(void 0!==t.sunColor?t.sunColor:16777215),S=new r.I(void 0!==t.waterColor?t.waterColor:8355711),L=void 0!==t.eye?t.eye:new i.P(0,0,0),B=void 0!==t.distortionScale?t.distortionScale:20,P=void 0!==t.side?t.side:a.Wl3,D=void 0!==t.fog&&t.fog,b=void 0!==t.speed?t.speed:5,E=new s.J,A=new i.P,_=new i.P,O=new i.P,T=new l.y,z=new i.P(0,0,-1),I=new c.L,R=new i.P,j=new i.P,W=new c.L,U=new l.y,G=new d.c,F={minFilter:a.wem,magFilter:a.wem,format:a.wk1},q=new m.d(h,v,F);u.MathUtils.isPowerOfTwo(h)&&u.MathUtils.isPowerOfTwo(v)||(q.texture.generateMipmaps=!1);const K={uniforms:g.rD.merge([p.r.fog,p.r.lights,{normalSampler:{value:null},mirrorSampler:{value:null},alpha:{value:1},time:{value:0},size:{value:1},distortionScale:{value:20},textureMatrix:{value:new l.y},sunColor:{value:new r.I(8355711)},sunDirection:{value:new i.P(.70707,.70707,0)},eye:{value:new i.P(0,0,0)},waterColor:{value:new r.I(5592405)},speed:{value:5}}]),vertexShader:o(266).Z,fragmentShader:o(384).Z},N=new f.j({fragmentShader:K.fragmentShader,vertexShader:K.vertexShader,uniforms:g.rD.clone(K.uniforms),lights:!0,side:P,fog:D});N.uniforms.mirrorSampler.value=q.texture,N.uniforms.textureMatrix.value=U,N.uniforms.alpha.value=w,N.uniforms.time.value=C,N.uniforms.normalSampler.value=x,N.uniforms.sunColor.value=k,N.uniforms.waterColor.value=S,N.uniforms.sunDirection.value=M,N.uniforms.distortionScale.value=B,N.uniforms.speed.value=b,N.uniforms.eye.value=L,n.material=N,n.onBeforeRender=function(e,t,o){if(_.setFromMatrixPosition(n.matrixWorld),O.setFromMatrixPosition(o.matrixWorld),T.extractRotation(n.matrixWorld),A.set(0,0,1),A.applyMatrix4(T),R.subVectors(_,O),R.dot(A)>0)return;R.reflect(A).negate(),R.add(_),T.extractRotation(o.matrixWorld),z.set(0,0,-1),z.applyMatrix4(T),z.add(O),j.subVectors(_,z),j.reflect(A).negate(),j.add(_),G.position.copy(R),G.up.set(0,1,0),G.up.applyMatrix4(T),G.up.reflect(A),G.lookAt(j),G.far=o.far,G.updateMatrixWorld(),G.projectionMatrix.copy(o.projectionMatrix),U.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),U.multiply(G.projectionMatrix),U.multiply(G.matrixWorldInverse),E.setFromNormalAndCoplanarPoint(A,_),E.applyMatrix4(G.matrixWorldInverse),I.set(E.normal.x,E.normal.y,E.normal.z,E.constant);const i=G.projectionMatrix;W.x=(Math.sign(I.x)+i.elements[8])/i.elements[0],W.y=(Math.sign(I.y)+i.elements[9])/i.elements[5],W.z=-1,W.w=(1+i.elements[10])/i.elements[14],I.multiplyScalar(2/I.dot(W)),i.elements[2]=I.x,i.elements[6]=I.y,i.elements[10]=I.z+1-y,i.elements[14]=I.w,L.setFromMatrixPosition(o.matrixWorld);const r=e.getRenderTarget(),a=e.xr.enabled,s=e.shadowMap.autoUpdate;n.visible=!1,e.xr.enabled=!1,e.shadowMap.autoUpdate=!1,e.setRenderTarget(q),e.state.buffers.depth.setMask(!0),!1===e.autoClear&&e.clear(),e.render(t,G),n.visible=!0,e.xr.enabled=a,e.shadowMap.autoUpdate=s,e.setRenderTarget(r);const l=o.viewport;void 0!==l&&e.state.viewport(l)}}}h.prototype.isWater=!0}},o={};function n(e){var i=o[e];if(void 0!==i)return i.exports;var r=o[e]={exports:{}};return t[e](r,r.exports,n),r.exports}n.m=t,e=[],n.O=(t,o,i,r)=>{if(!o){var a=1/0;for(d=0;d<e.length;d++){for(var[o,i,r]=e[d],s=!0,l=0;l<o.length;l++)(!1&r||a>=r)&&Object.keys(n.O).every((e=>n.O[e](o[l])))?o.splice(l--,1):(s=!1,r<a&&(a=r));if(s){e.splice(d--,1);var c=i();void 0!==c&&(t=c)}}return t}r=r||0;for(var d=e.length;d>0&&e[d-1][2]>r;d--)e[d]=e[d-1];e[d]=[o,i,r]},n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={179:0};n.O.j=t=>0===e[t];var t=(t,o)=>{var i,r,[a,s,l]=o,c=0;if(a.some((t=>0!==e[t]))){for(i in s)n.o(s,i)&&(n.m[i]=s[i]);if(l)var d=l(n)}for(t&&t(o);c<a.length;c++)r=a[c],n.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return n.O(d)},o=self.webpackChunk=self.webpackChunk||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))})();var i=n.O(void 0,[103],(()=>n(519)));i=n.O(i)})();