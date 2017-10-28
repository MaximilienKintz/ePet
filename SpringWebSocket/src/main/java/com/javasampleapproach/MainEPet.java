

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainEPet {

	private static final String BASE_URL = "http://169.254.95.201:8000";
	private static final String BASE_URL_CMD = BASE_URL + "/cmd";
	private static final String BASE_URL_GOTOX = BASE_URL + "/gotox";
	
	// HTTP POST request
		private static void sendPost(String url, String parameters) throws Exception {

			URL obj = new URL(url);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			

			//add reuqest header
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
			System.out.println("\nSending 'POST' request to URL : " + url);
			System.out.println("Post parameters : " + parameters);
			System.out.println("Response Code : " + responseCode);

			BufferedReader in = new BufferedReader(
			        new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();

			//print result
			System.out.println(response.toString());

		}
	
	private static void moveFromTo() {
		
	}
		
	public static void main(String[] args) {
		
		try {
			sendPost(BASE_URL_CMD, "forward");
			Thread.sleep(1000);
			sendPost(BASE_URL_CMD, "stop");
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

}
