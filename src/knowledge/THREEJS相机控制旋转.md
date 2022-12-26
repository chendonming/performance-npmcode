# 相机控制旋转

[实验内容](./../views/three/SphericalCamera.vue)

对于相机旋转比较好的是使用球坐标系，相对于直角坐标系而言，球坐标系用来描述旋转更加合适直观且对于方位角、极角而言属于线性改变。对于线性函数我们是非常喜欢的，因为线性代表简单，能用越简单的函数来描述关系的就越适合。

再想一下如果使用笛卡尔坐标系来解决角度问题，那么一定是个三角函数，三角函数复杂度大于线性函数，这是我们不想看到的。

下图所示是球坐标系示意图：

![维基百科-球坐标系](https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/3D_Spherical.svg/923px-3D_Spherical.svg.png)

# 代码解释

```js
// 获取二维坐标 将原本在左上角的原点移动到屏幕中心，现在取值范围是[-1,1]
const offsetX = ((e.offsetX - mouseDownX) / dom.clientWidth) * 2;
const offsetY = ((e.offsetY - mouseDownY) / dom.clientHeight) * 2;
const matrix3 = new THREE.Matrix3();
mouseDownX = e.offsetX;
mouseDownY = e.offsetY;

// 记住原本相机的位置，我们只移动视角不移动位置
cameraPosition.copy(camera.position);

let rotation = new THREE.Vector3(0, 0, -1);
// 取得相机的世界坐标的归一化坐标
rotation.applyNormalMatrix(matrix3.setFromMatrix4(camera.matrixWorld));
let spherical = new THREE.Spherical();
// 从归一化坐标设置球，可以说是将相机坐标映射到了半径为1的球坐标系上
// setFromVector3用于设置theta和phi, 等于是将笛卡尔坐标系换算成球坐标系
spherical.setFromVector3(rotation);
// 上一步将笛卡尔坐标系换算成球坐标系后，theta和phi都是线性改变的了，对theta和phi相加减即可
spherical.theta -= offsetX;
spherical.phi += offsetY;

spherical.makeSafe();
rotation.setFromSpherical(spherical);

// 相机移动到原点 因为球坐标系在原点
camera.position.set(0, 0, 0);
camera.lookAt(rotation.x, rotation.y, rotation.z);
// 视角改变后移动到原位置，深藏功与名
camera.position.copy(cameraPosition);
camera.updateMatrixWorld();
```
