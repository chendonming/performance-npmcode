<template></template>

<script setup lang="ts">
import * as THREE from "three";
//@ts-ignore
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
/**
 * pbr光照模型
 */
const props = defineProps({
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  controls: Object,
});
const { scene, renderer, camera, controls } = props;
if (scene) scene.background = new THREE.Color(0x000);
/*language=glsl*/
const vertexShader = `
  varying vec3 aNormal;
  varying vec3 afragPos;
  varying vec2 aUv;

  void main () {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    aNormal = normal;
    aUv = uv;
    afragPos = vec3(modelMatrix * vec4(position, 1.));
  }
`
/*language=glsl*/
const fragmentShader = `
  // 定向光
  struct DirLight {
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
  };

  // 自身材质
  struct Material {
    sampler2D diffuse;
    sampler2D specular;
    float shininess;
  };

  // 点光源
  struct PointLight {
    vec3 position;

    float constant;
    float linear;
    float quadratic;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
  };

  // 聚光灯
  struct Spotlight {
    vec3 position;
    vec3 direction;
  // 切光角
    float cutOff;
    float outerCutOff;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
  };

  uniform DirLight dirLight;
  uniform Material material;
  uniform vec3 viewPos;

  #define NR_POINT_LIGHTS 1
  uniform PointLight pointLights[NR_POINT_LIGHTS];

  uniform Spotlight spotlight;

  varying vec2 aUv;
  varying vec3 aNormal;
  varying vec3 afragPos;

  // 定向光贡献
  vec3 CalcDirLight(DirLight light, vec3 viewDir) {
    vec3 norm = normalize(aNormal);
    vec3 lightDir = normalize(-light.direction);

    float diff = max(dot (norm, lightDir), 0.0);
    vec3 diffuse = diff * light.diffuse * vec3(texture (material.diffuse, aUv));

    vec3 reflectDir = reflect(-lightDir, norm);

    float spec = pow(max (dot (viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = vec3(texture (material.specular, aUv)) * spec * light.specular;

    vec3 ambient = light.ambient * vec3(texture (material.diffuse, aUv));

    return ambient + diffuse + specular;
  }

  // 点光源贡献
  vec3 CalcPointLight(PointLight light, vec3 viewDir) {
    vec3 lightDir = normalize(light.position - afragPos);

    float diff = max(dot(aNormal, lightDir), 0.0);

    vec3 reflectDir = reflect(-lightDir, aNormal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // 衰减
    float distance = length(light.position - afragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));

    vec3 ambient  = light.ambient  * vec3(texture(material.diffuse, aUv));
    vec3 diffuse  = light.diffuse  * diff * vec3(texture(material.diffuse, aUv));
    vec3 specular = light.specular * spec * vec3(texture(material.specular, aUv));
    ambient  *= attenuation;
    diffuse  *= attenuation;
    specular *= attenuation;
    return ambient + diffuse + specular;
  }

  // 聚光灯贡献
  vec3 CalcSpotlight(Spotlight light, vec3 viewDir) {
    vec3 lightDir = normalize(light.position - afragPos);
    float diff = max(dot(aNormal, lightDir), 0.0);
    vec3 reflectDir = reflect(-lightDir, aNormal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);

    float theta     = dot(lightDir, normalize(-light.direction));
    float epsilon   = light.cutOff - light.outerCutOff;
    float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);

    vec3 ambient  = light.ambient  * vec3(texture(material.diffuse, aUv));
    vec3 diffuse  = light.diffuse  * diff * vec3(texture(material.diffuse, aUv));
    vec3 specular = light.specular * spec * vec3(texture(material.specular, aUv));
    ambient  *= intensity;
    diffuse  *= intensity;
    specular *= intensity;

    return ambient + diffuse + specular;
  }

  void main() {
    vec3 outputColor;

    vec3 viewDir = normalize(viewPos - afragPos);
    outputColor += CalcDirLight(dirLight, viewDir);

    for (int i = 0; i < NR_POINT_LIGHTS; i++)
    outputColor += CalcPointLight(pointLights[i], viewDir);

    outputColor += CalcSpotlight(spotlight, viewDir);
    gl_FragColor = vec4(outputColor, 1.);
  }
`

const objMaterial = new THREE.ShaderMaterial({
  uniforms: {
    viewPos: {
      value: camera?.position.clone(),
    },
    dirLight: {
      value: {
        direction: new THREE.Vector3(-1, -1, 0),
        ambient: new THREE.Vector3(0.1, 0.1, 0.1),
        diffuse: new THREE.Vector3(1, 1, 1),
        specular: new THREE.Vector3(0.8, 0.8, 0.8),
      },
    },
    material: {
      value: {
        diffuse: new THREE.TextureLoader().load("diffuse.png"),
        specular: new THREE.TextureLoader().load("specular.png"),
        shininess: 32.0,
      },
    },
    pointLights: {
      value: [
        {
          position: new THREE.Vector3(0, 0, 0),
          constant: 1.0,
          linear: 0.09,
          quadratic: 0.032,
          ambient: new THREE.Vector3(0.1, 0.1, 0.1),
          diffuse: new THREE.Vector3(1, 1, 1),
          specular: new THREE.Vector3(0.8, 0.8, 0.8),
        },
      ],
    },
    spotlight: {
      value: {
        position: new THREE.Vector3(0.5, 5, 2),
        direction: new THREE.Vector3(0, -1, 0),
        cutOff: Math.cos(Math.PI / 8),
        outerCutOff: Math.cos(Math.PI / 6),
        ambient: new THREE.Vector3(0.05, 0.05, 0.05),
        diffuse: new THREE.Vector3(1, 1, 1),
        specular: new THREE.Vector3(0.8, 0.8, 0.8),
      },
    },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

const geometry = new THREE.BoxGeometry(1, 1, 1);

const cube1 = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);

cube1.position.copy(objMaterial.uniforms.spotlight.value.position);
cube1.scale.set(0.2, 0.2, 0.2);
scene?.add(cube1);

{
  const cube = new THREE.Mesh(geometry, objMaterial);
  cube.position.set(1, 1, 1);
  scene?.add(cube);
}
{
  const cube = new THREE.Mesh(geometry, objMaterial);
  cube.position.set(1, 2, 1);
  scene?.add(cube);
}
{
  const cube = new THREE.Mesh(geometry, objMaterial);
  cube.position.set(0, 1, 1);
  scene?.add(cube);
}
{
  const cube = new THREE.Mesh(geometry, objMaterial);
  cube.position.set(0, 3, 1);
  scene?.add(cube);
}

camera?.position.set(4, 4, 4);
controls?.update();

const obj = {
  lightx: 3,
  lighty: 0,
  lightz: 0,
  ambient: 0.1,
  specular: 0.8,
  shininess: 32.0,
  lightColor: 0xffffff,
};

const gui = new GUI();
gui.addColor(obj, "lightColor").onChange((v: number) => {
  objMaterial.uniforms.lightColor.value = new THREE.Color(v);
});
gui.add(obj, "ambient", 0.0, 1.0).onChange((v: number) => {
  objMaterial.uniforms.material.value.ambient = v;
});
gui.add(obj, "shininess", 1.0, 256.0).onChange((v: number) => {
  objMaterial.uniforms.material.value.shininess = v;
});

renderer?.setAnimationLoop(() => {
  objMaterial.uniforms.viewPos.value = camera?.position.clone();
  // 生成深度贴图
});
</script>
