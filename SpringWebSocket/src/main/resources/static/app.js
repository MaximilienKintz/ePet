var stompClient = null;
var canvas = null;
var context = null;
var requestPos = {};
var currentPos = {};
var width, height;
var fallbackIP = "172.20.10.10:8000";

var hungry = 50;
var happy = 50;
var fit = 50;

var reallyMove = true;

function eat() {
	hungry = Math.max(0, hungry - 10);
	if (hungry < 50) {
		happy = Math.min(100, happy + 10);
		fit = Math.min(100, fit + 10);
	}
	
	react();
}

function play() {
	happy = Math.min(100, happy + 10);
	fit = Math.max(0, fit - 10);
	hungry = Math.min(100, hungry + 10);
	
	react();
}

function react() {
	var message = saySomething();
	showCommunication(message);

	moveBasedOnFeeling();
}

function moveBasedOnFeeling() {
	var speed = 50;
	if (hungry > 50) {
		speed -= 10;
	}
	if (fit < 50) {
		speed -= 10;
	}
	if (reallyMove) {
		//MainEPet.changeSpeedTo(speed);
		setSpeed(speed);
	}

	var xFrom = 10;
	var yFrom = 10;

	var xTo = xFrom;
	var yTo = yFrom;

	var bonus = (fit > 50) ? 3 : 1;

	bonus = (happy < 50) ? -1*bonus : 1*bonus;

	xTo += bonus * 2;
	yTo += bonus * 5;

	if (reallyMove) {
		//MainEPet.moveFromTo(xFrom, yFrom, xTo, yTo);
		gotox(xFrom, yFrom, xTo, yTo);
	}

}

function saySomething() {
	if (hungry > 80) {
		return "So hungry I cannot think of anything else";
	} else if (hungry > 50 && happy > 50) {
		return "Happy and hungry";
	} else if (fit < 50) {
		return "Too tired!";
	} else if (happy < 50) {
		return "Feedling sad";
	} else {
		return "Everything's fine";
	}
}

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#hellos").html("");
}

function connect() {
    var socket = new SockJS('/stream');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/location', function (data) {
        	var json = JSON.parse(data.body);
        	currentPos.x = json.lat;
        	currentPos.y = json.lng;
        	
            showPosition(json.lat, json.lng);
        });
        
        stompClient.subscribe('/topic/comm', function (data) {
        	//var json = JSON.parse(data.body);
        	
            showCommunication(data.body);
        });
        
        stompClient.subscribe('/topic/info', function (data) {
        	var json = JSON.parse(data.body);
        	
        	showPositionBox(json.x, json.y);
        });
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/jsa/hello", {}, JSON.stringify({'name': $("#name").val()}));
}

function requestLocation(requestLocation) {
    stompClient.send("/jsa/location", {}, JSON.stringify(requestLocation));
}

function showCommunication(greeting) {
    $("#hellos").append("<tr><td>" + greeting + "</td></tr>");
}

function showPosition(lat, lng) {
	 $("#locations").prepend("<tr><td>" + lat + "," + lng + "</td></tr>");
	 if($("#locations").children().length > 10) {
		 $("#locations").children("tr:last").remove();
	 }
	 
	 $("#locationBox").text(lat + ", " + lng);
	
}

function showPositionBox(x, y) {
	$("#locationBox").text(x + ", " + y);
}

function remoteSetSpeed() {
	setSpeed($("#speedBox").value());
}

function clearCanvas() {
	context.fillStyle="#ffffff";
    context.fillRect(0,0,width,height);
    context.fillStyle="#888888";
    context.lineWidth = 1;
    context.strokeRect(0,0,width,height);
}

function drawPosition(x, y, color) {
    context.beginPath();
    context.arc(x, y, 2, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#003300';
    context.stroke();
}


function animate() {
	  // call again next time we can draw
	  requestAnimationFrame(animate);
	  
	  // clear canvas
	  clearCanvas();
	 
	  //draw user
	  if(currentPos.x) {
		  drawPosition(currentPos.x, currentPos.y, 'green', true);
	  }
	  
	  //draw bot
	  if(requestPos.x) {
		  drawPosition(requestPos.x, requestPos.y, 'red', true);
	  }
}


function getCursorPosition(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
}

function onClick(e) {
    var element = canvas;
    var offsetX = 0, offsetY = 0

        if (element.offsetParent) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    requestPos.x = e.pageX - offsetX;
    requestPos.y = e.pageY - offsetY;
    
    requestLocation(requestPos);
}

function moveForward() {
	move("forward");
}


function turnLeft() {
	move("turnleft");
}

function turnRight() {
	move("turnright");
}

function stopMove() {
	move("stop");
}

function moveBackward() {
	move("backward");
}

function setSpeed(speed) {
	move("speed" + speed);
}

function obtainIp() {
	if(globalIP) {
		return globalIP;
	} else {
		return fallbackIP;
	}
}

function move(direction) {
	var url = "http://"+obtainIp()+"/cmd";
	var data = direction;
	$.ajax({
		  type: "POST",
		  url: url,
		  data: data,
		  success: function(data) {
			  console.log(data);
		   },
		  dataType: "json",
		  timeout: 1000 
		});
}

function gotox(x1,y1,x2,y2) {
	var url = "http://"+obtainIp()+"/gotox";
	$.ajax({
		  type: "POST",
		  url: url,
		  data : {
			  x1 : x1,
			  y1 : y1,
			  x2 : x2,
			  y2 : y2
		  },
		  success: function(data) {
			  console.log(data);
		   },
		  dataType: "json",
		  timeout: 1000 
		});
}

function getIPFromRobot() {
	$.ajax({
		  type: "GET",
		  url: "/register",
		  success: function(data) {
			  if(data) {
				  globalIP = data;
			  	console.log("Received IP: " + data);
			  } else {
				  console.log("No IP available, falling back to: " + fallbackIP);
				  globalIP = fallbackIP;
			  }
			  showCurrentIP();
		   },
		   error: function(XMLHttpRequest, textStatus, errorThrown) { 
               console.log("error occured");
               console.log("No IP available, falling back to: " + fallbackIP);
               globalIP = fallbackIP;
               showCurrentIP();
           },
		  dataType: "text",
		  timeout: 1000 
		});
}

function showCurrentIP() {
	$("#ipBox").text("Current IP: " + globalIP);
}

function renew() {
	getIPFromRobot();
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
    
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    
    width = canvas.width;
    height = canvas.height;
    
    canvas.addEventListener('mousemove', getCursorPosition, false);
    canvas.addEventListener("click", onClick, false);
    
    var myVar = setInterval(function(){ renew() }, 5000);
    
    animate();
});
var moving = false;

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        	if(!moving) {
        		moving = true;
        		turnLeft();
        	}
        break;

        case 38: // up
        	if(!moving) {
        		moving = true;
        		moveForward();
        	}
        break;

        case 39: // right
        	if(!moving) {
        		moving = true;
        		turnRight();
        	}
        break;

        case 40: // down
        	if(!moving) {
        		moving = true;
        		moveBackward();
        	}
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

$(document).keyup(function(e) {
    if (e.which === 38 || e.which === 37 || e.which === 39 || e.which === 40) {
    	stopMove();
    	moving = false;
    }
});