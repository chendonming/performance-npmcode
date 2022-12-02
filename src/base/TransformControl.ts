import { Box3, Camera, Color, CylinderGeometry, Event, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, Raycaster, SphereGeometry, Vector2, Vector3 } from "three";

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'

const raycaster = new Raycaster();
let temp1 = new Vector3()
let temp2 = new Vector2()
let tempAxes: string;

/**
 * 自定义控制器
 */
class TransformControl extends Object3D {
  object: Object3D<Event> | null;
  a: Mesh = new Mesh();
  b: Mesh = new Mesh();
  c: Mesh = new Mesh();
  d: Mesh = new Mesh();
  e: Mesh = new Mesh();
  f: Mesh = new Mesh();
  dom: HTMLElement;
  camera: Camera;
  onDragChange: ((a: boolean) => any) | undefined;
  // 1像素对应的单位大小
  unitSize: number;
  pointdown: boolean;

  constructor(camera: Camera, dom: HTMLElement) {
    super();

    this.camera = camera;
    this.visible = true;
    this.createAxes();
    this.object = null;
    this.dom = dom;
    this.unitSize = 0;

    this.dom.addEventListener('pointermove', this.onPointerMove.bind(this))
    this.dom.addEventListener('pointerdown', this.onPointerDown.bind(this))
    this.dom.addEventListener('pointerup', this.onPointerUp.bind(this))
    this.dom.addEventListener('wheel', this.updateAxes.bind(this))

    this.pointdown = false;
  }

  attach(object: Object3D<Event>): this {
    this.object = object
    this.visible = true;
    this.updateAxes();
    return this
  }

  /**
   * 开启事件监听
   */
  onPointerMove(e: PointerEvent) {
    if (!this.visible || !this.object) return;
    const pointer = new Vector2();
    pointer.x = (e.clientX / this.dom.clientWidth) * 2 - 1;
    pointer.y = - (e.clientY / this.dom.clientHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, this.camera);

    if (!this.pointdown)
      this.resetAxesColor()

    const a = raycaster.intersectObjects([this, this.object], true)
    if (a.length > 0) {
      this.onDragChange && this.onDragChange(true)
      this.handleMouseHoverObject(true)
      // hover
      if (!this.pointdown) {
        a.forEach(row => {
          if (['a', 'b', 'c', 'd', 'e', 'f'].includes(row.object.name)) {
            //@ts-ignore
            this[row.object.name].material.color = new Color(0xffff00)
          }
        })
      }
    } else {
      this.onDragChange && this.onDragChange(false)
      this.handleMouseHoverObject(true)
    }

    if (tempAxes) {
      const n = new Vector2(e.clientX, e.clientY)
      let dis;
      if (['a', 'b'].includes(tempAxes)) {
        dis = temp2.x - n.x;
      }
      if (['c', 'd'].includes(tempAxes)) {
        dis = n.y - temp2.y;
      }
      if (['e', 'f'].includes(tempAxes)) {
        dis = temp2.y - n.y;
      }
      if (dis !== undefined)
        this.updateObjectPosition(dis, tempAxes)
    }
  }

  resetAxesColor() {
    ['a', 'b', 'c', 'd', 'e', 'f'].forEach((key) => {
      //@ts-ignore
      this[key].material.color = new Color(this[key].material.userData.color)
    })
  }

  /**
   * 更新object的位置
   */
  updateObjectPosition(dis: number, axes: string) {
    if (!this.object) return;
    switch (axes) {
      case "a":
      case "b":
        this.object.position.x = -dis * this.unitSize + temp1.x
        this.position.x = this.object.position.x
        break;
      case "c":
      case "d":
        this.object.position.y = -dis * this.unitSize + temp1.y
        this.position.y = this.object.position.y
        break;
      case "e":
      case "f":
        this.object.position.z = -dis * this.unitSize + temp1.z
        this.position.z = this.object.position.z
        break;
    }
  }

  onPointerUp() {
    tempAxes = ''
    this.pointdown = false
  }

  /**
   * 三维转二维
   */
  unprojectPoint(point: Vector3): Vector3 {
    const unprojectPoint = point.clone().project(this.camera);
    unprojectPoint.x = (this.dom.clientWidth * (unprojectPoint.x + 1) / 2);
    unprojectPoint.y = (this.dom.clientHeight * (-unprojectPoint.y + 1) / 2);
    return unprojectPoint;
  }

