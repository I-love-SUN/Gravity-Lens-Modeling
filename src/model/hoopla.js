/*
 * Javascript Lens Modeling
 *
 * 2013 Phil Marshall & Stuart Lowe
 * 2016 Nan Li
 *
 * Licensed under MIT
 *
 * Requires lens.js, from https://raw.github.com/slowe/lensjs/master/lens.js
 *
 * History:
 *   2013-02-08 Mashed together inexpertly from Hoopla and lensjs/index.html
 *   2016-07+ Extended to include elliptical models, file IO
 */

// Enclose the Javascript
import  "@/model/canvas";
import  "@/model/eelens";
import  "@/model/conrec";
import {Canvas} from "@/model/canvas";
import {Lens} from "@/model/eelens";
import {Conrec} from "@/model/conrec";

(function(exports) {
	exports.Hoopla = Hoopla;

	// First we will create the basic function
	function Hoopla(obj) {

		this.srcmodel = (obj && typeof obj.srcmodel === "string") ? obj.srcmodel : "hoopla-srcmodel";
		this.prediction = (obj && typeof obj.prediction === "string") ? obj.prediction : "hoopla-prediction";

		// Set some variables based on the inputs:
		this.id = (obj && typeof obj.id == "string") ? obj.id : "hoopla-model";
		this.pixscale = (obj && typeof obj.pixscale == "number") ? obj.pixscale : 0.03;

		console.log("hoopla-----------------------");

		// Set up the canvas for drawing the model image etc:
		this.paper = new Canvas({ 'id': this.id });

		this.srcmodelPaper = new Canvas({'id': this.srcmodel});
		this.freezeSrcModel = false;
		let _this = this;
		// this.srcmodelPaper.canvas.onclick = function() {
		// 	_this.freezeSrcModel = !_this.freezeSrcModel;
		// };

		this.predictionPaper = new Canvas({'id': this.prediction});

    	// Get the canvas width and height:
		// this.width = obj.width;
		// this.height = obj.height;
		this.width = this.predictionPaper.width;
		this.height = this.predictionPaper.height;

    	// Let's define some events
    	this.events = {load:"",loadimage:"",click:"",mousemove:"",mouseout:"",mouseover:"",init:""};
    	this.img = { complete: false };
    	this.showcrit = true;

    	// console.log(this)
		// Create an instance of a lens:
		this.lens = new Lens({ 'width': this.width, 'height': this.height, 'pixscale': this.pixscale});

		// Setup our buttons etc
		this.setup();
		this.models = [];
		this.models.push({
			name: 'Example',
			src:" http://lenszoo.files.wordpress.com/2013/12/asw0009cjs-zoomed.jpg",
			PSFwidth: 1.2,
			source: {
				plane: "source",
				size:  0.7,
				x: 100.0,
				y:  100.0,
				ell: 0.7,
				ang: 32
			},
			components: [
				{
					plane: "source",
					size:  0.7,
					x: 100.0,
					y: 100.0,
					ell: 0.7,
					ang: 32
				}
			]
		});
		this.init();
	}

	Hoopla.prototype.loadModel = function(components) {
		console.log('loadModel');
		this.models[0].components = components;
		// console.log(this.model);
    	this.init("Example",null);
	}

	Hoopla.prototype.updateModel = function(components) {
		let source;
		console.log('updateModel');
		if (components.length === 0) {
			if (this.models[0].components.length === 0) {
				source = this.models[0].source;
				components.splice(0, 0, source);
				this.models[0].components = components;

			} else {
				//var source = this.models[0].components[0];
				//components.splice(0, 0, source);
				//this.models[0].components = components;
			}

		} else {
			if (components[0].plane === "source") {
				if (this.models[0].components[0].plane === "source") {
					this.models[0].components[0] = components[0];
				} else {
					this.models[0].components.splice(0, 0, components[0]);
				}
			} else {
				if (this.models[0].components[0].plane === "source") {
					source = this.models[0].components[0];
					components.splice(0, 0, source);
					this.models[0].components = components;
				} else {
					source = this.models[0].source;
					components.splice(0, 0, source);
					this.models[0].components = components;
				}
			}
		}
    	this.init();
	}

	//计算数据的轮廓
	Hoopla.prototype.getContours = function(data,z){
		let c = new Conrec();

		// Check inputs
		if(typeof data!=="object") return c;
		if(typeof z!=="object") return c;
		if(data.length < 1) return c;
		if(data[0].length < 1) return c;

		let ilb = 0;
		let iub = data.length - 1;
		let jlb = 0;
		let jub = data[0].length - 1;
		let idx = new Array(data.length);
		let jdx = new Array(data[0].length);
		for(let i = 0 ; i < idx.length ; i++) idx[i] = i+1;
		for(let j = 0 ; j < jdx.length ; j++) jdx[j] = j+1;

		// contour(d, ilb, iub, jlb, jub, x, y, nc, z)
		// d               ! matrix of data to contour
		// ilb,iub,jlb,jub ! index bounds of data matrix
		// x               ! data matrix column coordinates
		// y               ! data matrix row coordinates
		// nc              ! number of contour levels
		// z               ! contour levels in increasing order
		c.contour(data, ilb, iub, jlb, jub, idx, jdx, z.length, z);
		return c;
	}

	// 画出透镜轮廓
	Hoopla.prototype.drawContours = function(canvas, c, opt){
		if(c.length < 1) return;

		let color = (opt && typeof opt.color==="string") ? opt.color : '#FFFFFF';
		let lw = (opt && typeof opt.lw==="number") ? opt.lw : 1;
		let i, j, l;
		canvas.ctx.strokeStyle = color;
		canvas.ctx.lineWidth = lw;
		for(l = 0; l < c.length ; l++){
			canvas.ctx.beginPath();
			for(i = 0; i < c[l].length ; i++) {
				canvas.ctx.arc(c[l][i].x,c[l][i].y,0.5,0.0,Math.PI*2.0,true);
			}
			canvas.ctx.closePath();
			canvas.ctx.stroke();
		}
		return this;
	}

	Hoopla.prototype.drawAll = function(lens,canvas){
		this.drawComponent("lens");
		this.drawComponent("mag");
		this.drawComponent("image");
		return this;
	}

	// Draw a specific component of the Lens object
	Hoopla.prototype.drawComponent = function(mode){

		let lens = this.lens;
		let canvas = this.paper;

		if(!mode || typeof mode!=="string") return;

		// Have we previously made this component layer?
		let previous = !!(canvas.clipboard[mode]);

		// Load in the previous version if we have it (this will save us setting the RGB)
		let imgData = (previous) ? canvas.clipboard[mode] : canvas.ctx.createImageData(lens.w, lens.h);
		let pos = 0;
		let c = [0, 0, 0];

		// The RGB colours
		if(mode === "lens") c = [60, 60, 60];
		else if(mode === "mag") c = [0, 120, 0];
		// else if(mode == "image") c = [195, 215, 255];
		// Better color for CFHTLS examples:
        else if(mode === "image") c = [115, 185, 255];

		// We just want to draw sources
		if(mode === "source"){
			canvas.ctx.fillStyle = "#FF9999";
			canvas.ctx.strokeStyle = "#FFFFFF";
			for(let i = 0 ; i < lens.source.length ; i++){
				// Add a circle+label to show where the source is
				let r = 5;
				canvas.ctx.beginPath();
				canvas.ctx.arc(lens.source[i].x-parseInt(r/2), lens.source[i].y-parseInt(r/2), r, 0 , 2 * Math.PI, false);
				canvas.ctx.strokeText("Source "+(i+1),lens.source[i].x+r, lens.source[i].y+r);
				canvas.ctx.fill();
				canvas.ctx.closePath();
			}
			return;
		}

		// Loop over the components
		for(let i = 0; i < lens.w*lens.h ; i++){

			// If we've not drawn this layer before we should set the RGB
			if(!previous){
				// Add to red channel
				imgData.data[pos+0] = c[0];

				// Add to green channel
				imgData.data[pos+1] = c[1];

				// Add to blue channel
				imgData.data[pos+2] = c[2];
			}

			// Alpha channel
			if(mode === "lens"){
				// MAGIC number 0.7 -> Math.round(255*0.7) = 179
				imgData.data[pos+3] = 179*Math.sqrt(lens.mag[i].kappa);
			}else if(mode === "mag"){
				// MAGIC number 0.01 -> Math.round(255*0.01) = 3
				imgData.data[pos+3] = 3/Math.abs(lens.mag[i].inverse);
			}else if(mode === "image"){
				// MAGIC number 0.1, trades off with blur steps... -> Math.round(255*0.2) ~ 50
				imgData.data[pos+3] = 50*lens.predictedimage[i];
				// Without blurring:
                // imgData.data[pos+3] = 165*lens.predictedimage[i];
			}else{
				imgData.data[pos+3] = 255;
			}
			pos += 4;
		}

		// Keep a copy of the image in a clipboard named <mode>
		canvas.copyToClipboard(mode,imgData);

		if(mode === "image"){
			// Blur the image? Try without!
			imgData = canvas.blur(imgData, lens.w, lens.h);
		}

		// Draw the image to the <canvas> in the DOM
		canvas.overlay(imgData);

		return this;
	}

	Hoopla.prototype.setStatus = function(msg){
		if(document.getElementById('status')) document.getElementById('status').innerHTML = msg;
	}

	// We need to set up.
	Hoopla.prototype.setup = function(){

		this.buttons = { crit: document.getElementById('criticalcurve') };
		let _obj = this;
		if(this.buttons.crit){
			addEvent(this.buttons.crit,"click",function(e){
				_obj.showcrit = !_obj.showcrit;
				_obj.update();
			});
		}
		addEvent(this.paper.canvas, "mousemove", function(e){
			_obj.trigger("mousemove",{x: e.layerX, y: e.layerY})
		});
		addEvent(this.paper.canvas,"mouseout",function(e){
			_obj.trigger("mouseout")
		});
		addEvent(this.paper.canvas,"mouseover",function(e){
			_obj.trigger("mouseover")
		});
		addEvent(this.paper.canvas,"click",(e)=>{
			_obj.freezeSrcModel = !_obj.freezeSrcModel;
			let tag = document.getElementById('tag');
			if(_obj.freezeSrcModel){
				tag.innerHTML = "<span class=\"tooltiptext\">Freezed Mode is unactivated, click left button of the mouse to turn into interactive mode.</span>Freezed"
				tag.style.backgroundColor = "lightblue";
			}else{
				tag.innerHTML = "<span class=\"tooltiptext\">Interactive Mode is activated, click left button of the mouse to turn into freezed mode.</span>Interactive";
				tag.style.backgroundColor = "orange";
			}
		});
		return this;
	}

	// Return a model by name
	Hoopla.prototype.getModel = function(name){
		if(typeof name === "string"){
			for(let i = 0; i < this.models.length; i++){
				if(this.models[i].name===name) return this.models[i];
			}
		}
		// No match so return the first model
		return this.models[0];
	}

	// 初始化透镜模型
	Hoopla.prototype.init = function(inp,fnCallback){
		console.log("init");

		this.model = this.getModel(inp);
		let _this = this;
		_this.freezeSrcModel=false;
		if(typeof this.model.src === "string") this.loadImage(this.model.src);
		if(typeof this.model.components === "object"){
			this.lens.removeAll('lens');
			this.lens.removeAll('source');


			for(let i = 0; i < this.model.components.length ; i++){
				this.lens.add(this.model.components[i]);
			}
			// console.log(this.lens);

			this.lens.calculateAlpha();
			this.lens.calculateImage();

			this.critcurve = [];
			this.caustics = [];
			//这段代码是画出Source Plane和Image Plane上面的计算后的椭圆模型轮廓
			if(typeof Conrec==="function"){
				let i, row, col;
				// Critical curve:
				let invmag = new Array(this.lens.h);
				for(row = 0 ; row < this.lens.h ; row++){
					invmag[row] = new Array(this.lens.w);
					for(col = 0 ; col < this.lens.w ; col++){
						i = row + col*this.lens.h;
						invmag[row][col] = this.lens.mag[i].inverse;
					}
				}
				let contours = this.getContours(invmag,[0.0]);
				this.critcurve = contours.contourList();

				// Caustics:
				this.caustics = new Array(this.critcurve.length);
				// Loop over separate loops of the critcurve contour, of which there are c.length:
				let c = this.critcurve;
				for(let l = 0; l < c.length ; l++){
					this.caustics[l] = new Array(this.critcurve[l].length);
					// Loop over all the points in this contour, mapping them back to the source plane:
					for(let k = 0; k < c[l].length ; k++) {
						i = this.lens.altxy2i(Math.round(c[l][k].x),Math.round(c[l][k].y));
						this.caustics[l][k] = {x: (Math.round(c[l][k].x - this.lens.alpha[i].x)), y: (Math.round(c[l][k].y - this.lens.alpha[i].y))};
					}
				}
			}
		}

		// console.log("===================================================================")
		// console.log(this.paper);
		// console.log(this.srcmodelPaper);
		// console.log(this.predictionPaper)

		// this.paper.clear();
		this.srcmodelPaper.clear();
		this.predictionPaper.clear();

		// Take a copy of the blank <canvas>
		this.paper.copyToClipboard();

		// Reset mousemove events
		this.events['mousemove'] = "";

		// Bind the callback events
		let e = ["mousemove","mouseover","mouseout"];
		let ev = "";

		for(let i = 0; i < e.length; i++){
			this.paper.events[e[i]] = "";
			if (e[i] === "mousemove") {
				// 这里绑定的是canvas画布的事件
				this.srcmodelPaper.bind(e[i], { ev:ev, hoopla:this }, function(e) {
					_this.e = {x:e.x, y:e.y};
					if (!_this.freezeSrcModel) {

						e.data.hoopla.update(e);
					}
				});
			}
		}
		if(typeof fnCallback=="function") fnCallback(this);
		this.trigger("init");
		return this;
	}

	// 显示模型信息并提供下载选项
	Hoopla.prototype.showModels = function(imgSrc){
		//var str = JSON.stringify(this.models[0].components,
								 //function(key, val) {
									 //return val.toFixed ? Number(val.toFixed(3)):val;
								 //}, 4);
		this.models[0].name = imgSrc.split('/')[imgSrc.split('/').length-1].split('.')[0];
		this.models[0].src = imgSrc;

		delete this.models[0].source;
		delete this.models[0].PSFwidth;

		let str = JSON.stringify(this.models[0],
								 function(key, val) {
									 return val.toFixed ? Number(val.toFixed(3)):val;
								 }, 4);

		let link = document.createElement('a');
		//link.download = 'lensModels.json';

		link.download = this.models[0].name+'.JSON';
		let blob = new Blob([str], {type: 'text/plain'});
		link.href = window.URL.createObjectURL(blob);
		link.click();
	}

	// 更新透镜模型并重新计算图像
	Hoopla.prototype.update = function(e){
		if (!e) { return; }
		// console.log('update image');
		// Get the size of the existing source
		let src = this.lens.source[0];
		// Remove existing sources
		this.lens.removeAll('source');
		// Set the lens source to the current cursor position, transforming pixel coords to angular coords:
		let coords = this.lens.pix2ang({x:e.x, y:e.y});
		// Update the source x,y positions
		src.x = coords.x;
		src.y = coords.y;
		this.model.components[0].x = coords.x;
		this.model.components[0].y = coords.y;
		//console.log(this.model.components[0]);
		// Add the source back
		this.lens.add(src);
		// Paste original image
		this.paper.pasteFromClipboard();
		this.predictionPaper.clear();

		if (this.showcrit) {
			this.srcmodelPaper.clear();
			let critcurve = this.downsample(this.critcurve);
			let caustics = this.downsample(this.caustics);

			this.drawContours(this.predictionPaper, critcurve, {color:'#ff6666', lw:1.1});
			this.drawContours(this.srcmodelPaper, caustics, {color:'#66ff66', lw:1.1});
    	}
		// Re-calculate the lensed and true images
		this.lens.calculateImage();
		this.lens.calculateTrueImage();
		// Calculate and overlay source outline:
		if(typeof Conrec === "function"){
			let i, row, col;
			let timage = new Array(this.lens.h);
			for(let row = 0 ; row < this.lens.h ; row++){
				timage[row] = new Array(this.lens.w);
				for(col = 0 ; col < this.lens.w ; col++){
					i = row + col*this.lens.h;
					timage[row][col] = this.lens.trueimage[i];
				}
			}

			let lasso = this.getContours(timage, [0.5]);
      		let outline = lasso.contourList();
      		outline = this.downsample(outline);
			this.drawContours(this.srcmodelPaper, outline, {color:'#66ccff', lw:1.1});
		}
		// Calculate and overlay arcs outline:
		if(typeof Conrec === "function"){
			let i, row, col;
			let pimage = new Array(this.lens.h);
			for(row = 0 ; row < this.lens.h ; row++){
				pimage[row] = new Array(this.lens.w);
				for(col = 0 ; col < this.lens.w ; col++){
					i = row + col*this.lens.h;
					pimage[row][col] = this.lens.predictedimage[i];
				}
			}
			let lasso = this.getContours(pimage, [0.5]);
      		let outline = lasso.contourList();
      		outline = this.downsample(outline);
			this.drawContours(this.predictionPaper, outline, {color:'#66ccff', lw:1.1});
		}
	}
	// Downsample contours from a list of contours
	Hoopla.prototype.downsample = function(contourList) {
		let factor = 4;
		let downsampledList = [];

    	for (let i = 0; i < contourList.length; i += 1) {
			let contour = contourList[i];
			let downsampled = [];

			for (let j = 0; j < contour.length; j += factor) {
				downsampled.push(contour[j]);
			}
			downsampledList.push(downsampled);
    	}
		return downsampledList;
	}

	// Loads the image file. You can provide a callback or have
	Hoopla.prototype.loadImage = function(source, fnCallback){
		let src = "";
		if(typeof source==="string") src = source;
		if(typeof src=="string" && src){
			this.image = null
			let _obj = this;
			this.img = new Image();
			this.img.onload = function(){
				_obj.update();
				// Call any callback functions
				if(typeof fnCallback=="function") fnCallback(_obj);
				_obj.trigger("loadimage");
			}
			this.img.src = src;
		}
		return this;
	}

	// Attach a handler to an event for the Canvas object in a style similar to that used by jQuery
	Hoopla.prototype.bind = function(ev,e,fn){
		if(typeof ev!="string") return this;
		if(typeof fn==="undefined"){
			fn = e;
			e = {};
		}else{
			e = {data:e}
		}
		if(typeof e!="object" || typeof fn!="function") return this;
		if(this.events[ev]) this.events[ev].push({e:e,fn:fn});
		else this.events[ev] = [{e:e,fn:fn}];
		return this;
	}
	// Trigger a defined event with arguments. This is for internal-use to be
	// sure to include the correct arguments for a particular event
	Hoopla.prototype.trigger = function(ev,args){
		if(typeof ev != "string") return;
		if(typeof args != "object") args = {};
		let o = [];
		if(typeof this.events[ev]=="object"){
			for(let i = 0 ; i < this.events[ev].length ; i++){
				let e = G.extend(this.events[ev][i].e,args);
				if(typeof this.events[ev][i].fn == "function") o.push(this.events[ev][i].fn.call(this,e))
			}
		}
		if(o.length > 0) return o;
	}

	// Helpful functions

	// Cross-browser way to add an event
	// if(typeof addEvent!="function"){
		function addEvent(oElement, strEvent, fncHandler){
			if(!oElement) { console.log(oElement); return; }
			if(oElement.addEventListener) oElement.addEventListener(strEvent, fncHandler, false);
			else if(oElement.attachEvent) oElement.attachEvent("on" + strEvent, fncHandler);
		}
	// }

	// Extra mathematical/helper functions that will be useful - inspired by http://alexyoung.github.com/ico/
	var G = {};
	G.sum = function(a) { var i, sum; for (i = 0, sum = 0; i < a.length; sum += a[i++]) {}; return sum; };
	if (typeof Array.prototype.max === 'undefined') G.max = function(a) { return Math.max.apply({}, a); };
	else G.max = function(a) { return a.max(); };
	if (typeof Array.prototype.min === 'undefined') G.min = function(a) { return Math.min.apply({}, a); };
	else G.min = function(a) { return a.min(); };
	G.mean = function(a) { return G.sum(a) / a.length; };
	G.stddev = function(a) { return Math.sqrt(G.variance(a)); };
	G.log10 = function(v) { return Math.log(v)/2.302585092994046; };
	G.variance = function(a) { var mean = G.mean(a), variance = 0; for (var i = 0; i < a.length; i++) variance += Math.pow(a[i] - mean, 2); return variance / (a.length - 1); };
	if (typeof Object.extend === 'undefined') {
		G.extend = function(destination, source) {
			for (var property in source) {
				if (source.hasOwnProperty(property)) destination[property] = source[property];
			}
			return destination;
		};
	} else G.extend = Object.extend;

})(typeof exports !== "undefined" ? exports : window);

