import time
import socket
import requests
import subprocess

from bottle import get,post,run,request,template
from AlphaBot2 import AlphaBot2

print('ePet Web Server Test 4 Start ...')
Ab = AlphaBot2()

Ab.stop()



def getIP():
	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	s.connect(("8.8.8.8", 80))
	ip = s.getsockname()[0]
	s.close()
	return ip
	
def registerDevice():
	ip = getIP() +":8000";
	url = 'https://epet-epet.training.altemista.cloud/register?ip='+ip
	resp = requests.post(url, verify=False)
	print("URL: " + url)
	print(ip)

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
	elif code.startswith("speed"):
		speed=code[5:]
		Ab.setPWMA(float(speed))
		Ab.setPWMB(float(speed))
		print(speed)
	elif code.startswith("rgb"):
		c1 = code[3:6]
		c2 = code[6:9]
		c3 = code[9:12]
		command = code[12:17]
		print(c1 + " " + c2 + " " + c3 + " - " + command)
		subprocess.call(['sudo', 'python', 'ePetRGB2.py', c1, c2, c3, command])
	return "OK"

@post("/gotox")
def gotox():
	# x1 y1: here we are
	x1 = int(request.forms.get('x1'))
	y1 = int(request.forms.get('y1'))
	# x2 y2: here we want to go
	x2 = int(request.forms.get('x2'))
	y2 = int(request.forms.get('y2'))
	stepx = x2 - x1
	stepy = y2 - y1
	print("stepx " + str(stepx) + ", stepy " + str(stepy))
	if stepy > 0:
		# Forward
		for x in range(1, stepy, 1):
			Ab.forward()
			time.sleep(1)
			Ab.stop()
	if stepy < 0:
		# Backward
		for x in range(1, -1 * stepy, 1):
			Ab.backward()
			time.sleep(1)
			Ab.stop()
	if stepx > 0:
		# Right
		Ab.forward()
		Ab.right()
		time.sleep(1)
		Ab.stop()
		for x in range(1, stepx, 1):
			Ab.forward()
			time.sleep(1)
			Ab.stop()
	if stepx < 0:
		# Left
		Ab.forward()
		Ab.left()
		time.sleep(1)
		Ab.stop()
		for x in range(1, -1 * stepx, 1):
			Ab.forward()
			time.sleep(1)
			Ab.stop()

registerDevice()

run(host="0.0.0.0",port="8000")