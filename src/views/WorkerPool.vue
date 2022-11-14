<template>
  <h1>WorkerPool</h1>
  <div class="flex">
    <input v-model="a" />
    <span>+</span>
    <input v-model="b" />
    <button class="ml-10" @click="poolAdd(+a, +b)">多线程计算</button>
    <span class="ml-10">结果: {{ addRes }}</span>
  </div>

  <div class="flex mt-10">
    <input type="number" v-model="fibonacciA" />
    <button class="ml-10" @click="pollFibonacci()">
      一个低效的斐波那契序列
    </button>
    <span class="ml-10 mr-10">用时: {{ fibonacciTime }}秒</span>
    <span>结果: {{ fibonacciRes }}</span>
  </div>

  <div class="flex mt-10 base">
    <button class="flex-shrink-0" @click="poolAjax">多线程请求Ajax</button>
    <div class="flex-1">{{ ajaxRes }}</div>
  </div>
</template>

<script setup lang="ts">
/**
 * 对npm库 workerpool的测试
 */
import { ref } from "vue";
import workerpool from "workerpool";
const pool = workerpool.pool();

const a = ref("");
const b = ref("");
const addRes = ref();

function add(a: number, b: number) {
  return a + b;
}

const poolAdd = (x: number, y: number) => {
  pool
    .exec(add, [x, y])
    .then(function (result) {
      addRes.value = result;
      a.value = "";
      b.value = "";
    })
    .catch(function (err) {
      console.error(err);
    })
    .then(function () {
      pool.terminate(); // terminate all workers when done
    });
};

const fibonacciA = ref("");
const fibonacciRes = ref();
const fibonacciTime = ref(0);

function fibonacci(n: number) {
  function fib(n: number, v1: number, v2: number): any {
    if (n == 1) return v1;
    if (n == 2) return v2;
    else return fib(n - 1, v2, v1 + v2);
  }
  return fib(n, 1, 1);
}

const pollFibonacci = () => {
  let bool = false;

  const time = setInterval(() => {
    if (!bool) fibonacciTime.value++;
  }, 1000);

  pool
    .exec(fibonacci, [+fibonacciA.value])
    .then((result) => {
      fibonacciRes.value = JSON.stringify(result);
      bool = true;
      clearInterval(time);
    })
    .catch(function (err) {
      console.error(err);
      bool = true;
      clearInterval(time);
    })
    .then(function () {
      pool.terminate(); // terminate all workers when done
    });
};

const ajax = () => {
  return fetch("http://127.0.0.1:5173/index.html").then((res) => {
    return res.text();
  });
};

const ajaxRes = ref("");

const poolAjax = () => {
  pool
    .exec(ajax, [])
    .then((result) => {
      //@ts-ignore
      ajaxRes.value = result;
    })
    .then(function () {
      pool.terminate(); // terminate all workers when done
    });
};
</script>
