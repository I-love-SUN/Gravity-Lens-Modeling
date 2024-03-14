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
                        <div id="marking-container" class="bar"></div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div  class="disimg grid-content bg-purple-light">
                        <div id="marking-container-src" class="bar"></div>
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
                            <p id="tag" class="tooltip" style="display: block">
                                <span class="tooltiptext">Interactive Mode is activated, click left button of the mouse to turn into Freezed mode.</span>
                                Interactive
                            </p>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div  class="disimg grid-content bg-purple-light">
                        <div id="hoopla-prediction"   class="bar">
                            <p id="tag2" style="background-color: #8ee58a;display: none;">Running...</p>
                        </div>
                   </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="grid-content bg-purple"><h3 class="modeltitle">Residual Map</h3></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"><h3 class="modeltitle">Chi-Square Curve</h3></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="disimg grid-content bg-purple-light">
                        <canvas id="myCanvas"  width="400px" height="400px" style="background-color: whitesmoke;border:1px solid #d3d3d3;float: left;margin: 5px; "></canvas>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="disimg grid-content bg-purple-light">
                        <canvas id="Curve" width="400px" height="400px" style="background-color: whitesmoke;border:1px solid #d3d3d3;float: left;margin: 5px;"></canvas>
                    </div>
                </el-col>
            </el-row>
        </div>

        <el-row style="margin-top: 30px">
            <el-button type="primary" class="button" @click="handleSave">Save Models</el-button>
            <input
                ref="fileInput"
                type="file"
                style="display: none"
                @change="handleLoadModel"
            />
            <el-button type="primary" class="button" @click="openFileInput">Load Models</el-button>
            <el-button type="primary" class="button" @click="handleUpload">Upload Images</el-button>
            <el-button type="primary" class="button" @click="handleOptimization">Optimization</el-button>
        </el-row>

        <el-row style="margin-top: 20px">
            <el-input class="input" v-model="imputUrl" placeholder="Input the URL of an Image" clearable></el-input>
            <el-button type="primary" class="button" @click="handleUploadUrl">Upload URL</el-button>
        </el-row>

        <el-dialog title="Image Infomation"
                   :visible.sync="dialogVisible"
                   width="500px"
        >
            <el-form ref="form" :model="form" label-width="60px">
                <el-form-item label="Select Image:" label-width="100px">
                    <el-upload
                            :file-list="fileList"
                            :on-change="handleChange"
                    >
                        <el-button type="primary">Select</el-button>
                        <div slot="tip" class="el-upload__tip" >Tips:只能上传jpg/png文件</div>
                    </el-upload>
                </el-form-item>
                文件地址：{{form.imageURL}}
                <el-form-item label="Image width:" label-width="100px">
                    <el-input v-model="form.width" placeholder="Please input the width of image in pixel."></el-input>
                </el-form-item>
                <el-form-item label="Image length:" label-width="100px">
                    <el-input v-model="form.length" placeholder="Please input the length of image in pixel."></el-input>
                </el-form-item>
                <el-form-item label="Pixel scale:" label-width="100px">
                    <el-input v-model="form.pixscale" placeholder="Please input the pixel scale of image in pixel."></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click=handleConfirm>确 定</el-button>

        </el-dialog>

    </div>

</template>

