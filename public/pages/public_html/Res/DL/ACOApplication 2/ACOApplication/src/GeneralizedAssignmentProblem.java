//  A Java implementation of an ant colony optimization algorithm for the
//  generalized assignment problem.
//  Initially a port of James McCaffery's ACO algorithm for TSP in C#.
//  gcohan14, hrogers13, awu13. Last revision 11/28/12.

//package aco_demo;

import java.util.Arrays;
import java.util.Random;
import java.io.File;
import java.io.LineNumberReader;
import java.io.FileReader;

import antGraphics.ACOApp;
import antGraphics.AntMode;
import antGraphics.Waiter;

public class GeneralizedAssignmentProblem extends Thread {

	// GAP variables
	static int NUM_AGENTS; // init. # of agents and tasks in makeGraph()
	static int NUM_TASKS; // now static ints due to Java not allowing assignment of static finals outside of declaration
	static final double CAPACITY_VALUE=8.0;

	// ACO variables
	static final int ALPHA = 3;
	static final int BETA = 2;
	static final double TAUETA_LOWER_BOUND = 0.0001;
	static final double TAUETA_UPPER_BOUND = Double.MAX_VALUE / (NUM_AGENTS * 100);
	static final double FEASIBLE_PHEROMONE_VALUE = 0.05; // value added to pheromone if feasible assignment found
	static final double INFEASIBLE_PHEROMONE_VALUE = 0.01; // " if assignment is infeasible
	static final int MIN_NUMBER_OF_RUNS=15;
	static final int MAX_NUMBER_OF_RUNS=100;

	// "object variables"
	static int solution = Integer.MAX_VALUE; // init
	static int best_solution = Integer.MAX_VALUE;
	static int threshold = 1000;
	static double[] capacities;
	static int[] assigned_solution;
	static int[] assigned;
	static double[][][] graph;

	// objects
	static Random generator;
	static LineNumberReader reader;

	// flags/settings
	static final int verbosity = 2; // 0 = print final solution, 1 = print solution search stuff, 2 = print everything
	static final long seed = 0; // for Random generator


	/*-------------GUI VARIABLES-----------*/
	static ACOApp GUI;
	public Waiter wait1;
	public AntMode mode;   
	/* mode when the algorithmic thread is notified, 
	 * 1 is step to next solution, 
	 * 2 is step to next best solution, 
	 * 3 is step transition from mode 2 to 1
	 */

	/*--------------END OF GUI VARIABLES----------*/

	public GeneralizedAssignmentProblem() {
		super();
		wait1 = new Waiter(1);
		mode = new AntMode(1);
	}

	public void run() {

		String[] args = {"res/problem.dat"};

		try {

			if (args.length != 1) {
				System.out.println("Usage: java GeneralizedAssignmentProblem <filename>");
				System.exit(1);
			}
			init(args[0]);

			// makes GUI after initialization of graph
			GUI = new ACOApp(graph, wait1);

			synchronized(wait1) {
				if (verbosity >=1)
					System.out.println("Made it to first wait before initial solution");
				wait1.wait();
			}
			
			int i = 0; // run counter
			/*while (((solution > threshold || solution == 0) && 
					// checks for zero (cost zero if solution infeasible)
					i < MAX_NUMBER_OF_RUNS) || i < MIN_NUMBER_OF_RUNS) {*/
			while (true) {

				synchronized (wait1) {
					solution = findASolution(graph, assigned); // main loop
					
					if (solution < best_solution) {
						best_solution = solution;
						assigned_solution = Arrays.copyOf(assigned,assigned.length);

						if (mode.m == 2) {
							GUI.drawSolution(assigned_solution, capacities, CAPACITY_VALUE, mode, solution, best_solution);
							wait1.wait();
						}
					}
					if (verbosity >= 1)
						System.out.println("Made it to second wait after obtaining initial solution");
					
					if (verbosity >= 1) 
						System.out.println("Solution cost currently " + solution + ", best solution is " + best_solution);
					i++;
					
					/*if (mode.m == 2)
						GUI.drawSolution(assigned, capacities, CAPACITY_VALUE, mode);*/
					
					if (mode.m == 1) {
						GUI.drawSolution(assigned, capacities, CAPACITY_VALUE, mode, solution, best_solution);
						wait1.wait();
					}
					if (mode.m == 3)
						mode.m = 1;
				}
			}
			//printSolution();

		} catch (Exception e) {
			System.err.println("\n" + e.getMessage());
			e.printStackTrace();
			System.exit(1);
		}
	}

