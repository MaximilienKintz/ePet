/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.javasampleapproach.websocket.controller;

import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.javasampleapproach.websocket.model.Location;

/**
 * Sets up the timer for the multi-player snake game WebSocket example.
 */
@Controller
public class GameTimer {

	private static final long TICK_DELAY = 100;

	private static final Logger log = LoggerFactory.getLogger(GameTimer.class);

	private final Object LOCK = new Object();

	private static Timer gameTimer = null;
	
	private Location location;
	
	
	
	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	@Autowired
	private WebController controller;
	
	@PostConstruct
	public void init() {
		location = new Location(0,0);
		startTimer();
	}

	public void broadcast(String message) throws Exception {
		controller.sendMessage(message);
	}
	
	public void broadcast(Location location) {
		try {
			controller.sendMessage(location);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void startTimer() {
		stopTimer();
		
		gameTimer = new Timer("Timer");
		gameTimer.scheduleAtFixedRate(new TickTimerTask(location, this), TICK_DELAY, TICK_DELAY);
	}

	public static void stopTimer() {
		if (gameTimer != null) {
			gameTimer.cancel();
		}
	}
	
	public class TickTimerTask extends TimerTask {
			
			private Location location;
			private GameTimer locationController;
			
			
			public TickTimerTask(Location location, GameTimer locationController) {
				super();
				this.location = location;
				this.locationController = locationController;
			}

			@Override
			public void run() {
				try {
					tick();
				}
				catch (Throwable ex) {
					log.error("Caught to prevent timer from shutting down", ex);
				}
			}
			
			public void tick() throws Exception {
				
				//Change location
				synchronized (location) {
					double lat = location.getLat();
					lat++;
					
					if(lat > 200) {
						lat = 0;
					}
					double lng = location.getLng();
					lng--;
					
					if(lng < -200) {
						lng = 0;
					}
					location.setLat(lat);
					location.setLng(lng);
				}
				
				locationController.broadcast(location);
			}
	}
}