<script>
    // @ is an alias to /src
    import "../tools/ellipse";
    import "../tools/marking-surface";
    import "../model/conrec";
    import "../model/d3";
    import "../model/eelens";
    import "../model/optimize";
    import "@/model/hoopla";
    import {Chart} from 'chart.js'

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

                lets: '',
                ms: '',
                ms_src: '',
                containerEl_src: '',
                containerEl: '',
                timer: '',
                form:{
                    width: '',
                    length: '',
                    pixscale: '',
                    imageURL: ''
                },
                fileList: [],
                dialogVisible: false,

            }
        },


        methods:{

            handleSave(){
                console.log('save')
                this.lets.showModels(this.img_src.src);
            },
            openFileInput(){
                this.$refs.fileInput.click();
            },
            handleLoadModel(e){
                console.log('load');
                let input = e.target;
                let reader = new FileReader();
                reader.onload = ()=>{
                    let text = reader.result;
                    let data = JSON.parse(text);
                    let components = data.components;
                    this.lets.loadModel(components);
                    if(this.ms.tools.length===0){
                        this.ms.addTool();
                    }
                    if(this.ms_src.tools.length===0){
                        this.ms_src.addTool();
                    }
                    console.log(components);

                    // lets.pixscale = pixscale;
                    this.lets.freezeSrcModel = true;
                    this.updateCanvas(components);
                    this.lets.update({x:this.lets.lens.ang2pix(components[1].x),y:this.lets.lens.ang2pix(components[1].y)});
                    console.log(this.lets.freezeSrcModel);
                    let tag = document.getElementById('tag');
                    tag.innerHTML = "<span class=\"tooltiptext\">Freezed Mode is unactivated, click left button of the mouse to turn into interactive mode.</span>Freezed"
                    tag.style.backgroundColor = "lightblue";
                    this.lets.update({x:this.lets.lens.ang2pix(components[1].x),y:this.lets.lens.ang2pix(components[1].y)});
                    this.lets.freezeSrcModel = true;
                };
                reader.readAsText(input.files[0]);
            },
            handleUpload(){
                this.form.imageURL='';
                this.form.pixscale='';
                this.form.length='';
                this.form.width='';
                this.dialogVisible=true;
            },
            handleConfirm(){
                if((this.form.pixscale===''||null)||(this.form.imageURL===''||null)){
                    this.$alert('Please input entire information.','Incomplete input',{confirmButtonText:'Confirm'});
                    return;
                }
                this.imgd.src = this.form.imageURL;
                this.img.src = this.form.imageURL;
                this.img_src.src = this.form.imageURL;
                this.ms.tools.pop();
                this.ms_src.tools.pop();
                this.lets.length = this.form.length;
                this.lets.width = this.form.width;
                this.lets.pixscale = this.form.pixscale;
                this.lets.srcmodelPaper.clear();
                this.lets.srcmodelPaper.src = this.form.imageURL;
                this.lets.predictionPaper.clear();
                this.lets.predictionPaper.src = this.form.imageURL;
                document.getElementById("hoopla-srcmodel").style.backgroundImage
                    = "url(" + this.form.imageURL + ")";
                document.getElementById("hoopla-prediction").style.backgroundImage
                    = "url(" + this.form.imageURL + ")";
                console.log(this.lets);
                this.dialogVisible=false;
            },
            handleChange(file,fileList){
                console.log(file);
                this.fileList=fileList;
                this.form.imageURL = window.URL.createObjectURL(file.raw);
                console.log(this.form.imageURL);
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
                        let i = row*this.imgd.height+col;
                        let i2 = row/fscale*this.imgd.height/fscale+col/fscale;
                        let x = col*0.0225 - 4.5;
                        let y = row*0.0225 - 4.5;
                        testimg[i] = this.model_lensed_images(p, x, y);
                        chi[i2] = (red[i] - testimg[i])/redstd/redstd/(chi.length);
                    }
                }
                let res = optimize.vector.dot(chi, chi);
                // console.log(res);

                return res;
            },


            show_res(p) {
                const c = document.getElementById("myCanvas");
                const ctx = c.getContext("2d");
                ctx.drawImage(this.imgd, 0, 0);
                let dstdata = ctx.getImageData(0, 0, this.imgd.width, this.imgd.height);
                let data = dstdata.data;

                let red = new Array(data.length/4);
                let i = 0;
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
                        let x = col*0.0225 - 4.5;
                        let y = row*0.0225 - 4.5;
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

                for (let i = 0; i < data.length; i++) {
                    dstdata.data[i] = data[i];
                }
                ctx.putImageData(dstdata, 0, 0);
                return res;
            },


             updateCanvas(components) {
                 let ang = this.lets.lens.ang2pix({x: components[1].x, y: components[1].y});
                 this.ms.tools[0].mark.x = ang.x;
                 this.ms.tools[0].mark.y = ang.y;
                 this.ms.tools[0].mark.angle = components[1].ang ;
                 this.ms.tools[0].mark.ry = components[1].theta_e/(this.lets.lens.pixscale*Math.sqrt(components[1].ell));
                 this.ms.tools[0].mark.rx = this.ms.tools[0].mark.ry * components[1].ell;
                 this.ms.renderTools();

                 let ang2 = this.lets.lens.ang2pix({x: components[0].x, y: components[0].y});
                 this.ms_src.tools[0].mark.x = ang2.x;
                 this.ms_src.tools[0].mark.y = ang2.y
                 this.ms_src.tools[0].mark.angle = components[0].ang;
                 this.ms_src.tools[0].mark.ry = components[0].size/(this.lets.lens.pixscale*Math.sqrt(components[0].ell ));
                 this.ms_src.tools[0].mark.rx = this.ms_src.tools[0].mark.ry *components[0].ell ;
                 this.ms_src.renderTools();
            },

            handleOptimization(){
                console.log('optimization')
                if(this.ms.tools.length === 0){
                    this.$alert('Please input Mass Model!','Incorrect operation',{confirmButtonText:'Confirm'});
                    return;
                }
                if(this.ms_src.tools.length === 0){
                    this.$alert('Please input Source Model!','Incorrect operation',{confirmButtonText:'Confirm'});
                    return;
                }
                let tag2 = document.getElementById('tag2');
                tag2.style.display = 'block';
                console.log(tag2);

                let timerCallback = async () => {
                    await this.timer(8); // 执行1次timer函数
                    console.log(this.lets);
                    tag2.style.display = 'none';
                }

                timerCallback(); // 将迭代次数作为参数传递给timerCallback函数
            },

        },

        created() {
            console.log('created----------------------');

        },

        mounted() {

            console.log("mounted");
            var that = this;
            this.imgd.crossOrigin="anonymous";
            this.imgd.src = 'https://cdn.rawgit.com/linan7788626/Hoopla/Preprocessing_input_pics/images/lensed_galaxy.jpg';
            this.imgd.width = 400;
            this.imgd.height = 400;
            this.lets= new Hoopla({
                id:'hoopla-srcmodel',
                srcmodel: 'hoopla-srcmodel',
                prediction: 'hoopla-prediction',
                pixscale: 0.0225,
            })
            this.ms= new MarkingSurface({
                inputName: 'mass-model',
                tool: MarkingSurface.EllipseTool,
            })
            this.containerEl = document.getElementById("marking-container")
            this.containerEl.appendChild(this.ms.el)
            this.ms_src= new MarkingSurface({
                inputName: 'src-model',
                tool: MarkingSurface.EllipseTool,
            })
            this.containerEl_src= document.getElementById('marking-container-src')
            this.containerEl_src.appendChild(this.ms_src.el)

            this.img = new Image();
            this.img.src = "http://raw.githubusercontent.com/linan7788626/linan7788626.github.io/master/images/ering.jpg";
            this.img.onload = ()=> {
                let width = this.img.width;
                let height = this.img.height;

                this.ms.addShape('image', {
                    'xlink:href': that.img.src,
                    width: width,
                    height: height,
                });
                this.ms.svg.attr({
                    width: 400,
                    height: 400,
                    color: 'white'
                });
                this.ms.rescale(0, 0, width, height);
                let scaleX = 400 / this.img.width;
                let scaleY = 400 / this.img.height;

                function getThetaE(d) {
                    let a = d.rx * that.lets.pixscale;
                    let b = d.ry * that.lets.pixscale;
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
                    return that.lets.lens.pix2ang({x: scaleX * d.x, y: scaleY * d.y});
                }


                function updateModel() {
                    let data = JSON.parse(this.getValue());
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
                    that.lets.updateModel(components);
                    // console.log("当前椭圆数量："+that.lets.lens.lens.length);
                }
                let debouncedUpdateModel = _.debounce(updateModel, 200);
                that.ms.on('marking-surface:change', debouncedUpdateModel);
            }

            this.img_src = new Image();
            this.img_src.src = "http://raw.githubusercontent.com/linan7788626/linan7788626.github.io/master/images/ering.jpg";
            this.img_src.onload = ()=>{
                let width = this.img_src.width;
                let height = this.img_src.height;

                this.ms_src.addShape('image', {
                    'xlink:href': that.img_src.src,
                    width: width,
                    height: height
                });
                this.ms_src.svg.attr({
                    width: 400,
                    height: 400,
                    color: 'grey'
                });
                this.ms_src.rescale(0, 0, width, height);
                let scaleX = 400 / this.img_src.width;
                let scaleY = 400 / this.img_src.height;

                function getSize(d) {
                    let a = d.rx * that.lets.pixscale;
                    let b = d.ry * that.lets.pixscale;
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
                    return that.lets.lens.pix2ang({x: scaleX * d.x, y: scaleY * d.y});
                }

                function updateModel() {
                    let data = JSON.parse(this.getValue());
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
                    that.lets.updateModel(components);
                }
                let debouncedUpdateModel = _.debounce(updateModel, 200);
                that.ms_src.on('marking-surface:change', debouncedUpdateModel);
            }

            let chartInstance = null // 声明一个全局变量来存储 Chart 实例
            function drawChiSquareCurve(chiSquaredValues) {
                let ctx = document.getElementById("Curve");
                if (chartInstance) {
                    // 如果之前有 Chart 实例存在，则更新其数据和选项
                    chartInstance.data.labels = Array.from({ length: chiSquaredValues.length }, (_, i) => 50*(i + 1));
                    chartInstance.data.datasets[0].data = chiSquaredValues;
                    chartInstance.update();
                } else {
                    // 如果之前没有 Chart 实例存在，则创建一个新的实例
                    chartInstance = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: Array.from({length: chiSquaredValues.length}, (_, i) => i + 1),
                            datasets: [
                                {
                                    label: '卡方值',
                                    data: chiSquaredValues,
                                    borderColor: 'blue',
                                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            scales: {
                                x: {
                                    type: 'category',
                                    scaleLabel: {
                                        display: true,
                                        labelString: '迭代次数',
                                    },
                                },
                                y: {
                                    scaleLabel: {
                                        display: true,
                                        labelString: '卡方值',
                                    },
                                },
                            },
                        },
                    });
                }
            }

            const sleep = (timeout= 1000)=>new Promise((resolve, reject)=>{
                setTimeout(resolve, timeout);
            });

            let it=0;
            this.timer = async(timeout) => {
                let chiSquaredValues = [];
                for(let i = 0; i< timeout; i++) {
                    let p0;
                    let xc1, xc2, re, ql, phl;
                    if (i === timeout-1 && it === 50){
                        console.log("建模结果有偏差，waiting...");
                        i/=2;
                    }
                    xc1 = this.lets.models[0].components[1].x;
                    xc2 = this.lets.models[0].components[1].y;
                    re  = this.lets.models[0].components[1].theta_e;
                    ql  = this.lets.models[0].components[1].ell;
                    phl = this.lets.models[0].components[1].ang;
                    let yc1, yc2, sig2, qs, phs;
                    yc1 = this.lets.models[0].components[0].x;
                    yc2 = this.lets.models[0].components[0].y;
                    sig2= this.lets.models[0].components[0].size;
                    qs  = this.lets.models[0].components[0].ell;
                    phs = this.lets.models[0].components[0].ang;

                    p0 = [xc1,xc2,re,ql,phl,yc1,yc2,sig2,qs,phs];
                    let p = optimize.fmin(this.chi2_rescale, p0, {ftol: 1e-6, maxiter: 50});
                    let p1=p.x,chival = p.res;
                    if(it===p[1]&&it<50) break;
                    it=chival.iterations;
                    chiSquaredValues.push(chival.fval);
                    // let p1 = optimize.newton(chi2_rescale, p0, {ftol: 1e-6, maxiter: 100});
                    console.log(p1);
                    this.show_res(p1);
                    drawChiSquareCurve(chiSquaredValues);

                    this.lets.models[0].components[1].x = p1[0];
                    this.lets.models[0].components[1].y = p1[1];
                    this.lets.models[0].components[1].theta_e = p1[2];
                    this.lets.models[0].components[1].ell = p1[3];
                    this.lets.models[0].components[1].ang = p1[4];
                    this.lets.models[0].components[0].x = p1[5];
                    this.lets.models[0].components[0].y = p1[6];
                    this.lets.models[0].components[0].size = p1[7];
                    this.lets.models[0].components[0].ell = p1[8];
                    this.lets.models[0].components[0].ang = p1[9];
                    this.lets.loadModel(this.lets.models[0].components);
                    console.log(this.lets.models[0].components);
                    this.lets.update({x:this.lets.lens.ang2pix(p1[0]),y:this.lets.lens.ang2pix(p1[1])});
                    this.lets.freezeSrcModel = true;
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
    #tag,#tag2{
        width:80px;
        font-family: Arial;
        background-color: orange;
        text-align: center;
        font-size: medium;
        color: black;
        position: absolute;
        left: 300px;
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
        /*background-color: #090b03;*/
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
        border: 1px solid ;
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
    .tooltip {
        position: relative;
        display: inline-block;
    }

    .tooltip .tooltiptext {
        visibility: hidden;
        width: 220px;
        background-color: black;
        color: white;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        /* Position the tooltip */
        position: absolute;
        bottom: 125%;
        margin-left: -70px;
    }

    .tooltip:hover .tooltiptext {
        visibility: visible;
    }

</style>