  /**
   * 二维转三维
   */
  projectPoint(x: number, y: number, z = 0.5): Vector3 {
    const v = new Vector3();
    v.x = (x - this.dom.clientWidth * 0.5) / (this.dom.clientWidth * 0.5);
    v.y = (this.dom.clientHeight * 0.5 - y) / (this.dom.clientHeight * 0.5);
    v.z = z;
    v.unproject(this.camera);
    return v;
  }

  /**
   * 开启事件监听
   */
  onPointerDown(e: PointerEvent) {
    if (!this.visible || !this.object) return;
    const pointer = new Vector2();
    pointer.x = (e.clientX / this.dom.clientWidth) * 2 - 1;
    pointer.y = - (e.clientY / this.dom.clientHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, this.camera);
    const a = raycaster.intersectObject(this, true)
    this.pointdown = true;
    if (a.length > 0) {
      a.forEach(row => {
        if (row.object.name) {
          temp1 = this.object?.position.clone()!;
          temp2.set(e.clientX, e.clientY)
          tempAxes = row.object.name

          this.computedUnitSize(row.point)
        }
      })
    }
  }

  /**
   * 计算像素单位大小
   */
  computedUnitSize(p: Vector3) {
    const p2 = this.unprojectPoint(p)
    const point = this.projectPoint(p2.x + 5, p2.y, p2.z)
    const distance = point.distanceTo(p)
    this.unitSize = distance / 5
  }


  handleMouseHoverObject(bool: boolean) {
    this.a.visible = bool;
    this.b.visible = bool;
    this.c.visible = bool;
    this.d.visible = bool;
    this.e.visible = bool;
    this.f.visible = bool;
  }

  /**
   * 更新轴的位置信息
   */
  updateAxes() {
    if (this.object instanceof Mesh) {
      this.object.geometry.computeBoundingBox()
      const PI = Math.PI;

      const halfX = 0
      const halfY = 0
      const halfZ = 0

      this.a.rotation.z = PI / 2
      this.b.rotation.z = -PI / 2
      this.c.rotation.x = PI
      this.e.rotation.x = PI / 2
      this.f.rotation.x = -PI / 2

      this.computedUnitSize(this.object.position)
      const proportion = 0.006187660975522426
      const scale = this.unitSize / proportion

      this.a.scale.set(scale, scale, scale)
      this.b.scale.set(scale, scale, scale)
      this.c.scale.set(scale, scale, scale)
      this.d.scale.set(scale, scale, scale)
      this.e.scale.set(scale, scale, scale)
      this.f.scale.set(scale, scale, scale)

      this.a.position.set(0 - halfX - scale / 2, 0, 0);
      this.b.position.set(0 + halfX + scale / 2, 0, 0);
      this.c.position.set(0, 0 - halfY - scale / 2, 0);
      this.d.position.set(0, 0 + halfY + scale / 2, 0);
      this.e.position.set(0, 0, 0 + halfZ + scale / 2);
      this.f.position.set(0, 0, 0 - halfZ - scale / 2);
    }
  }

  createPointHelper(v: Vector3) {
    const geometry = new SphereGeometry(.1, 32, 16);
    const material = new MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new Mesh(geometry, material);
    sphere.position.copy(v.clone())
    this.add(sphere)
  }

  /**
   * 创建基础的移动轴
   */
  createAxes() {
    const a = this.arrowMesh(0xff0000)
    const b = this.arrowMesh(0x00ff00)
    const c = this.arrowMesh(0x0000ff)
    const d = this.arrowMesh(0x00ffff)
    const e = this.arrowMesh(0xff00ff)
    const f = this.arrowMesh(0x000000)
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
    this.a.name = 'a';
    this.b.name = 'b';
    this.c.name = 'c';
    this.d.name = 'd';
    this.e.name = 'e';
    this.f.name = 'f';
    this.add(a, b, c, d, e, f)
  }

  arrowMesh(color: number = 0xff0000) {
    const arrowGeometry = new CylinderGeometry(0, 0.04, 0.1, 12);
    const material = new MeshPhongMaterial({ color: new Color(color), depthTest: false })
    arrowGeometry.translate(0, .55, 0)

    const bodyGeometry = new CylinderGeometry(0.02, 0.02, 1, 12)

    const geometry = BufferGeometryUtils.mergeBufferGeometries([arrowGeometry, bodyGeometry])
    material.userData.color = color;

    return new Mesh(geometry, material)
  }
}
export { TransformControl };
