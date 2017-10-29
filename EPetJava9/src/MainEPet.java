import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainEPet {

	private static final String BASE_URL = "http://10.200.19.59:8000";
	private static final String BASE_URL_CMD = BASE_URL + "/cmd";
	private static final String BASE_URL_GOTOX = BASE_URL + "/gotox";

	private static final int baseDuration = 50;
	
	// HTTP POST request
	private static void sendPost(String url, String parameters) throws Exception {

		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();

		// add reuqest header
		con.setRequestMethod("POST");
		con.setRequestProperty("User-Agent", "ePet Client");
		con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");

		// Send post request
		con.setDoOutput(true);
		DataOutputStream wr = new DataOutputStream(con.getOutputStream());
		wr.writeBytes(parameters);
		wr.flush();
		wr.close();

		int responseCode = con.getResponseCode();
		
		System.out.println("Sending 'POST' request to URL : " + url + " Post parameters : " + parameters + " Response Code : " + responseCode);

		BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();


	}
	
	public static void changeSpeedTo(int newSpeed) {
		try {
			sendPost(BASE_URL_CMD, "speed" + newSpeed);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void moveFromTo(int xFrom, int yFrom, int xTo, int yTo) {

		try {
			int deltaX = xTo - xFrom;
			int deltaY = yTo - yFrom;
			
			System.out.println("Move from ("+xFrom + ","+xTo+") to ("+yFrom + ","+yTo+")");

			System.out.println("DeltaX: " + deltaX + ", DeltaY: " + deltaY);
			if (deltaY > 0) {
				// Move forward
				int duration = baseDuration * deltaY;
				sendPost(BASE_URL_CMD, "forward");
				Thread.sleep(duration);
				sendPost(BASE_URL_CMD, "stop");
			} else if (deltaY < 0) {
				// Move backward
				int duration = -baseDuration * deltaY;
				sendPost(BASE_URL_CMD, "backward");
				Thread.sleep(duration);
				sendPost(BASE_URL_CMD, "stop");
			}
			System.out.println("Done moving forward or backward, wait before turning.");
			Thread.sleep(1000);
			if (deltaX > 0) {
				sendPost(BASE_URL_CMD, "forward");
				sendPost(BASE_URL_CMD, "turnleft");
				Thread.sleep(baseDuration);
				int duration = baseDuration * deltaX;
				sendPost(BASE_URL_CMD, "forward");
				Thread.sleep(duration);
				sendPost(BASE_URL_CMD, "stop");
			} else if (deltaX < 0) {
				sendPost(BASE_URL_CMD, "forward");
				sendPost(BASE_URL_CMD, "turnright");
				Thread.sleep(baseDuration);
				int duration = -baseDuration * deltaX;
				sendPost(BASE_URL_CMD, "forward");
				Thread.sleep(duration);
				sendPost(BASE_URL_CMD, "stop");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private static void sampleXYDemo() {

		
		moveFromTo(10, 5, 10, 7);
		
		System.out.println("Wait and then move back");

		sleep(2000);
		
		moveFromTo(10, 7, 10, 5);
		
		System.out.println("Wait and then turn");

		sleep(2000);
		moveFromTo(10, 5, 8, 5);
		
		System.out.println("Wait and then move back");
		sleep(2000);
		
		moveFromTo(8, 5, 10, 5);
	}
	
	private static void sleep(int ms) {
		try {
			Thread.sleep(ms);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	private static void sampleDemo() {

		try {
			// sendPost(BASE_URL_CMD, "forward");
			// sendPost(BASE_URL_CMD, "stop");
			sendPost(BASE_URL_CMD, "forward");
	//		sendPost(BASE_URL_CMD, "turnleft");
			Thread.sleep(100);
			sendPost(BASE_URL_CMD, "stop");
//			Thread.sleep(1000);
//			sendPost(BASE_URL_CMD, "forward");
//			sendPost(BASE_URL_CMD, "turnright");
//			Thread.sleep(1000);
//			sendPost(BASE_URL_CMD, "stop");

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) {

		try {
			//sampleXYDemo();
			changeSpeedTo(50);
			sampleDemo();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
