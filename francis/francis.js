var cv = document.querySelector('canvas[id="francis-touchpad"]');
if(cv){
	var ct = cv.getContext('2d');
	var TRACKBALL_DOWN = false,
	TRACKBALL_DRAG = false;
	var TRACKBALL = {};
}
var DEFAULTS = {
	'width':640,
	'height':360,
	'tball_rad':30
};
// DEBUG OUTS
// console.log(ct);

var p = document.querySelector('p[id="coords"]');
var inc = document.querySelector('p[id="angle"]');


function calcIncline(X,Y){
	// var angle = -180*((Math.atan2(cv.height/2 - Y,cv.width/2 - X))-Math.PI)/Math.PI;
	var angle = -((Math.atan2(cv.height/2 - Y,cv.width/2 - X))-Math.PI); // Will give angle from 0 to 2*PI
	inc.innerHTML = angle;
	// Fire XHR with angle as msg
}


function init(){
	cv.addEventListener('mousedown', function(event){
		TRACKBALL_DOWN = true;
		TRACKBALL_DRAG = true;
		// console.log(event.offsetX+","+event.offsetY);
		console.log(event);
		ct.clearRect(0,0,cv.width,cv.height);
		ct.beginPath();
		ct.arc(event.offsetX,event.offsetY,TRACKBALL.radius,0,2*Math.PI,true);
		ct.stroke();
		p.innerHTML = event.offsetX+","+event.offsetY;
		calcIncline(event.offsetX,event.offsetY);

	}, false);
	cv.addEventListener('mousemove', function(event){
		if(!TRACKBALL_DRAG)
			return;
		// console.log(event.offsetX+","+event.offsetY);
		ct.clearRect(0,0,cv.width,cv.height);
		ct.beginPath();
		ct.arc(event.offsetX,event.offsetY,TRACKBALL.radius,0,2*Math.PI,true);
		ct.stroke();
		p.innerHTML = event.offsetX+","+event.offsetY;
		calcIncline(event.offsetX,event.offsetY);
	},	false);
	cv.addEventListener('mouseup', function(event){
		TRACKBALL_DOWN = false;
		TRACKBALL_DRAG = false;
		// console.log(event.offsetX+","+event.offsetY);
		ct.clearRect(0,0,cv.width,cv.height);
		ct.beginPath();
		ct.arc(event.offsetX,event.offsetY,TRACKBALL.radius,0,2*Math.PI,true);
		ct.stroke();
		p.innerHTML = event.offsetX+","+event.offsetY;
	}, false);
	cv.addEventListener('touchstart', function(event){
		TRACKBALL_DOWN = true;
		TRACKBALL_DRAG = true;
		// console.log(event.offsetX+","+event.offsetY);
		// console.log(event);
		ct.clearRect(0,0,cv.width,cv.height);
		ct.beginPath();
		var X = event.touches[0].clientX - ct.canvas.offsetLeft;
		var Y = event.touches[0].clientY - ct.canvas.offsetTop;
		if(X > cv.width){
			X=cv.width - TRACKBALL.radius;
			outX = true;
		}
		if(Y > cv.height){
			Y=cv.height - TRACKBALL.radius;
			outY = true;
		}
		if(X < 0){
			X = TRACKBALL.radius;
			outX = true;
		}
		if(Y < 0){
			Y = TRACKBALL.radius;
			outY = true;
		}
		ct.arc(X,Y,TRACKBALL.radius,0,2*Math.PI,true);
		ct.stroke();
		p.innerHTML = parseInt(X)+","+parseInt(Y);

	}, false);
	cv.addEventListener('touchmove', function(event){
		var outX = false, outY = false;
		if(!TRACKBALL_DRAG)
			return;
		ct.clearRect(0,0,cv.width,cv.height);
		ct.beginPath();
		var X = event.touches[0].clientX - ct.canvas.offsetLeft;
		var Y = event.touches[0].clientY - ct.canvas.offsetTop;
		if(X > cv.width){
			X=cv.width - TRACKBALL.radius;
			outX = true;
		}
		if(Y > cv.height){
			Y=cv.height - TRACKBALL.radius;
			outY = true;
		}
		if(X < 0){
			X = TRACKBALL.radius;
			outX = true;
		}
		if(Y < 0){
			Y = TRACKBALL.radius;
			outY = true;
		}
		ct.arc(X,Y,TRACKBALL.radius,0,2*Math.PI,true);
		ct.stroke();
		if(!outX || !outY){
			console.log(parseInt(X)+","+parseInt(Y));
			p.innerHTML = parseInt(X)+","+parseInt(Y);
		}
	},	false);
	cv.addEventListener('touchend', function(event){
		TRACKBALL_DOWN = false;
		TRACKBALL_DRAG = false;
		// console.log(event);
		ct.clearRect(0,0,cv.width,cv.height);
		ct.beginPath();
		var X = event.changedTouches[0].clientX - ct.canvas.offsetLeft;
		var Y = event.changedTouches[0].clientY - ct.canvas.offsetTop;
		if(X > cv.width){
			X=cv.width - TRACKBALL.radius;
			outX = true;
		}
		if(Y > cv.height){
			Y=cv.height - TRACKBALL.radius;
			outY = true;
		}
		if(X < 0){
			X = TRACKBALL.radius;
			outX = true;
		}
		if(Y < 0){
			Y = TRACKBALL.radius;
			outY = true;
		}
		ct.arc(X,Y,TRACKBALL.radius,0,2*Math.PI,true);
		ct.stroke();
		p.innerHTML = parseInt(X)+","+parseInt(Y);
	}, false);
}


function drawTouchPad(){
	if(INIT['override']){
		cv.width = INIT['width'];
		cv.height = INIT['height'];
	}else{
		cv.width = DEFAULTS['width'];
		cv.height = DEFAULTS['height'];
		TRACKBALL.radius = DEFAULTS['tball_rad'];
	}
	ct.beginPath();
	ct.arc(cv.width/2,cv.height/2,TRACKBALL.radius,0,Math.PI*2,true);
	ct.stroke();
}

function spark(){
	if(cv){
		drawTouchPad();
		init();
	}
}

function requestClaire(msg){
	var xhr = new XMLHttpRequest();
	var request = 'msg='+msg+'&this=that';
	xhr.setRequestHeader('Oval-Request', 'True');
	xhr.open('POST','/',true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function(){
		if(xhr.status == 200 && xhr.readyState == 4){
			p.innerHTML = xhr.responseText;
		}
	}
	xhr.send(request);
}

spark();