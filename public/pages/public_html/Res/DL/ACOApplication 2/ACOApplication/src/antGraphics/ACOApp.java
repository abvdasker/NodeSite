package antGraphics;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Toolkit;
import javax.swing.JFrame;

public class ACOApp extends Thread {

	static ACOPanel panel;
	static JFrame appFrame;
	static double[][][] theGraph;
	public static Waiter wait1;

	int verbosity = 0;

	public ACOApp(double[][][] graph, Waiter w) {
		wait1 = w;
		theGraph = graph;
		try {
			javax.swing.SwingUtilities.invokeAndWait(this);
		} catch (Exception e) {
			System.err.println("Exception: failed to create GUI due to : \n" + e.getMessage());
			e.printStackTrace();
		}
	}

	public void run() {
		createAndShowGUI();
	}

	private static void createAndShowGUI() {
		//Create and set up the window.
		appFrame = new JFrame();
		appFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

		System.out.println("creating GUI. . .");

		Dimension dimension = Toolkit.getDefaultToolkit().getScreenSize();
		System.out.println(dimension.width);
		System.out.println(dimension.height);
		appFrame.setPreferredSize(dimension);

		panel = new ACOPanel(theGraph, dimension, wait1);
		panel.setOpaque(true);
		panel.setBackground(Color.white);
		panel.setVisible(true);
		panel.setDoubleBuffered(true);
		appFrame.setContentPane(panel);		

		appFrame.validate();
		appFrame.pack();
		appFrame.setVisible(true);
		
		System.out.println("HIERARCHY:");
		System.out.println(panel.getSize().width + ", " +panel.getSize().height);
		System.out.println(panel.canvas.getSize().width + ", "+panel.canvas.getSize().height);
	}
	
	public void drawSolution(int[] solution, double[] capacities, double capConst, AntMode mode, int sol, int best_solution){
		panel.mode = mode;
		panel.canvas.drawSolution(solution, capacities, capConst, true, sol, best_solution);
	}

}