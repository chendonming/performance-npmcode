import * as THREE from 'three'

export function vector3Helper(v: THREE.Vector3, color?: number) {
    const geometry = new THREE.BoxGeometry(.5, .5, .5);
    const material = new THREE.MeshBasicMaterial({color: color || 0xff0000});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(v)
    return cube;
}

/**
 * 创建深度贴图
 */
export function createADepthMap(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, width: number, height: number) {
    const target = new THREE.WebGLRenderTarget(width, height)
    target.depthTexture = new THREE.DepthTexture(width, height)

    camera.setViewOffset(
        renderer.domElement.width,
        renderer.domElement.height,
        0,
        0,
        renderer.domElement.width,
        renderer.domElement.height
    );

    renderer.setRenderTarget(target);
    renderer.render(scene, camera);

    renderer.setRenderTarget(null);

    return target.depthTexture
}