	static void init(String filename) throws Exception {
		generator = new Random(seed);
		//makeGraph(filename);
		makeGraphRandom();
		capacities = new double[NUM_AGENTS];  //keep track of capacities
		assigned = new int[NUM_TASKS];  //keep track of assigned tasks and who they were assigned to
		Arrays.fill(assigned, -1);
	}

	static void makeGraphRandom() throws Exception {
		NUM_AGENTS = 12;
		NUM_TASKS = 16;
		graph = new double[NUM_AGENTS][NUM_TASKS][3]; // use innermost array as holding <cost, capacity, pheromone>
		for (int i = 0; i < NUM_AGENTS; i++) { // go through agents
			for (int j = 0; j < NUM_TASKS; j++) { // go through tasks 
				for (int k = 0; k < 3; k++) { // begin assigning <cost, capacity, pheromone>
					switch (k) {
					case 0: // cost if agent does this task
						graph[i][j][k] = generator.nextInt(10)+1; // [1,10)
						if (verbosity >= 2)
							System.out.println("cost = " + graph[i][j][k] + " (agent " + i + ", at task " + j + ")"); 
						break;
					case 1: // capacity lost if agent does this task
						graph[i][j][k] = generator.nextInt(4)+1; // [1,4)
						if (verbosity >= 2) 
							System.out.println("capacity = " + graph[i][j][k] + "  (agent " + i + ", task " + j + ")");
						break;
					case 2: // pheromone
						graph[i][j][k] = 0;
						break;
					default: // error
						throw new Exception("Attempted to access element " + k + " in innermost array!");
					}		
				}
			}	
		}
	}

	static void makeGraph(String filename) throws Exception { // the joys of reading files in Java
		System.out.println(filename);
		reader = new LineNumberReader(new FileReader(new File(filename)));
		String line = null;

		{ // on first run, set NUM_AGENTS and NUM_TASKS and perform checks (matrix is rectangular, etc.)
			int num_agents = 0;
			String[] tasks;
			while ((line = reader.readLine()) != null) {
				tasks = line.split("\t");	    
				if (num_agents == 0) { // set NUM_AGENTS and NUM_TASKS
					NUM_TASKS = tasks.length;
				} else {
					if (tasks.length != NUM_TASKS)
						throw new Exception("Matrix in " + filename + " isn't rectangular!");
				}
				// at termination the number of lines read in should reflect the number of agents
				num_agents = reader.getLineNumber();
			}
			NUM_AGENTS = num_agents;

		}

		reader.close();
		graph = new double[NUM_AGENTS][NUM_TASKS][3]; // use innermost array as holding <cost, capacity, pheromone>

		{ // now we actually build the graph
			reader = new LineNumberReader(new FileReader(new File(filename)));
			int i=0;
			while ((line = reader.readLine()) != null && i < NUM_AGENTS) {
				String[] assignment = line.split("\t");
				for (int j=0; j<NUM_TASKS; j++) {
					graph[i][j][0] = Double.parseDouble(assignment[j].split(",")[0]); // cost
					if (verbosity >= 2)
						System.out.println("cost = " + graph[i][j][0] + " (agent " + i + ", at task " + j + ")"); 
					graph[i][j][1] = Double.parseDouble(assignment[j].split(",")[1]); // capacity
					if (verbosity >= 2) 
						System.out.println("capacity = " + graph[i][j][1] + "  (agent " + i + ", task " + j + ")");
					graph[i][j][2] = 0; // pheromone
				}
				i++;
			}
		}

		reader.close();

	}

	static void printSolution() {
		System.out.println("Solution is: " + ((best_solution == 0) ? "infeasible" : best_solution));
		int sum_check=0;
		for (int i=0; i < NUM_TASKS; i++) {
			sum_check += graph[assigned_solution[i]][i][0];
			System.out.println("Agent " + assigned_solution[i] + " assigned to task " + i);
			if (verbosity >= 2)
				System.out.println("\t (agent cost = " + graph[assigned_solution[i]][i][0] + ", sum_check = " + sum_check + ")");
		}
		if (verbosity >= 2) {
			System.out.print("sum_check = " + sum_check + ", best_solution = " + best_solution);
			if (sum_check == best_solution) 
				System.out.println("\tverified!");
			else 
				System.out.println("\tvalues don't match!");
		}
	}

