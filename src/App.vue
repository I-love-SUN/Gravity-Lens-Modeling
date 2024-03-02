<template>
  <div id="app">

   <router-view/>

  </div>
</template>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    color: #2c3e50;
    height: 100%;
    width: 100%;
    overflow: auto;
    min-width: 1800px;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
}

</style>
<script>
    name = 'home';
    export default {
    }
</script>
