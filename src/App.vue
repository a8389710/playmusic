<template>
  <div id="app">
    <router-view/>
<!--vue-ssr-outlet-->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html {
 margin-bottom: 120px
}
body {
  position: relative;
  background: rgb(240, 240, 240);
  min-width: 1100px;
  margin-bottom:40px;
  position: relative;
  overflow-y: scroll;
}
::-webkit-scrollbar {
  margin-left:100px;
  background: none;
  opacity: 0;
}
::-webkit-scrollbar-thumb  {/*滚动条里面方块*/
        height: 100px;
        border-radius: 10px;
        background: rgba(136, 129, 129, 0.685);
    }

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
ul {list-style: none}
* {
  box-sizing: border-box;
  margin:0;
  padding: 0;
}
/* input-num属性时去掉右侧默认控件 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}


</style>