	static int findASolution(double[][][] graph, int[] assigned) throws Exception {
		//loop: while there are still tasks that need to be assigned
		//1. pick new unassigned task randomly
		//2. assign that task to an agent using "action choice rule"

		// init capacities

		double[] capacities = new double[NUM_AGENTS];
		for (int i=0; i<NUM_AGENTS; i++) {
			capacities[i] = CAPACITY_VALUE;
		}

		//create random ordering for processing tasks

		int[] order = new int[NUM_TASKS];
		for (int i = 0; i < order.length; i++) {
			order[i] = i;
		}

		// randomize order of assignments
		for (int i=0; i < order.length; i++) { // Fisher-Yates (Knuth) shuffle
			int random = generator.nextInt(order.length - i) + i; // [i, order.length)
			int temp = order[random];
			order[random] = order[i];
			order[i] = temp;
		}

		int currTask = 0; //increment this after each iteration through loop
		boolean foundFeasible = true;

		while (currTask < NUM_TASKS) {
			int agent = pickAgent(order[currTask], capacities, graph);
			if (agent != -1) {
				assigned[order[currTask]] = agent;
				if (verbosity >= 1) 
					System.out.println("\tAssigned " + agent + " to " + currTask + " in order[]");
				currTask++;
			} else { // if we didn't get a proper agent, this solution wasn't feasible
				foundFeasible = false;
				break;
			}
		}
		
		int cost = 0;
		if (foundFeasible) {
			
			for (int i = 0; i < assigned.length; i++) {
				cost += graph[assigned[i]][i][0];
				if (verbosity >= 1)
					System.out.println("\tAgent " + assigned[i] + " now has cost " + cost);
			}
		}
		GeneralizedAssignmentProblem.capacities = capacities;
		updatePheromones(assigned, graph, foundFeasible);
		return cost;
	}

	static void updatePheromones(int[] assignments, double[][][] graph, boolean isFeasible) {
		double pheromoneValue = isFeasible ? FEASIBLE_PHEROMONE_VALUE : INFEASIBLE_PHEROMONE_VALUE;
		for (int i = 0; i < assignments.length; i++) {
			//i is the task, assignments[i] is the agent for that task
			if (assignments[i] > 0) {
				graph[assignments[i]][i][2] += pheromoneValue;
				if (verbosity >= 1)
					System.out.println("\tAgent " + assignments[i] + " (task " + i + ") now has pheromoneValue " + graph[assignments[i]][i][2]);
			}
		}
	}

	static int pickAgent(int k, double[] capacity, double[][][] graph) throws Exception {

		double[] probs = moveProbs(k, capacity, graph);

		double[] cumul = new double[probs.length + 1];
		for (int i = 0; i < probs.length; ++i) {
			cumul[i + 1] = cumul[i] + probs[i]; // consider setting cumul[cuml.length-1] to 1.00
		}

		double p = generator.nextDouble();
		for (int i = 0; i < cumul.length-1; ++i) { 
			if (p >= cumul[i] && p < cumul[i + 1]) { // we subtract capacities here
				capacity[i] -= graph[i][k][1];
				return i;
			}
		}
		return -1; //means we didn't find a valid agent, so we return sentinel value
	}


	static double[] moveProbs(int k, double[] capacity, double[][][] graph) {
		double[] taueta = new double[NUM_AGENTS]; 
		double sum = 0.0; // sum of all tauetas
		for (int i = 0; i < taueta.length; ++i) { // i is the agent in question
			if (capacity[i] <= graph[i][k][1]) {
				taueta[i] = 0.0; // prob of moving to an agent that can't handle the task is 0
			} else {
				taueta[i] = Math.pow(graph[i][k][2], ALPHA) * Math.pow((1.0 / graph[i][k][0]), BETA); 
				// ^ could be huge when pheromone is big; now we come back to these upper and lower bounds
				if (taueta[i] < TAUETA_LOWER_BOUND)
					taueta[i] = TAUETA_LOWER_BOUND;
				else if (taueta[i] > TAUETA_UPPER_BOUND) 
					taueta[i] = TAUETA_UPPER_BOUND;
			}
			sum += taueta[i];
		}
		double[] probs = new double[NUM_AGENTS];
		for (int i = 0; i < probs.length; i++)
			if (sum > 0) probs[i] = taueta[i] / sum; // big trouble if sum = 0.0
			else probs[i] = 0;
		return probs;
	}

}