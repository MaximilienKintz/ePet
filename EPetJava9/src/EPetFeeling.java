import java.util.Scanner;

public class EPetFeeling {
	
	private boolean reallyMove = false;

	private int hungry;
	private int happy;
	private int fit;

	public EPetFeeling() {
		hungry = (int) (100 * Math.random());
		happy = (int) (100 * Math.random());
		fit = (int) (100 * Math.random());
		System.out.println("Start with " + toString());
		mainLoop();
	}

	private void moveBasedOnFeeling() {
		int speed = 50;
		if (hungry > 50) {
			speed -= 10;
		}
		if (fit < 50) {
			speed -= 10;
		}
		System.out.println("Change speed to " + speed);
		if (reallyMove) {
			MainEPet.changeSpeedTo(speed);
		}

		int xFrom = 10;
		int yFrom = 10;

		int xTo = xFrom;
		int yTo = yFrom;

		int bonus = (fit > 50) ? 3 : 1;

		bonus = (happy < 50) ? -1 : 1;

		xTo += bonus * 2;
		yTo += bonus * 5;

		if (reallyMove) {
			MainEPet.moveFromTo(xFrom, yFrom, xTo, yTo);
		}

	}
	
	private void eat() {
		hungry = Math.max(0, hungry - 10);
		if (hungry < 50) {
			happy = Math.min(100, happy + 10);
			fit = Math.min(100, fit + 10);
		}
	}
	
	private void play() {
		happy = Math.min(100, happy + 10);
		fit = Math.max(0, fit - 10);
		hungry = Math.min(100, hungry + 10);
	}
	
	private String saySomething() {
		if (hungry > 80) {
			return "So hungry I cannot think of anything else";
		} else if (hungry > 50 && happy > 50) {
			return "Happy and hungry";
		} else if (fit < 50) {
			return "Too tired!";
		} else if (happy < 50) {
			return "Feedling sad";
		} else {
			return "Everything's fine";
		}
	}

	private void mainLoop() {
		Scanner scan = new Scanner(System.in);
		while (true) {
			try  {
				String input = scan.nextLine();
				input.trim();
				System.out.println("Input: " + input);
				switch (input) {
				case "eat":
					eat();
					break;
				case "play":
					play();
					break;
				case "quit":
					System.exit(0);
					break;
				default:
					System.out.println("Continue");
					break;
				}
				System.out.println("Result: " + toString());
				String mood = saySomething();
				System.out.println(mood);
				moveBasedOnFeeling();
			} catch (Exception e) {
				System.out.println("Please enter something, 'quit' to quit");
			}
		}

	}

	@Override
	public String toString() {
		return "Hungry: " + hungry + ", Happy: " + happy + ", Fit: " + fit;
	}

	public static void main(String[] args) {
		EPetFeeling ePet = new EPetFeeling();
	}

}
