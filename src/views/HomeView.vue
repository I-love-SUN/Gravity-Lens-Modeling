<template>
  <div id="test1" style="width: 100%;height: 100%">

      <h1>{{title}}</h1>
      <canvas id="Canvas" style="height: 400px;width: 800px;background-color: #e3e3bd;position: center">
      </canvas>
      <br/>
      <div id="test">
          test
      </div>
  </div>

</template>

<script>
// @ is an alias to /src
import MarkingSurface from '../tools/marking-surface';
export default {
    name: 'home',
    data(){
        return{
            title: 'Home',
        }
    },

    mounted() {
        const canvas = document.getElementById('Canvas');

    }
}
</script>

<style>

  .bg-img {
    background-image: url("../assets/Bg.jpg");
    background-repeat: no-repeat;
    height: 100%;
    width : 100%;
    background-position: center; /* 图片居中 */
    background-size: cover; /* 此时会保持图像的纵横比并将图像缩放成将完全覆盖背景定位区域的最小大小 */
    position: absolute;
  }

  body ,html {
    height: 100%;
    width: 100%;
    margin: 0;
    overflow: hidden;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

</style>
