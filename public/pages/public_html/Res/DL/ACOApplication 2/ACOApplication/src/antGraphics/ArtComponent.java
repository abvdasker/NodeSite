package antGraphics;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.Ellipse2D;
import java.awt.geom.Line2D;
import java.awt.geom.Rectangle2D;

import javax.swing.JComponent;

class ArtComponent extends JComponent {
	
	static double[][][] graph;
	Dimension thisSize;   // size of the canvas
	static float taskGapH;  // height of gap between task vertices
	static float agentGapH;   // height of gap between agent vertices
	
	static final int vertDiam = 30;  // diameter of a vertex circle
	static final int circleStroke = 4;   // stroke weight of vertex in pixels
	static final int lineStroke = 2;
	static final int lowerpad = 50;
	static final int offset = 3;   // line offset between solution and pheramone lines
	static final double threshold = 0.05;  // threshold below which pheramone levels do not appear
	
	static final float taskPadPercent = 0.15f;  // padding of task column from left (percent)
	static final float agentPadPercent = 0.85f;   // padding of agent column from left (percent)
	static final float solutionPadPercent = 0.03f;
	
	static float taskPadding;
	static float agentPadding;
	
	static Ellipse2D.Float[] tasksv;
	static Ellipse2D.Float[] agentsv;
	static Line2D.Float[] lines;
	
	static Line2D.Float[][] pheroLines;
	
	static int[] localSolution;
	static double[] localCaps;
	static double[] capPercents;
	static int minor_solution;
	static int best_solution;
	
	static double capConst;
	
	static ACOPanel parent;
	
	boolean foundSolution = false;
	
	public ArtComponent(double[][][] graph, Dimension size, ACOPanel p) {
		super();
		
		this.thisSize = computeFromParentSize(size);
		this.graph = graph;
		parent = p;
		this.setPreferredSize(thisSize);
		this.setDoubleBuffered(true);
		
		tasksv = new Ellipse2D.Float[graph[0].length];
		agentsv = new Ellipse2D.Float[graph.length];
		lines = new Line2D.Float[tasksv.length];
		pheroLines = new Line2D.Float[graph[0].length][graph.length];  // switch to graphical configuration
		capPercents = new double[agentsv.length];
		
		this.computePositions();

		this.repaint();
		
		System.out.println("trying to construct canvas");
		
	}
	
	public void computePositions() {
		
		System.out.println("computation canvas sizes used: "+thisSize.width+", "+thisSize.height);
		
		int tasks = graph[0].length;
		float totalH = thisSize.height - vertDiam*tasks;
		taskGapH = totalH/(tasks+1);
		
		int agents = graph.length;
		totalH = thisSize.height - vertDiam*agents;
		agentGapH = totalH/(agents+1);
		
		taskPadding = thisSize.width*taskPadPercent;
		agentPadding = thisSize.width*agentPadPercent;
		
		float drawAt = taskGapH;
		for (int i = 0; i < tasksv.length; i++) {
			tasksv[i] = new Ellipse2D.Float(taskPadding, drawAt, vertDiam, vertDiam);
			drawAt += taskGapH+vertDiam;
			//System.out.println(i+", "+(taskGapH+vertDiam)*(i+1));
		}
		
		drawAt = agentGapH;
		for (int i = 0; i < agentsv.length; i++) {
			agentsv[i] = new Ellipse2D.Float(agentPadding, drawAt, vertDiam, vertDiam);
			drawAt += agentGapH+vertDiam;
		}
		
	}
	
	public void paintComponent(Graphics g) {
		
		updateScale();
		
		System.out.println("Canvas size actually is: " +this.getSize().width +", "+this.getSize().height);
		System.out.println("Trying to paint Canvas of size: "+thisSize.width +", "+thisSize.height);
		
		super.paintComponent(g);
		Graphics2D g2d = (Graphics2D) g;
		g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, 
				 RenderingHints.VALUE_ANTIALIAS_ON);
		
		g2d.setPaint(Color.white);   // !!!!!!! hacky fix for bug below
		g2d.fill(new Rectangle2D.Float(0, 0, 10000, 10000));
		
		//g2d.setColor(Color.black);
		g2d.setPaint(Color.black);
		
		g2d.setStroke(new BasicStroke(circleStroke));
		
		/*for (Ellipse2D.Float eli : agentsv) {
			g2d.draw(eli);
		}*/
		
