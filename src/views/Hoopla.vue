<template>
    <div>
        <h1>Hoopla</h1>

        <h4><a href="https://github.com/linan7788626/hoopla">Lens
            Modeling in Javascript</a> with Elliptical Lenses and Sources
        </h4>

        <div>
            <el-row :gutter="20">
                <el-col :span="8"><div class="grid-content bg-purple"><h3 id="modeltitle">Mass Model</h3></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"><h3 id="modeltitle">Source Model</h3></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div id="disimg" class="grid-content bg-purple-light">
                    <el-image id="marking-container" :src="url"  class="bar"></el-image>
                </div></el-col>
                <el-col :span="8"><div id="disimg" class="grid-content bg-purple-light">
                    <el-image id="marking-container-src" :src="url"  class="bar"></el-image>
                </div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="grid-content bg-purple"><h3 id="modeltitle">Source Plane</h3></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"><h3 id="modeltitle">Model Plane</h3></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div id="disimg" class="grid-content bg-purple-light">
                    <el-image id="hoopla-srcmodel" :src="url"  class="bar"></el-image>
                </div></el-col>
                <el-col :span="8"><div id="disimg" class="grid-content bg-purple-light">
                    <el-image id="hoopla-prediction" :src="url"  class="bar"></el-image>
                </div></el-col>
            </el-row>
        </div>
        <el-row style="margin-top: 30px">
            <el-button type="primary" class="button" @click="handleSave">Save Models</el-button>
            <el-button type="primary" class="button" @click="handleLoad">Load Models</el-button>
            <el-button type="primary" class="button" @click="handleUpload">Upload Images</el-button>
            <el-button type="primary" class="button" @click="handleOptimization">Optimization</el-button>
        </el-row>

        <el-row style="margin-top: 20px">
            <el-input class="input" v-model="imputUrl" placeholder="Input the URL of an Image" clearable></el-input>
            <el-button type="primary" class="button" @click="handleUploadUrl">Upload URL</el-button>
        </el-row>


        <p>The Gravity Lens after modeling:</p><br/>
        <el-image id="myCanvas" style="width:400px;height:400px" class="grid-content bg-purple-light"></el-image>

    </div>

</template>

<script>
    // @ is an alias to /src
    import "../tools/ellipse"
    import "../tools/marking-surface"
    import "../tools/canvas"
    import "../model/conrec"
    import "../model/d3"
    import "../model/eelens"
    import "../model/optimize"
    import "../model/hoopla"

    export default {
        name: 'Hoopla',
        data(){
            return{
                url: 'http://raw.githubusercontent.com/linan7788626/linan7788626.github.io/master/images/ering.jpg',
                imputUrl:'',

            }

        },
        methods:{
            handleSave(){
                console.log('save')
            },
            handleLoad(){
                console.log('load')
            },
            handleUpload(){
                console.log('upload image')
            },
            handleOptimization(){
                console.log('optimization')
            },
            handleUploadUrl(){
                console.log('upload URL')
            }
        },
        created() {

        }
    }
</script>

<style>
    .input{
        width: 730px;
        margin-right: 25px;
    }
    #modeltitle {
        line-height: 36px;
        text-align: center;
        color: black;
        vertical-align: center;
        font-family: Sans-serif;
        font-size: large;
        margin-bottom: 0px;
    }
    .el-row {
        margin-bottom: 20px;
    &:last-child {
         margin-bottom: 0;
     }
    }
    .el-col {
        border-radius: 5px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
        height: 400px;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;

    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    #disimg {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    body ,html {
        height: 100%;
        width: 100%;
        margin: 0;
        overflow: auto;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    .container {
        width: 840px;
    }

    h1, h2, h3, h4 { font-family: Arial,serif; }
    h1 { margin-bottom: 0.5em; }

    h4 { color: #666666; }
    a { color: #666666; }

    .inline {
        position: relative;
        display: inline;
        margin-left: 5px;
    }

    .inline-block {
        display: inline-block;
    }

    .captions {
        font-size:20px;
        font-weight: bold;
        display: block;
        height: 40px;
    }


    .bar {
        width: 400px;
        height: 400px;
        float: left;
        border: 1px solid #666666;
        background-image: url("http://raw.githubusercontent.com/linan7788626/linan7788626.github.io/master/images/ering.jpg");
        background-size: 400px 400px;
        border-radius: 4px;
    }
    .barTitle {
        font-family: Arial,serif;
        padding-bottom:20px;
        font-size:22px;
        font-weight: bold;
        width: 400px;
        height: 20px;
        float: left;
        margin: 5px;
        margin-bottom: -5px;
        border: 1px solid #666666;
        background-color:#666666;
    }

    .greywords {
        color: #666666;
    }

    #footer {
        position:absolute;
        color: #666666;
        bottom:0;
        margin-bottom:40px;
        width:100%;
        height:100px;   /* Height of the footer */
    }

    .button {
        margin-right: 40px;
        text-align: center;
        font-size: 18px;
        padding: 10px;
        width: 200px;
        transition: all 0.5s;
        cursor: pointer;
    }

    .button span {
        cursor: pointer;
        display: inline-block;
        position: relative;
        transition: 0.5s;
    }

    .button span:after {
        content: '»';
        position: absolute;
        opacity: 0;
        top: 0;
        right: -20px;
        transition: 0.5s;
    }

    .button:hover span {
        padding-right: 25px;
    }

    .button:hover span:after {
        opacity: 1;
        right: 0;
    }

    #homebutton {
        position: absolute;
        left: 1035px;
        top: 30px;
    }

    .Uploadbtn {
        position: relative;
        overflow: hidden;

        display: inline-block;
        border-radius: 2px;
        background-color: #0f79ac;
        border: none;
        color: #FFFFFF;
        text-align: center;
        font-size: 18px;
        padding: 10px;
        width: 200px;
        transition: all 0.5s;
        cursor: pointer;
        margin: 5px;
    }

    .Uploadbtn .input-upload {
        position: absolute;
        top: 0;
        right: 0;
        margin: 0;
        padding: 0;
        opacity: 0;
        height:100%;
        width:100%;
    }

    #textbox1 {
        border: 0px #666666;
        border-radius: 2px;
        font-size: 18px;
        margin: 5px;
        margin-bottom: 0px;
        padding: 10px;
        width: 620px;
        height: 20px;
    }

    .wrapper {
        margin: 5px;
        background-color: #666666;
        border:0px solid #666666;
        border-radius: 2px;
        display:inline-block;
    }

</style>
