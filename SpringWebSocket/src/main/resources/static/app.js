var stompClient = null;
var canvas = null;
var context = null;
var requestPos = {};
var currentPos = {};
var width, height;
var fallbackIP = "172.20.10.10:8000";


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
        	var json = JSON.parse(data.body);
        	
            showCommunication(json.text);
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
	 
	 $("#locationBox").text(lat + ", " + lng)
	
}
function showPositionBox(x, y) {
	$("#locationBox").text(x + ", " + y)
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