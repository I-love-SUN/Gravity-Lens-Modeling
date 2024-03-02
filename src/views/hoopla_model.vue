<template>
    <div>
        <h1 id="hhh">Hoopla</h1>

        <h4><a href="https://github.com/linan7788626/hoopla">Lens
            Modeling in Javascript</a> with Elliptical Lenses and Sources
        </h4>

        <div>
            <el-row :gutter="20">
                <el-col :span="8"><div class="grid-content bg-purple"><h3 class="modeltitle">Mass Model</h3></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"><h3 class="modeltitle">Source Model</h3></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div  class="disimg grid-content bg-purple-light">
                        <div id="marking-container"   class="bar"></div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div  class="disimg grid-content bg-purple-light">
                        <div id="marking-container-src"   class="bar"></div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="grid-content bg-purple"><h3 class="modeltitle">Source Plane</h3></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"><h3 class="modeltitle">Model Plane</h3></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div  class="disimg grid-content bg-purple-light">
                        <div id="hoopla-srcmodel"  class="bar">
                            <p id="tag" style="display: none">Freezed</p>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div  class="disimg grid-content bg-purple-light">
                        <div id="hoopla-prediction"   class="bar"></div>
                   </div>
                </el-col>
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
    import "../model/conrec"
    import "../model/d3"
    import "../model/eelens"
    import "../model/optimize"
    import "@/model/hoopla"

    export default {
        name: 'hoopla_model',
        data(){
            return{
                msg: 'hello',
                url: 'http://raw.githubusercontent.com/linan7788626/linan7788626.github.io/master/images/ering.jpg',
                imputUrl:'',
                imgd: new Image(400, 400),
                img: null,
                img_src: null,

                // lets: '',
                // ms: '',
                // ms_src: '',
                // containerEl_src: '',
                // containerEl: '',
                // timer: '',

            }
        },


        methods:{

            handleSave(){
                console.log('save')
                this.lets.showModels();
            },
            handleLoad(){
                console.log('load')
                let input = e.target;
                let reader = new FileReader();
                reader.onload = function(){
                    const text = reader.result;
                    const data = JSON.parse(text);
                    this.lets.loadModel(data.components);
                };
                reader.readAsText(input.files[0]);
            },
            handleUpload(){
                console.log('upload image')
                let imageFile = HTMLInputElement.files[0];
                let url = window.URL.createObjectURL(imageFile);
                this.img.src = url;
                this.img_src.src = url;
                document.getElementById("hoopla-srcmodel").style.backgroundImage
                    = "url(" + url + ")";
                document.getElementById("hoopla-prediction").style.backgroundImage
                    = "url(" + url + ")";
            },

            handleUploadUrl(){
                console.log('upload URL')
                let url = this.imputUrl.value();
                this.img.src = url;
                this.img_src.src = url;
                document.getElementById("hoopla-srcmodel").style.backgroundImage
                    = "url(" + url + ")";
                document.getElementById("hoopla-prediction").style.backgroundImage
                    = "url(" + url + ")";
            },
            calAlpha(xl,yl,xlc,ylc,re,ql,phl) {
                if(ql <1.0){
                    phl = Math.PI * ((-phl+90) / 180);
                }else{
                    ql = 1.0/ql-0.0000000001;
                    phl = Math.PI * (-phl / 180);
                }

                let	alpha = { x: 0.0, y: 0.0 };
                let x,y,cs, sn;
                let sx_r, sy_r, psi, sq, pd1, pd2, fx1, fx2, qs, a1, a2;
                let rc = 0.0;

                cs = Math.cos(phl);
                sn = Math.sin(phl);

                x = xl - xlc;
                y = yl - ylc;

                sx_r = x * cs + y * sn;
                sy_r = -x * sn + y * cs;

                psi = Math.sqrt(ql*ql*(rc*rc+sx_r*sx_r)+sy_r*sy_r);

                sq = Math.sqrt(1.0-ql*ql);
                pd1 = psi + rc;
                pd2 = psi + rc*ql*ql;
                fx1 = sq * sx_r / pd1;
                fx2 = sq * sy_r / pd2;
                qs = Math.sqrt(ql);

                a1 = qs / sq * Math.atan(fx1);
                a2 = qs / sq * Math.atanh(fx2);

                dx = (a1 * cs - a2 * sn);
                dy = (a2 * cs + a1 * sn);

                // Add lensing effects of just this component:
                alpha.x = re*dx;
                alpha.y = re*dy;
                return alpha;
            },

            calImage(xs, ys, xsc, ysc, sig2, qs, phs) {
                let r2, res, phirad;
                // Loop over x and y. Store 1-D pixel index as i.
                phirad = -phs/180*Math.PI;
                let xnew = (xs-xsc) * Math.cos(phirad) + (ys-ysc) * Math.sin(phirad)
                let ynew = (ys-ysc) * Math.cos(phirad) - (xs-xsc) * Math.sin(phirad)
                r2 = ( xnew*xnew/qs + ynew*ynew*qs );
                res = Math.exp(-r2/(2.0*sig2*sig2*0.693));
                return res; // Allow this function to be chainable
            },

            model_lensed_images(p, x1, x2) {
                let xc1, xc2, re, ql, phl;
                xc1 = p[0];
                xc2 = p[1];
                re = p[2];
                ql = p[3];
                phl = p[4];

                let alpha = this.calAlpha(x1,x2,xc1,xc2,re,ql,phl);

                let y1 = x1 - alpha.x;
                let y2 = x2 - alpha.y;

                let yc1, yc2, sig2, qs, phs;
                yc1 = p[5];
                yc2 = p[6];
                sig2 = p[7];
                qs = p[8];
                phs = p[9];

                return this.calImage(y1, y2, yc1, yc2, sig2, qs, phs);
            },

            standardDeviation(values){
                let avg = this.average(values);

                let squareDiffs = values.map(function(value){
                    let diff = value - avg;
                    return diff * diff;
                });

                let avgSquareDiff = this.average(squareDiffs);

                return Math.sqrt(avgSquareDiff);
            },

            average(data){
                let sum = data.reduce(function(sum, value){
                    return sum + value;
                }, 0);

                return sum / data.length;
            },
            chi2_rescale(p) {
                let c = document.getElementById("myCanvas");
                let ctx = c.getContext("2d");
                ctx.drawImage(this.imgd, 0, 0);
                let dstdata = ctx.getImageData(0, 0, this.imgd.width, this.imgd.height);
                let data = dstdata.data;

                let red = new Array(data.length/4);
                for(let i = 0, n = red.length; i < n; i ++) {
                    red[i] = data[i*4]/255.;
                }

                const fscale = 4;
                let chi = new Array(red.length/fscale/fscale);
                let testimg = new Array(red.length);
                let redstd = this.standardDeviation(red);
                for(let row = 0 ; row < this.imgd.width ; row+=fscale){
                    for(let col = 0 ; col < this.imgd.height ; col+=fscale){
                        i = row*this.imgd.height+col;
                        i2 = row/fscale*this.imgd.height/fscale+col/fscale;
                        x = col*0.0225 - 4.5;
                        y = row*0.0225 - 4.5;
                        testimg[i] = this.model_lensed_images(p, x, y);
                        chi[i2] = (red[i] -
                            testimg[i])/redstd/redstd/(chi.length);
                    }
                }
                let res = optimize.vector.dot(chi, chi);
                console.log(res);

                return res;
            },


            show_res(p) {
                let i;

                const c = document.getElementById("myCanvas");
                const ctx = c.getContext("2d");
                ctx.drawImage(this.imgd, 0, 0);
                let dstdata = ctx.getImageData(0, 0, this.imgd.width, this.imgd.height);
                let data = dstdata.data;

                let red = new Array(data.length/4);
                i = 0;
                const n = red.length;
                for(; i < n; i ++) {
                    red[i] = data[i*4]/255.;
                }


                let chi = new Array(red.length);
                let testimg = new Array(red.length);
                let redstd = this.standardDeviation(red);
                for(let row = 0 ; row < 400 ; row++){
                    for(let col = 0 ; col < 400 ; col++){
                        i = row*400+col;
                        x = col*0.0225 - 4.5;
                        y = row*0.0225 - 4.5;
                        testimg[i] = this.model_lensed_images(p, x, y);
                        //chi[i] = (red[i] - testimg[i])*red[i]*red[i];
                        chi[i] = (red[i] - testimg[i])/redstd/redstd;
                    }
                }
                let res = optimize.vector.dot(chi, chi);
                console.log(res);

                for (let y = 0; y < this.imgd.width; ++y) {
                    for (let x = 0; x < this.imgd.height; ++x) {
                        let index = (y * this.imgd.width + x) * 4;
                        let index2 = (y * this.imgd.width + x);

                        //data[index]   = Math.floor(red[index2]*255);    // red
                        //data[index]   = Math.floor(testimg[index2]*255);    // red
                        data[index]   = Math.floor(Math.abs(testimg[index2]-red[index2])*255);    // red
                        //data[index]   = 128;    // red
                        data[++index] = 0;    // green
                        data[++index] = 0;    // blue
                        data[++index] = 255;      // alpha
                    }
                }

                dstdata.data = data;
                ctx.putImageData(dstdata, 0, 0);
                return res;
            },


             updateCanvas(p1) {
                 let ang = this.$data.lets.lens.ang2pix({x: p1[0], y: p1[1]});
                 this.$data.ms.tools[0].mark.x = ang.x;
                 this.$data.ms.tools[0].mark.y = ang.y;
                 this.$data.ms.tools[0].mark.angle = p1[4];
                 this.$data.ms.tools[0].mark.ry = p1[2]/(this.lets.lens.pixscale*Math.sqrt(p1[3]));
                 this.$data.ms.tools[0].mark.rx = ms.tools[0].mark.ry * p1[3];
                 this.$data.ms.renderTools();

                 let ang2 = this.$data.lets.lens.ang2pix({x: p1[5], y: p1[6]});
                 this.$data.ms_src.tools[0].mark.x = ang2.x;
                 this.$data.ms_src.tools[0].mark.y = ang2.y
                 this.$data.ms_src.tools[0].mark.angle = p1[9];
                 this.$data.ms_src.tools[0].mark.ry = p1[7]/(this.lets.lens.pixscale*Math.sqrt(p1[8]));
                 this.$data.ms_src.tools[0].mark.rx = this.ms_src.tools[0].mark.ry *p1[8];
                 this.$data.ms_src.renderTools();
            },

            handleOptimization(){
                console.log('optimization')
                console.log(this.ref)
                if(this.ms.tools.length === 0){
                    window.alert('Please input Mass Model!');
                    return;
                }
                if(this.ms_src.tools.length === 0){
                    window.alert('Please input Source Model!');
                    return;
                }
                this.timer(8);
            },

        },

        created() {
            console.log('created----------------------');

        },

        mounted() {
            
            console.log("mounted");
            console.log(document.getElementById('hoopla-srcmodel'));
            // this.imgd.crossOrigin="anonymous";
            this.imgd.src = 'https://cdn.rawgit.com/linan7788626/Hoopla/Preprocessing_input_pics/images/lensed_galaxy.jpg';
            this.imgd.width = 400;
            this.imgd.height = 400;

            var lets= new Hoopla({
                id:'hoopla-srcmodel',
                srcmodel: 'hoopla-srcmodel',
                prediction: 'hoopla-prediction',
                pixscale: 0.0225,
            })
            var ms= new MarkingSurface({
                inputName: 'mass-model',
                tool: MarkingSurface.EllipseTool,
            })
            var containerEl = document.getElementById("marking-container")
            containerEl.appendChild(ms.el)
            var ms_src= new MarkingSurface({
                inputName: 'src-model',
                tool: MarkingSurface.EllipseTool
            })
            var containerEl_src= document.getElementById('marking-container-src')
            containerEl_src.appendChild(ms_src.el)
            this.imgd.crossOrigin="anonymous";

            let img = new Image();
            img.src = "http://raw.githubusercontent.com/linan7788626/linan7788626.github.io/master/images/ering.jpg";
            img.onload = function() {
                console.log(img);
                let width = img.width;
                let height = img.height;

                ms.addShape('image', {
                    'xlink:href': img.src,
                    width: width,
                    height: height
                });
                ms.svg.attr({
                    width: 400,
                    height: 400
                });
                ms.rescale(0, 0, width, height);
                let scaleX = 400 / img.width;
                let scaleY = 400 / img.height;

                function getThetaE(d) {
                    let a = d.rx * lets.pixscale;
                    let b = d.ry * lets.pixscale;
                    return Math.sqrt(a * b);
                    //return Math.max(a , b);
                }

                function getAratio(d) {
                    let a = d.rx;
                    let b = d.ry;
                    return a / b;
                }

                function getAngle(d) {
                    return d.angle;
                }

                function getCoords(d) {
                    return lets.lens.pix2ang({x: scaleX * d.x, y: scaleY * d.y});
                }


                function updateModel() {
                    let data = JSON.parse(ms.getValue());
                    let components = data.map(function(d) {
                        let coords = getCoords(d);
                        return {
                            plane: "lens",
                            theta_e: getThetaE(d),
                            ell: getAratio(d),
                            ang: getAngle(d),
                            x: coords.x,
                            y: coords.y
                        }
                    });
                    lets.updateModel(components);
                    console.log("当前椭圆数量："+lets.lens.lens.length);
                }
                let debouncedUpdateModel = _.debounce(updateModel, 200);
                ms.on('marking-surface:change', debouncedUpdateModel);
            };

            let img_src = new Image();
            img_src.src = "http://raw.githubusercontent.com/linan7788626/linan7788626.github.io/master/images/ering.jpg";
            img_src.onload = function() {
                let width = img_src.width;
                let height = img_src.height;

                ms_src.addShape('image', {
                    'xlink:href': img_src.src,
                    width: width,
                    height: height
                });
                ms_src.svg.attr({
                    width: 400,
                    height: 400
                });
                ms_src.rescale(0, 0, width, height);
                let scaleX = 400 / img_src.width;
                let scaleY = 400 / img_src.height;

                function getSize(d) {
                    let a = d.rx * lets.pixscale;
                    let b = d.ry * lets.pixscale;
                    return Math.sqrt(a * b);
                    //return Math.max(a , b);
                }

                function getAratio(d) {
                    let a = d.rx;
                    let b = d.ry;
                    return a / b;
                }

                function getAngle(d) {
                    return d.angle;
                }

                function getCoords(d) {
                    return lets.lens.pix2ang({x: scaleX * d.x, y: scaleY * d.y});
                }

                function updateModel() {
                    let data = JSON.parse(ms_src.getValue());
                    let components = data.map(function(d) {
                        let coords = getCoords(d);
                        return {
                            plane: "source",
                            size: getSize(d),
                            ell: getAratio(d),
                            ang: getAngle(d),
                            x: coords.x,
                            y: coords.y
                        }
                    });
                    lets.updateModel(components);
                }
                let debouncedUpdateModel = _.debounce(updateModel, 200);
                ms_src.on('marking-surface:change', debouncedUpdateModel);
            }


            const sleep = (timeout= 1000)=>new Promise((resolve, reject)=>{
                setTimeout(resolve, timeout);
            });

            let it=0;
            let timer = async(timeout) => {
                for(let i = 0; i< timeout; i++) {
                    let p0;
                    let xc1, xc2, re, ql, phl;
                    if (i === timeout-1 && it === 50){
                        console.log("建模结果有偏差，waiting...");
                        i/=2;
                    }
                    xc1 = lets.models[0].components[1].x;
                    xc2 = lets.models[0].components[1].y;
                    re  = lets.models[0].components[1].theta_e;
                    ql  = lets.models[0].components[1].ell;
                    phl = lets.models[0].components[1].ang;
                    let yc1, yc2, sig2, qs, phs;
                    yc1 = lets.models[0].components[0].x;
                    yc2 = lets.models[0].components[0].y;
                    sig2= lets.models[0].components[0].size;
                    qs  = lets.models[0].components[0].ell;
                    phs = lets.models[0].components[0].ang;

                    p0 = [xc1,xc2,re,ql,phl,yc1,yc2,sig2,qs,phs];
                    let p = optimize.fmin(this.chi2_rescale, p0, {ftol: 1e-6, maxiter: 50});
                    let p1=p.x;
                    if(it===p[1]&&it<50) break;
                    it=p.iterations;
                    // let p1 = optimize.newton(chi2_rescale, p0, {ftol: 1e-6, maxiter: 100});
                    console.log(p1);
                    this.show_res(p1);

                    lets.models[0].components[1].x = p1[0];
                    lets.models[0].components[1].y = p1[1];
                    lets.models[0].components[1].theta_e = p1[2];
                    lets.models[0].components[1].ell = p1[3];
                    lets.models[0].components[1].ang = p1[4];
                    lets.models[0].components[0].x = p1[5];
                    lets.models[0].components[0].y = p1[6];
                    lets.models[0].components[0].size = p1[7];
                    lets.models[0].components[0].ell = p1[8];
                    lets.models[0].components[0].ang = p1[9];
                    lets.loadModel(lets.models[0].components);
                    console.log(lets.models[0].components);
                    lets.update({x:lets.lens.ang2pix(p1[0]),y:lets.lens.ang2pix(p1[1])});
                    lets.freezeSrcModel = true;
                    this.updateCanvas(p1)
                    await sleep(1);

                }
            }
        },


    }
</script>

<style>
    .input{
        width: 730px;
        margin-right: 25px;
    }
    #tag{
        width:60px;
        font-family: Arial;
        background-color: lightblue;
        text-align: center;
        font-size: medium;
        color: black;
        position: absolute;
        left: 320px;
        padding: 5px;
        border-radius: 5px;
        transition: opacity 0.3s ease-in-out;
    }
    .modeltitle {
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
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .disimg {
        display: flex;

        justify-content: center;
        align-items: center;
    }
    body ,html {
        height: 100%;
        width: 100%;
        margin: 0;
        overflow: auto;
        /*position: page;*/
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

    .bar {
        width: 400px;
        height: 400px;
        border: 1px solid #666666;
        background-image: url("http://raw.githubusercontent.com/linan7788626/linan7788626.github.io/master/images/ering.jpg");
        background-size: 400px 400px;
        border-radius: 4px;
        display: flex;
        position: relative;
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


</style>
