# NeoPixel library strandtest example
# Author: Tony DiCola (tony@tonydicola.com)
#
# Direct port of the Arduino NeoPixel library strandtest example.  Showcases
# various animations on a strip of NeoPixels.
import time
import sys

from neopixel import *


# LED strip configuration:
LED_COUNT      = 4      # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (must support PWM!).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 5       # DMA channel to use for generating signal (try 5)
LED_BRIGHTNESS = 255     # Set to 0 for darkest and 255 for brightest
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)

def ledOUT():
	strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, 0)
	strip.begin()
	strip.show()

def ledON():
	strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, 255)
	strip.begin()
	strip.setPixelColor(0, Color(arg1, arg2, arg3))       #
	strip.setPixelColor(1, Color(arg1, arg2, arg3))       #
	strip.setPixelColor(2, Color(arg1, arg2, arg3))       #
	strip.setPixelColor(3, Color(arg1, arg2, arg3))     #
	strip.show()


arg1 = int(sys.argv[1])
arg2 = int(sys.argv[2])
arg3 = int(sys.argv[3])
command = sys.argv[4]

print(arg1)
print(arg2)
print(arg3)
print ("Command: " + command)


if command == "onnnn":
	ledON()
elif command == "offff":
	ledOUT()
elif command == "blink":
	ledON()
	time.sleep(0.500)
	ledOUT()
elif command == "burst":
	ledON()
	time.sleep(0.500)
	ledOUT()
	time.sleep(0.500)
	ledON()
	time.sleep(0.500)
	ledOUT()
	time.sleep(0.500)
	ledON()
	time.sleep(0.500)
	ledOUT()

