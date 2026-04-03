import type { Course } from "../types";

export const courses: Course[] = [
  // DSA
  {
    id: "dsa_01",
    title: "Data Structures Crash Course",
    topic: "DSA",
    level: "beginner",
    duration_hours: 10,
    description: "Learn arrays, linked lists, stacks, and queues from scratch.",
    tags: ["GATE", "placement", "fundamentals"],
    resourceUrl: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
    prerequisites: []
  },
  {
    id: "dsa_02",
    title: "Trees & Graphs Deep Dive",
    topic: "DSA",
    level: "intermediate",
    duration_hours: 15,
    description: "Master binary trees, BSTs, and graph traversals for technical interviews.",
    tags: ["FAANG", "interviews", "DSA"],
    resourceUrl: "https://www.youtube.com/watch?v=t0Cq6tVNRBA",
    prerequisites: ["dsa_01"]
  },
  {
    id: "dsa_03",
    title: "Advanced Data Structures",
    topic: "DSA",
    level: "advanced",
    duration_hours: 20,
    description: "Tries, segment trees, and disjoint sets for competitive programming.",
    tags: ["FAANG", "competitive_programming", "DSA"],
    resourceUrl: "https://www.youtube.com/watch?v=vOOceOA_tdE",
    prerequisites: ["dsa_02"]
  },
  {
    id: "dsa_04",
    title: "LeetCode Patterns: Array & String",
    topic: "DSA",
    level: "intermediate",
    duration_hours: 12,
    description: "Crack top FAANG array and string manipulation problems.",
    tags: ["FAANG", "placement", "leetcode"],
    resourceUrl: "https://neetcode.io/practice",
    prerequisites: ["dsa_01"]
  },
  {
    id: "dsa_05",
    title: "Heaps & Hash Maps Masterclass",
    topic: "DSA",
    level: "advanced",
    duration_hours: 14,
    description: "Optimal usage of priority queues and hash structures.",
    tags: ["FAANG", "placement"],
    resourceUrl: "https://www.youtube.com/watch?v=HqPJF2L5h9U",
    prerequisites: ["dsa_01"]
  },

  // Algorithms
  {
    id: "algo_01",
    title: "Algorithm Analysis & Big O",
    topic: "Algorithms",
    level: "beginner",
    duration_hours: 8,
    description: "Develop the intuition for time and space complexity.",
    tags: ["FAANG", "GATE", "fundamentals"],
    resourceUrl: "https://www.freecodecamp.org/news/big-o-cheat-sheet-time-complexity-chart/",
    prerequisites: []
  },
  {
    id: "algo_02",
    title: "Sorting and Searching Mastery",
    topic: "Algorithms",
    level: "intermediate",
    duration_hours: 12,
    description: "Deep dive into QuickSort, MergeSort, and Binary Search variants.",
    tags: ["placement", "GATE"],
    resourceUrl: "https://www.youtube.com/watch?v=kPRACWWA1_I",
    prerequisites: ["algo_01"]
  },
  {
    id: "algo_03",
    title: "Dynamic Programming patterns",
    topic: "Algorithms",
    level: "advanced",
    duration_hours: 25,
    description: "Solve complex problems using memoization and tabulation.",
    tags: ["FAANG", "competitive_programming"],
    resourceUrl: "https://www.youtube.com/watch?v=oBt53YbR9Kk",
    prerequisites: ["algo_01"]
  },
  {
    id: "algo_04",
    title: "Graph Algorithms Demystified",
    topic: "Algorithms",
    level: "advanced",
    duration_hours: 18,
    description: "Dijkstra, Bellman-Ford, and Floyd-Warshall for shortest paths.",
    tags: ["FAANG", "research"],
    resourceUrl: "https://www.youtube.com/watch?v=09_LlHjoEiY",
    prerequisites: ["dsa_02"]
  },
  {
    id: "algo_05",
    title: "Greedy Algorithms and Backtracking",
    topic: "Algorithms",
    level: "intermediate",
    duration_hours: 15,
    description: "Strategies for N-Queens, Sudoku, and optimal substructures.",
    tags: ["placement", "FAANG"],
    resourceUrl: "https://www.youtube.com/watch?v=ARvQcqJ_-NY",
    prerequisites: ["algo_01"]
  },

  // OS
  {
    id: "os_01",
    title: "Operating Systems Fundamentals",
    topic: "OS",
    level: "beginner",
    duration_hours: 12,
    description: "Introduction to OS concepts, kernels, and system calls.",
    tags: ["GATE", "fundamentals"],
    resourceUrl: "https://www.youtube.com/watch?v=vBURTt97EkA",
    prerequisites: []
  },
  {
    id: "os_02",
    title: "Process Synchronization & Deadlocks",
    topic: "OS",
    level: "intermediate",
    duration_hours: 15,
    description: "Mutexes, semaphores, and solving the Producer-Consumer problem.",
    tags: ["GATE", "FAANG", "research"],
    resourceUrl: "https://www.youtube.com/watch?v=UZA4vUBZV2Q",
    prerequisites: ["os_01"]
  },
  {
    id: "os_03",
    title: "Memory Management & Paging",
    topic: "OS",
    level: "advanced",
    duration_hours: 14,
    description: "Virtual memory, TLBs, and page replacement algorithms.",
    tags: ["GATE", "placement"],
    resourceUrl: "https://www.youtube.com/watch?v=qcBIcCSOslc",
    prerequisites: ["os_01"]
  },
  {
    id: "os_04",
    title: "File Systems & Storage",
    topic: "OS",
    level: "intermediate",
    duration_hours: 10,
    description: "Disk scheduling, inodes, and file system architectures.",
    tags: ["GATE", "fundamentals"],
    resourceUrl: "https://www.youtube.com/watch?v=n2AAhiBKMxk",
    prerequisites: ["os_01"]
  },
  {
    id: "os_05",
    title: "Linux Kernel Internals",
    topic: "OS",
    level: "advanced",
    duration_hours: 30,
    description: "Deep dive into Linux source code, namespaces, and cgroups.",
    tags: ["research", "FAANG"],
    resourceUrl: "https://linuxjourney.com/",
    prerequisites: ["os_02", "os_03"]
  },

  // DBMS
  {
    id: "dbms_01",
    title: "Relational Databases & SQL",
    topic: "DBMS",
    level: "beginner",
    duration_hours: 15,
    description: "Write queries, joins, and functions using standard SQL.",
    tags: ["placement", "webdev", "fundamentals"],
    resourceUrl: "https://www.youtube.com/watch?v=HXV3zeJZ1EQ",
    prerequisites: []
  },
  {
    id: "dbms_02",
    title: "Database Normalization & Design",
    topic: "DBMS",
    level: "intermediate",
    duration_hours: 12,
    description: "1NF to BCNF, ER modeling, and anomaly prevention.",
    tags: ["GATE", "placement", "webdev"],
    resourceUrl: "https://www.youtube.com/watch?v=GFQaEYEc8_8",
    prerequisites: ["dbms_01"]
  },
  {
    id: "dbms_03",
    title: "Transaction Management & Concurrency",
    topic: "DBMS",
    level: "advanced",
    duration_hours: 18,
    description: "ACID properties, serializability, and lock-based protocols.",
    tags: ["GATE", "FAANG", "research"],
    resourceUrl: "https://www.youtube.com/watch?v=85OepZ10m34",
    prerequisites: ["dbms_01"]
  },
  {
    id: "dbms_04",
    title: "Indexing & Query Optimization",
    topic: "DBMS",
    level: "advanced",
    duration_hours: 20,
    description: "B+ Trees, hashing, and execution plans for fast queries.",
    tags: ["FAANG", "research"],
    resourceUrl: "https://use-the-index-luke.com/",
    prerequisites: ["dbms_02"]
  },
  {
    id: "dbms_05",
    title: "NoSQL and Distributed Databases",
    topic: "DBMS",
    level: "intermediate",
    duration_hours: 14,
    description: "CAP theorem, MongoDB, Cassandra, and eventual consistency.",
    tags: ["webdev", "FAANG"],
    resourceUrl: "https://www.youtube.com/watch?v=0buKQHokLK8",
    prerequisites: ["dbms_01"]
  },

  // Math
  {
    id: "math_01",
    title: "Discrete Mathematics for CS",
    topic: "Math",
    level: "beginner",
    duration_hours: 20,
    description: "Logic, set theory, combinatorics, and proofs.",
    tags: ["GATE", "research", "fundamentals"],
    resourceUrl: "https://www.youtube.com/watch?v=tyDKR4FG3Yw",
    prerequisites: []
  },
  {
    id: "math_02",
    title: "Linear Algebra Fundamentals",
    topic: "Math",
    level: "intermediate",
    duration_hours: 25,
    description: "Vectors, matrices, eigenvectors, and transformations.",
    tags: ["research", "ML"],
    resourceUrl: "https://www.youtube.com/watch?v=fNk_zzaMoSs&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
    prerequisites: []
  },
  {
    id: "math_03",
    title: "Probability & Statistics",
    topic: "Math",
    level: "intermediate",
    duration_hours: 22,
    description: "Distributions, Bayes theorem, and statistical inference.",
    tags: ["GATE", "research", "ML"],
    resourceUrl: "https://www.youtube.com/watch?v=KzYVDENYxXY",
    prerequisites: []
  },
  {
    id: "math_04",
    title: "Calculus for Machine Learning",
    topic: "Math",
    level: "advanced",
    duration_hours: 18,
    description: "Derivatives, gradients, and optimization functions.",
    tags: ["research", "ML"],
    resourceUrl: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
    prerequisites: ["math_02"]
  },
  {
    id: "math_05",
    title: "Graph Theory Models",
    topic: "Math",
    level: "advanced",
    duration_hours: 15,
    description: "Coloring, planar graphs, and network flow mathematical models.",
    tags: ["GATE", "research"],
    resourceUrl: "https://www.youtube.com/watch?v=82zlRaRU_i0",
    prerequisites: ["math_01"]
  },

  // WebDev
  {
    id: "web_01",
    title: "HTML / CSS & Responsive Design",
    topic: "WebDev",
    level: "beginner",
    duration_hours: 10,
    description: "Build beautiful layouts with modern semantic HTML and CSS Grid/Flexbox.",
    tags: ["webdev", "placement", "fundamentals"],
    resourceUrl: "https://www.youtube.com/watch?v=G3e-cpL7ofc",
    prerequisites: []
  },
  {
    id: "web_02",
    title: "JavaScript Essentials",
    topic: "WebDev",
    level: "beginner",
    duration_hours: 15,
    description: "Master ES6+, closures, and asynchronous programming in JS.",
    tags: ["webdev", "placement", "fundamentals"],
    resourceUrl: "https://javascript.info/",
    prerequisites: ["web_01"]
  },
  {
    id: "web_03",
    title: "React.js Frontend Framework",
    topic: "WebDev",
    level: "intermediate",
    duration_hours: 20,
    description: "Components, hooks, routing, and state management in React.",
    tags: ["webdev", "placement", "FAANG"],
    resourceUrl: "https://react.dev/learn",
    prerequisites: ["web_02"]
  },
  {
    id: "web_04",
    title: "Backend Development with Node.js",
    topic: "WebDev",
    level: "intermediate",
    duration_hours: 18,
    description: "Build scalable APIs using Express and Node.js.",
    tags: ["webdev", "placement"],
    resourceUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE",
    prerequisites: ["web_02"]
  },
  {
    id: "web_05",
    title: "Fullstack App Architecture & Security",
    topic: "WebDev",
    level: "advanced",
    duration_hours: 25,
    description: "Deployments, CI/CD, OAuth, and securing standard web applications.",
    tags: ["webdev", "FAANG"],
    resourceUrl: "https://www.theodinproject.com/",
    prerequisites: ["web_03", "web_04"]
  }
];
