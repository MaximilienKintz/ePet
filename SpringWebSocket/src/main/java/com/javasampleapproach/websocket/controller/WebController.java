package com.javasampleapproach.websocket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.javasampleapproach.websocket.model.Hello;
import com.javasampleapproach.websocket.model.Location;
import com.javasampleapproach.websocket.model.Position;
import com.javasampleapproach.websocket.model.User;

@Controller
public class WebController {
	
	@Autowired
	private GameTimer gameController;
	
	@MessageMapping("/hello")
	@SendTo("/topic/hi")
	public Hello greeting(User user) throws Exception {
	    return new Hello("Hi, " + user.getName() + "!");
	}
	
	@MessageMapping("/location")
	@SendTo("/topic/info")
	public Position test(Position requestedLocation) throws Exception {
		Location location = gameController.getLocation();
		synchronized (location) {
			location.setLat(requestedLocation.getX());
			location.setLng(requestedLocation.getY());
		}
	    return requestedLocation;
	}
	
	@Autowired
	private SimpMessagingTemplate template;


	public void sendMessage(Location location) throws Exception {
	    this.template.convertAndSend("/topic/location", location);
	}
	
	public void sendMessage(String str) throws Exception {
	    this.template.convertAndSend("/topic/info", str);
	}
	
	public void sendUIMessage(String str) throws Exception {
	    this.template.convertAndSend("/topic/comm", str);
	}
}
