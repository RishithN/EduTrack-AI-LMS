import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const chatWithAI = async (req: Request, res: Response) => {
    try {
        const { message, history } = req.body;

        // Smart Mock Response Logic for Demo
        const lowerMsg = message.toLowerCase();

        // 1. EXTENDED KNOWLEDGE BASE (50+ Questions)
        const KNOWLEDGE_BASE: Record<string, string> = {
            // --- HTML/CSS ---
            "html": "**HTML (HyperText Markup Language)** is the standard markup language for documents designed to be displayed in a web browser. It defines the structure of web content.",
            "css": "**CSS (Cascading Style Sheets)** is used for describing the presentation of a document written in HTML. It controls layout, colors, and fonts.",
            "box model": "The **CSS Box Model** wraps every HTML element. It consists of: Content, Padding, Border, and Margin.",
            "flexbox": "**Flexbox** is a CSS layout model designed for one-dimensional layouts. It provides an efficient way to align and distribute space among items in a container.",
            "grid": "**CSS Grid** is a two-dimensional layout system for the web. It lets you lay out items in rows and columns.",
            "semantic html": "**Semantic HTML** uses tags that convey meaning (like `<header>`, `<article>`, `<footer>`) rather than just `<div>`s, improving accessibility and SEO.",

            // --- JavaScript ---
            "javascript": "**JavaScript** is a high-level, interpreted programming language that adds interactivity to websites.",
            "closure": "A **Closure** is a function that remembers its outer variables and can access them even when the outer function has finished executing.",
            "hoisting": "**Hoisting** is JavaScript's default behavior of moving declarations to the top of the current scope.",
            "promise": "A **Promise** is an object representing the eventual completion (or failure) of an asynchronous operation.",
            "async await": "**Async/Await** is syntactic sugar for working with Promises, making asynchronous code look and behave more like synchronous code.",
            "event loop": "The **Event Loop** is the mechanism that allows JavaScript to perform non-blocking I/O operations by offloading operations to the system kernel whenever possible.",
            "callback": "A **Callback** is a function passed into another function as an argument, which is then invoked inside the outer function to complete some kind of routine or action.",
            "es6": "**ES6 (ECMAScript 2015)** introduced major features like classes, modules, arrow functions, promises, and template literals.",

            // --- React ---
            "react": "**React** is a JS library for building UIs. It uses a virtual DOM and component-based architecture.",
            "component": "A **Component** is a reusable piece of UI. It can be a Class component or a Functional component.",
            "state": "**State** is a built-in object that a component can use to store data that changes over time.",
            "props": "**Props** (properties) are read-only inputs passed from a parent component to a child component.",
            "hooks": "**Hooks** (introduced in React 16.8) let you use state and other React features without writing a class (e.g., `useState`, `useEffect`).",
            "redux": "**Redux** is a predictable state container for JS apps, often used with React to manage global state.",
            "virtual dom": "The **Virtual DOM** is a lightweight copy of the actual DOM. React uses it to verify what parts of the UI need to create specific updates.",

            // --- Node/Backend ---
            "node": "**Node.js** is a JS runtime built on Chrome's V8 engine. It allows you to run JS on the server.",
            "express": "**Express.js** is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
            "api": "**API (Application Programming Interface)** is a set of rules that allows different software entities to communicate with each other.",
            "rest": "**REST (Representational State Transfer)** is an architectural style for designing networked applications using standard HTTP methods.",
            "middleware": "**Middleware** functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle.",
            "jwt": "**JWT (JSON Web Token)** is a compact way of securely transmitting information between parties as a JSON object, often used for authentication.",

            // --- Databases ---
            "sql": "**SQL (Structured Query Language)** is used to communicate with a database. It is the standard language for relational database management systems.",
            "nosql": "**NoSQL** databases document-oriented, key-value pairs, wide-column stores, or graph databases. They are flexible and scalable (e.g., MongoDB).",
            "mongodb": "**MongoDB** is a popular NoSQL database that stores data in flexible, JSON-like documents.",
            "primary key": "A **Primary Key** is a unique identifier for a record in a database table.",
            "foreign key": "A **Foreign Key** is a field (or collection of fields) in one table, that refers to the PRIMARY KEY in another table.",

            // --- Data Structures ---
            "stack": "A **Stack** is a LIFO (Last In First Out) data structure. Operations: Push, Pop, Peek.",
            "queue": "A **Queue** is a FIFO (First In First Out) data structure. Operations: Enqueue, Dequeue.",
            "array": "An **Array** is a collection of items stored at contiguous memory locations.",
            "linked list": "A **Linked List** is a linear data structure where elements are not stored at contiguous memory locations.",
            "tree": "A **Tree** is a non-linear hierarchical data structure consisting of nodes connected by edges.",
            "graph": "A **Graph** is a non-linear data structure consisting of nodes and edges. It is used to represent networks.",
            "hash table": "A **Hash Table** stores data in an associative manner. In a hash table, data is stored in an array format, where each data value has its own unique index value.",

            // --- Algorithms ---
            "sorting algorithm": "Common **Sorting Algorithms** include Bubble Sort, Merge Sort, Quick Sort, and Heap Sort.",
            "binary search": "**Binary Search** is an efficient algorithm for finding an item from a sorted list of items. Time Complexity: O(log n).",
            "recursion": "**Recursion** is a method where the solution to a problem depends on solutions to smaller instances of the same problem.",
            "big o": "**Big O Notation** describes the performance or complexity of an algorithm.",

            // --- Career/General ---
            "resume": "A **Resume** should be concise (1 page), action-oriented, and tailored to the job description. Highlight skills and quantifiable achievements.",
            "interview": "For technical **Interviews**, practice coding problems (LeetCode), study system design, and prepare behavioral answers (STAR method).",
            "salary": "Entry-level Full Stack salaries in India typically range from **₹6L to ₹12L** depending on the company and location.",
            "freelancing": "**Freelancing** allows you to work independently. Platforms like Upwork and Fiverr are good starting points.",
            "github": "**GitHub** is a platform for version control and collaboration. It lets you and others work together on projects from anywhere.",
            "version control": "**Version Control** systems records changes to a file or set of files over time so that you can recall specific versions later (e.g., Git).",
            "agile": "**Agile** is an iterative approach to project management and software development that helps teams deliver value to their customers faster.",
            "scrum": "**Scrum** is a framework within which people can address complex adaptive problems, while productively and creatively delivering products of the highest possible value."
        };

        let responseText = "";

        // Check Knowledge Base first
        for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
            if (lowerMsg.includes(key)) {
                responseText = value;
                break;
            }
        }

        // Fallback checks if no exact keyword match
        if (!responseText) {
            if (lowerMsg.includes('job') || lowerMsg.includes('career')) {
                responseText = "I can analyze your profile to suggest the best career paths! Based on your current progress, you are well-suited for **Full Stack Development**. \n\nThe market for developers is strong, with entry-level salaries often starting around **₹6L-₹12L**.";
            } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
                responseText = "Hello there! I'm your AI Study Buddy. I can help you with:\n1. Explaining complex topics (e.g., 'Explain Linked Lists')\n2. Summarizing notes\n3. Quizzing you on your subjects\n\nTry asking me: \"What is React?\" or \"Explain Closure\"!";
            } else {
                responseText = "That's an interesting topic! As an AI Study Buddy, I can help you research \"" + message + "\". \n\nIn a full implementation, I would search your course materials to provide a specific answer. For now, try asking me about **Stacks, Queues, HTML, React, or System Design**!";
            }
        }

        if (!process.env.GEMINI_API_KEY) {
            console.log(`Responding with Smart Mock for: "${message}"`);
            // Simulate network delay for realism
            setTimeout(() => {
                res.json({ text: responseText });
            }, 1500);
            return;
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        // ... (Real API call would go here if key existed) ...
        // For safety in this demo environment, we return the smart mock even if code falls through
        res.json({ text: responseText });

    } catch (error) {
        console.error('AI Chat Error:', error);
        res.json({ text: "I encountered a connection error, but I'm back now! Try asking me about **Data Structures** or **Web Development**." });
    }
};
