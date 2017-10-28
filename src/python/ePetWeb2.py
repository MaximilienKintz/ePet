import time
import json

from geventwebsocket import WebSocketHandler, WebSocketError
from bottle import get,post,route, run, request, abort, Bottle ,static_file, template
from pymongo import Connection
from gevent import monkey; monkey.patch_all()
from time import sleep

from AlphaBot2 import AlphaBot2

print('ePet Web Server Test Start ...')
Ab = AlphaBot2()
app = Bottle()

Ab.stop()

@app.route('/websocket')
def handle_websocket():
    wsock = request.environ.get('wsgi.websocket')
    if not wsock:
        abort(400, 'Expected WebSocket request.')
    while True:
        try:
            message = wsock.receive()
            wsock.send("Your message was: %r" % message)
            sleep(3)
            wsock.send("Your message was: %r" % message)
        except WebSocketError:
            break

@post("/cmd")
def cmd():
	global HStep,VStep
	code = request.body.read().decode()
	speed = request.POST.get('speed')
	print(code)
	if(speed != None):
		Ab.setPWMA(float(speed))
		Ab.setPWMB(float(speed))
		print(speed)
	if code == "stop":
		HStep = 0
		VStep = 0
		Ab.stop()
	elif code == "forward":
		Ab.forward()
	elif code == "backward":
		Ab.backward()
	elif code == "turnleft":
		Ab.left()
	elif code == "turnright":
		Ab.right()
	elif code == "up":
		VStep = -5
	elif code == "down":
		VStep = 5
	elif code == "left":
		HStep = 5
	elif code == "right":
		HStep = -5
	return "OK"


host = "127.0.0.1"
port = 8080

server = WSGIServer((host, port), app,
                    handler_class=WebSocketHandler)
print "access @ http://%s:%s/websocket.html" % (host,port)
server.serve_forever()