		//update(g);
		if (foundSolution) {
			System.out.println("drew lines");

			double maxPhero = getMaxPhero();
			for (int i = 0; i < pheroLines.length; i++) {
				for (int j = 0; j < pheroLines[i].length; j++) {
					g2d.setPaint(Color.red);
					int d = computeStroke(i, j, maxPhero);
					if (d != 0) {
						BasicStroke strokeW = new BasicStroke(d);
						g2d.setStroke(strokeW);
						g2d.draw(pheroLines[i][j]);
					}
				}
			}
			
			g2d.setPaint(Color.black);
			g2d.setStroke(new BasicStroke(lineStroke));
			
			for (Line2D.Float line: lines) {
				g2d.draw(line);
			}
			
			g2d.setFont(new Font(null, Font.PLAIN, 30));
			g2d.drawString(minor_solution+", "+best_solution, thisSize.width*solutionPadPercent, thisSize.height*0.5f);

		}
		
		for (Ellipse2D.Float eli : tasksv) {
			g2d.draw(eli);
		}
		
		for (int i = 0; i < agentsv.length; i++) {
			System.out.println(new Double(capPercents[i]).floatValue());
			Color c = new Color(0.0f, 0.0f, 0.0f, new Double(1.0 - capPercents[i]).floatValue());
			g2d.setPaint(c);
			g2d.fill(agentsv[i]);
			
			g2d.setPaint(Color.black);
			g2d.draw(agentsv[i]);
		}
	}
	
	public int computeStroke(int i, int j, double maxPhero) {
		double phero = graph[j][i][2]; 
		//double pherRatio = phero/maxPhero;
		if (phero < threshold)
			phero = 0;
		int weight = (int)(phero*10);
		//double exaggeratedWeight = Math.pow(pherRatio+.5, 4);
		//int weight;
		//if (exaggeratedWeight < 0.1)
		//	weight = 0;
		//weight = (int) Math.ceil(exaggeratedWeight);
		return weight;
	}
	
	public double getMaxPhero() {
		double maxPhero = Double.NEGATIVE_INFINITY;
		double temp;
		for (int i = 0; i < graph.length; i++) {
			for (int j = 0; j < graph[i].length; j++) {
				temp = graph[i][j][2];
				if (temp > maxPhero)
					maxPhero = temp;
			}
		}
		return maxPhero;
	}
	
	public void updateScale() {
		if (parent.getSize().width >= 150 && parent.getSize().height >= 200) {
			System.out.println("parent size used");
			Dimension temp = computeFromParentSize(parent.getSize());
			if (thisSize.equals(temp))
				return;
			thisSize = temp;
			this.setPreferredSize(thisSize);
			computePositions();
			if (foundSolution) {
				drawSolution(localSolution, localCaps, capConst, false, minor_solution, best_solution);
			}
		}
	}

	public Dimension computeFromParentSize(Dimension d) {
		return new Dimension((int)(d.width*(0.80)), d.height - lowerpad);
	}
	
	public void drawSolution(int[] solution, double[] capacities, double capConst, boolean fromButton, int sol, int best_solution) {
		for (double d: capacities) {
			System.out.println("incoming capacities: " +d);
		}
		localSolution = solution;
		localCaps = capacities;
		this.capConst = capConst;
		computeCaps();
		
		System.out.println("updating lines in drawSolution");
		int v;
		for (int i = 0; i < solution.length; i++) {   // creates solution lines
			v = solution[i];
			lines[i] = createLine(i, v, -3);
		}
		
		calcPheromones();
		
		if (!foundSolution) {
			foundSolution = true;
			parent.foundSolution = true;
		}
		
		if (fromButton) {
			this.minor_solution = sol;
			this.best_solution = best_solution;
			repaint();   // !!!!!!! causes a weird bug right now
		}
	}
	
	public void calcPheromones() {
		for (int i = 0; i < pheroLines.length; i++) {  // iterate through tasks
			for (int j = 0; j < pheroLines[i].length; j++) {   // iterate through agents
				pheroLines[i][j] = createLine(i, j, 3);
			}
		}
	}
	
	public Line2D.Float createLine(int i, int v, int offset){
		float sx = tasksv[i].x + vertDiam;
		float sy = tasksv[i].y + vertDiam/2.0f + offset;
		float ex = agentsv[v].x;
		float ey = agentsv[v].y + vertDiam/2.0f - offset;
		return new Line2D.Float(sx, sy, ex, ey);
	}
	
	public void computeCaps(){
		for (int i = 0; i < capPercents.length; i++) {
			capPercents[i] = localCaps[i]/capConst;
			System.out.println("cap perc" +capPercents[i]);
		}
	
	}
	
}