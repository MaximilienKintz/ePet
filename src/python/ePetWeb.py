import time
from bottle import get,post,run,request,template

from AlphaBot2 import AlphaBot2

print('ePet Web Server Test Start ...')
Ab = AlphaBot2()

Ab.stop()

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

@post("/gotox")
def gotox():
	# x1 y1: here we are
	x1 = request.forms.get('x1')
	y1 = request.forms.get('y1')
	# x2 y2: here we want to go
	x2 = request.forms.get('x2')
	y2 = request.forms.get('y2')
	stepx = x2 - x1
	stepy = y2 - y1
	if (stepy > 0)
		# Forward
		for x in range(1, stepy, 1)
			Ab.forward()
			Ab.stop()
	if (stepy < 0)
		# Backward
		for x in range(1, -1 * stepy, 1)
			Ab.backward()
			Ab.stop()
	if (stepx > 0)
		# Right
		Ab.right()
		Ab.stop()
		for x in range(1, stepx, 1)
			Ab.forward()
			Ab.stop()
	if (stepx < 0)
		# Left
		Ab.left()
		Ab.stop()
		for x in range(1, -1 * stepx, 1)
			Ab.forward()
			Ab.stop()

run(host="0.0.0.0",port="8000")