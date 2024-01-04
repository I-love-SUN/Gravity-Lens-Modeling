<template>
  <div>
    <h1>What is Gravitational Lensing?</h1>

    <el-link href="https://esahubble.org/videos/heic1106a/" :underline="false">
      <img style="width: 1000px;height: 750px;" src="../pics/docimage/gravitationallensing.jpg">
    </el-link>


    <h2>
      When we think of lenses, we often think of telescopes, magnifying glasses or binoculars.
      In all these devices, light enters one end of the device, gets warped and manipulated, then
      enters your eyes at the other. Gravitational lensing works under a similar principle. Light
      is emitted from distant objects, gets bent by the gravity of massive objects like stars and
      galaxies, and is observed by our telescopes and satellites. Simply, Gravitational lensing
      is when light curves around the gravity created by a large mass of galaxies. This typically
      results in seeing multiples of the same image of light, or highly distorted arclets images
      (perfectly, there will be an Einstein ring).
    </h2>


    <el-link href="https://science.nasa.gov/missions/hubble/nasa-hubble-discovers-67-new-gravitationally-lensed-galaxies-in-the-distant-universe" :underline="false">
      <el-image src="https://smd-cms.nasa.gov/wp-content/uploads/2023/04/213372main_67_hubble_lg-jpg.webp?w=1536&format=webp"
      style="width: 1000px;height: 750px"></el-image>
    </el-link>
    <h2>
      This figure shows some confirmed images of gravitational lensing systems.
      The lenses come from a recently completed, large set of observations as part
      of a huge project to survey a single 1.6-square-degree field of sky (nine
      times the area of the full Moon) with several space-based and Earth-based
      observatories. The COSMOS project, led by Nick Scoville at the California
      Institute of Technology, used observations from several observatories
      including the Hubble Space Telescope, the Spitzer Space Telescope, the
      XMM-Newton spacecraft, the Chandra X-ray Observatory, the Very Large
      Telescope (VLT), the Subaru Telescope, and the Canada-France-Hawaii
      Telescope. (From NASA)
    </h2>

    <h1>Why is Gravitational Lensing Interesting?</h1>
<!--    <el-link href="">-->
      <el-image src="https://linan7788626.github.io/pages/AMNH_Hoopla/pics/lensingapplication.jpg" style="width: 1000px;height: 500px"></el-image>
<!--    </el-link>-->
    <h2>
      In the Universe, the occurrence and morphology of lensed images reflect
      the properties of gravitational potential of the lens. It has become one
      of the most promising tools to study the mass distribution of the lenses
      and the geometry of the Universe. Lensing effects can be observed on all
      scales: weak lensing on the scale of Mpc, strong lensing on the scale of
      kpc, and micro lensing on the scale of pc. It is applied in astrophysics
      and cosmology to study a wide range of problems, e.g., reconstructing
      mass distribution of lens, identifying faint or dark substructures,
      detecting galaxies at high redshift, measuring the Hubble constant,
      amongst other applications. Thus, gravitational lensing is a universal
      tool, it extremely useful for understanding the Universe both on large
      and small scales.
    </h2>
    <h1>Gravitational Lensing in the Future</h1>
    <el-image src="https://github.com/linan7788626/Hoopla/blob/WebpageForAMNH/pics/lsst3.jpg?raw=true" style="width: 1000px;height: 400px">

    </el-image>
    <h2>
      In 2023 the Large Synoptic Survey Telescope will go online and start
      a 10 year survey of the sky. More examples of gravitational lensing
      will be found and huge amounts of data will be produced. It will be
      up to people outside the scientific community to help process through
      this data. At this point where there are few images of gravitational
      lensing, this help is relatively unnecessary. In the future however,
      it is an efficient way scientists will be able to collect meaningful
      data is through the diligent help of Citizen Scientists like you
      (there would be an alnative way which is utilizing machine learning).
      This task can be pawned off to a computer but (so far) humans have
      the best ability to recognize the complex and unique structures of a
      lensed object. Based on the idea above, we build up this Citizen
      Science project for the highly efficient analysis of a large set of
      gravitational lensing systems.
    </h2>
  </div>
</template>

<script>
  export default {
    name: "introduction",
    data(){
      return{

      }
    }
  }
</script>

<style >
  h1 {
    font-size: xx-large;
    color: GrayText;
    font-family: Times,Arial,sans-serif;
    text-align: justify;
  }
  h2{
   width: 1000px;
   text-indent: 40px;
   font-family: 'Times New Roman',Times,Arial,sans-serif;
   text-align: justify;
  }
</style>
