package antGraphics;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JPanel;

import antGraphics.AntMode;
import antGraphics.ArtComponent;
import antGraphics.Waiter;

public class ACOPanel extends JPanel implements ActionListener {

	JButton startButton;
	JButton stepButton;
	JButton nextBestButton;
	
	Dimension frameSize;
	ArtComponent canvas;
	Waiter wait1;
	boolean foundSolution = false;
	AntMode mode = new AntMode(1);

	public ACOPanel(double[][][] graph, Dimension d, Waiter w) {
		super(new FlowLayout());
		wait1 = w;
		
		this.setPreferredSize(d);
		frameSize = d;
		
		System.out.println("This is the Panel size: "+this.getSize().width + ", " +this.getSize().height);

		canvas = new ArtComponent(graph, d, this);
		canvas.setOpaque(true);
		canvas.setVisible(true);
		canvas.setBackground(Color.black);
		canvas.setBorder(BorderFactory.createLineBorder(Color.black, 3));
		
		startButton = new JButton("Begin ACO");
		startButton.addActionListener(this);
		stepButton = new JButton("Step to Solution");
		stepButton.addActionListener(this);
		stepButton.setEnabled(false);
		nextBestButton = new JButton("Step to Next Best Solution");
		nextBestButton.addActionListener(this);
		nextBestButton.setEnabled(false);
		
		this.add(startButton);
		this.add(stepButton);
		this.add(nextBestButton);
		
		this.add(canvas);
		
	}

	public void actionPerformed(ActionEvent e) {
		if (e.getSource() == startButton) {
			System.out.println("start button pressed!");
			synchronized(wait1) {
				wait1.notify();
			}
			stepButton.setEnabled(true);
			nextBestButton.setEnabled(true);
			startButton.setEnabled(false);
		} else if (e.getSource() == stepButton) {
			System.out.println("step button pressed!");
			synchronized(wait1) {
				if (mode.m == 2)
					mode.m = 3;
				wait1.notify();
			}
		} else if (e.getSource() == nextBestButton) {
			System.out.println("Step to next button Pressed!");
			synchronized(wait1) {
				mode.m = 2;
				wait1.notify();
			}
		}
	}
}