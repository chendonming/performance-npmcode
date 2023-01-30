import * as THREE from 'three'

export function vector3Helper(v: THREE.Vector3, color?: number) {
  const geometry = new THREE.BoxGeometry(.5, .5, .5);
  const material = new THREE.MeshBasicMaterial({ color: color || 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.copy(v)
  return cube;
}