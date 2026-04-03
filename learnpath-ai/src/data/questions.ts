import type { Topic } from "../types";

export interface Question {
  id: string;
  topic: Topic;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export const reassessmentQuestions: Record<Topic, Question[]> = {
  DSA: [
    {
      id: "dsa_1",
      topic: "DSA",
      text: "Which data structure is ideal for implementing a LIFO mechanism?",
      options: ["Queue", "Stack", "Linked List", "Tree"],
      correctAnswerIndex: 1
    },
    {
      id: "dsa_2",
      topic: "DSA",
      text: "What is the worst-case time complexity of quicksort?",
      options: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"],
      correctAnswerIndex: 1
    },
    {
      id: "dsa_3",
      topic: "DSA",
      text: "Which traversal explores all neighbor nodes at the present depth before moving deeper?",
      options: ["Breadth-First Search", "Depth-First Search", "Pre-order Traversal", "In-order Traversal"],
      correctAnswerIndex: 0
    }
  ],
  OS: [
    {
      id: "os_1",
      topic: "OS",
      text: "What is the main function of an operating system?",
      options: ["Manage hardware resources", "Compile code", "Provide internet access", "Render UI"],
      correctAnswerIndex: 0
    },
    {
      id: "os_2",
      topic: "OS",
      text: "What causes a deadlock?",
      options: ["High CPU usage", "Processes waiting indefinitely for each other", "Memory leak", "Network failure"],
      correctAnswerIndex: 1
    },
    {
      id: "os_3",
      topic: "OS",
      text: "Which scheduling algorithm gives processes equal time slices?",
      options: ["First Come First Serve", "Shortest Job Next", "Round Robin", "Priority Scheduling"],
      correctAnswerIndex: 2
    }
  ],
  DBMS: [
    {
      id: "dbms_1",
      topic: "DBMS",
      text: "What does ACID stand for in databases?",
      options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Consistency, Interactivity, Data", "Automated, Created, Indexed, Deleted", "Analog, Constant, Independent, Durable"],
      correctAnswerIndex: 0
    },
    {
      id: "dbms_2",
      topic: "DBMS",
      text: "Which SQL command is used to add new data to a table?",
      options: ["UPDATE", "ADD", "INSERT INTO", "MODIFY"],
      correctAnswerIndex: 2
    },
    {
      id: "dbms_3",
      topic: "DBMS",
      text: "What is a primary key?",
      options: ["A password", "A unique identifier for a record", "The first column mapped", "A foreign relationship"],
      correctAnswerIndex: 1
    }
  ],
  Algorithms: [
    {
      id: "alg_1",
      topic: "Algorithms",
      text: "Which algorithmic paradigm does Dijkstra's algorithm use?",
      options: ["Dynamic Programming", "Greedy", "Divide and Conquer", "Backtracking"],
      correctAnswerIndex: 1
    },
    {
      id: "alg_2",
      topic: "Algorithms",
      text: "What problem does dynamic programming solve?",
      options: ["Overlapping subproblems", "Random generation", "Syntax errors", "Database scaling"],
      correctAnswerIndex: 0
    },
    {
      id: "alg_3",
      topic: "Algorithms",
      text: "Which sort is considered a stable sort?",
      options: ["Merge Sort", "Quick Sort", "Heap Sort", "Selection Sort"],
      correctAnswerIndex: 0
    }
  ],
  Math: [
    {
      id: "m_1",
      topic: "Math",
      text: "What is the derivative of e^x?",
      options: ["e^x", "x * e^(x-1)", "1 / e^x", "e^x * dx"],
      correctAnswerIndex: 0
    },
    {
      id: "m_2",
      topic: "Math",
      text: "In linear algebra, a matrix multiplication is commutative.",
      options: ["True", "False"],
      correctAnswerIndex: 1
    },
    {
      id: "m_3",
      topic: "Math",
      text: "What is the probability of rolling a sum of 7 with two standard dice?",
      options: ["1/6", "1/12", "1/36", "7/36"],
      correctAnswerIndex: 0
    }
  ],
  WebDev: [
    {
      id: "wd_1",
      topic: "WebDev",
      text: "What does DOM stand for?",
      options: ["Data Output Module", "Document Object Model", "Dynamic Orientation Matrix", "Document Oriented Middleware"],
      correctAnswerIndex: 1
    },
    {
      id: "wd_2",
      topic: "WebDev",
      text: "Which hook is used for side effects in React?",
      options: ["useState", "useContext", "useEffect", "useMemo"],
      correctAnswerIndex: 2
    },
    {
      id: "wd_3",
      topic: "WebDev",
      text: "What is responsive web design?",
      options: ["Designing for fastest load times", "Adapting layout for different screen sizes", "Using server-side rendering", "Having smooth animations"],
      correctAnswerIndex: 1
    }
  ],
  ML: [
    {
      id: "ml_1",
      topic: "ML",
      text: "What is overfitting?",
      options: ["Model performs well on training data but poorly on unseen data", "Model performs poorly on both training and test data", "Model runs too long and crashes", "Model fits in too much memory"],
      correctAnswerIndex: 0
    },
    {
      id: "ml_2",
      topic: "ML",
      text: "Which of these is un-supervised learning?",
      options: ["Linear Regression", "Decision Trees", "K-Means Clustering", "Support Vector Machines"],
      correctAnswerIndex: 2
    },
    {
      id: "ml_3",
      topic: "ML",
      text: "What is an epoch?",
      options: ["One forward pass", "One update of the gradients", "One full pass of the training dataset", "A random batch of data"],
      correctAnswerIndex: 2
    }
  ],
  General: [
    {
      id: "gen_1",
      topic: "General",
      text: "Which methodology advocates for short cycles and iterative changes?",
      options: ["Waterfall", "Agile", "V-Model", "Spiral"],
      correctAnswerIndex: 1
    },
    {
      id: "gen_2",
      topic: "General",
      text: "What is Git?",
      options: ["A database system", "Version control system", "Programming language", "Cloud provider"],
      correctAnswerIndex: 1
    },
    {
      id: "gen_3",
      topic: "General",
      text: "What principle states that a class should have one reason to change?",
      options: ["Open-Closed", "Single Responsibility", "Liskov Substitution", "Interface Segregation"],
      correctAnswerIndex: 1
    }
  ]
};
