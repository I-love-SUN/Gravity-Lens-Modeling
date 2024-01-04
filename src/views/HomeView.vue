<template>
  <div style="width: 100%;height: 100%">

      <h1>{{title}}</h1>
      <canvas id="Canvas" style="height: 400px;width: 800px;background-color: #e3e3bd;position: center">
      </canvas>
      <br/>
      <a :href="url">b站课程</a>
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
            url: 'https://www.bilibili.com/video/BV1Zy4y1K7SH?p=8&spm_id_from=pageDriver&vd_source=785f1c4479d09b38815d7d72978c6aa6'
        }
    },

    created() {

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
