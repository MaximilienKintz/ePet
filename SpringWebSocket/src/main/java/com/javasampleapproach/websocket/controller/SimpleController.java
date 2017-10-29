package com.javasampleapproach.websocket.controller;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SimpleController {
	
	@Autowired
	private GameTimer gameController;
	
	@Autowired
	private WebController webController;

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();
    
    @RequestMapping(value="/register", method = RequestMethod.POST)
    @ResponseBody
    public String setBotIP(@RequestParam(value="ip") String ip) {
    	gameController.setRobotIp(ip);
    	
        return "OK";
    }
    
    @RequestMapping(value="/register", method = RequestMethod.GET)
    @ResponseBody
    public String getBotIP() {
        return gameController.getRobotIp();
    }
    
    @RequestMapping(value="/message", method = RequestMethod.POST)
    @ResponseBody
    public String setMessage(@RequestBody String message) {
    	try {
			webController.sendUIMessage(message);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
        return "OK";
    }
    
    
    
    
}