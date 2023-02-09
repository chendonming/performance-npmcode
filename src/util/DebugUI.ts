import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * 查看深度贴图
 * @param scene 传入的场景
 * @param camera 传入的相机
 * @param width 输出的DIV宽度
 * @param height 输出的DIV高度
 */
function viewTheCurrentDepthMap(scene: THREE.Scene, camera: THREE.PerspectiveCamera, width: number, height: number, option?: any) {
    /*language=glsl*/
    const vertexShader = `
        varying vec2 aUv;
        void main () {
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
            aUv = uv;
        }
    `

    /*language=glsl*/
    const fragmentShader = `
        #include <packing>
        uniform sampler2D aDepthMap;
        uniform float cameraNear;
        uniform float cameraFar;
        varying vec2 aUv;

        float readDepth(sampler2D depthSampler, vec2 coord) {
            float fragCoordZ = texture2D(depthSampler, coord).x;
            float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
            return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
        }

        void main() {
            float depth = readDepth(aDepthMap, aUv) * 100.;

            gl_FragColor.rgb = vec3(depth);
            gl_FragColor.a = 1.0;
        }
    `

    const postMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            aDepthMap: {
                value: null
            },
            cameraNear: {
                value: camera.near
            },
            cameraFar: {
                value: camera.far
            }
        }
    })

    const postPlane = new THREE.PlaneGeometry(2, 2);
    const postQuad = new THREE.Mesh(postPlane, postMaterial);
    const postScene = new THREE.Scene()
    postScene.add(postQuad)

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
    })

    renderer.setSize(width, height);
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1);

    document.body.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'position: fixed; left: 20px; bottom: 20px;border: 1px solid #000'

    const c = new OrbitControls(postCamera, renderer.domElement);
    postCamera.position.set(0, 0, 10);
    c.update()

    const target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    target.depthTexture = new THREE.DepthTexture(window.innerWidth, window.innerHeight);

    function animate() {
        requestAnimationFrame(animate)
        renderer.setRenderTarget(target);
        renderer.render(scene, camera);

        postMaterial.uniforms.aDepthMap.value = target.depthTexture;

        renderer.setRenderTarget(null);
        renderer.render(postScene, postCamera);
    }

    animate()

}

export default {
    viewTheCurrentDepthMap
}