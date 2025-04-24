let isListening = false;
let hasPermission = false; 
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Set recognition properties
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

// Check if speech recognition is available
if (!SpeechRecognition) {
    alert('Your browser does not support Speech Recognition');
}

// Start listening when the mic button is clicked
function startListening() {
    if (hasPermission) {
        toggleRecognition();
    } else {
        requestMicrophonePermission();
    }
}

// Request microphone permission and start listening
function requestMicrophonePermission() {
    recognition.start();

    // When permission is granted
    recognition.onstart = function() {
        hasPermission = true;
        document.getElementById("micButton").textContent = "🛑 Stop Listening";
        console.log("Microphone permission granted.");
    };

    recognition.onerror = function(event) {
        if (event.error === 'not-allowed') {
            alert("Microphone permission denied.");
        }
    };
}


// Try requesting microphone permission on page load
document.addEventListener('DOMContentLoaded', () => {
    try {
        recognition.start(); // Trigger permission request
        recognition.abort(); // Immediately stop so it doesn't start listening
        console.log("Microphone permission check triggered.");
    } catch (e) {
        console.warn("Permission check failed or blocked:", e);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('questionInput');
    const sendBtn = document.querySelector('.send-btn');

    // Remove default button styles
    sendBtn.style.border = 'none';
    sendBtn.style.background = 'transparent';
    sendBtn.style.outline = 'none';

    // Event listener for clicking the arrow send button
    sendBtn.addEventListener('click', () => {
        handleSend();
    });

    // Optional: Pressing Enter also sends the message
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    });

    function handleSend() {
        const userQuestion = input.value.trim();

        if (userQuestion === "") return;

        // Display user question (example action)
        console.log("User asked:", userQuestion);

        addMessage(userQuestion, 'user');
        const reply = getBotReply(userQuestion);
        setTimeout(() => addMessage(reply, 'bot'), 500);

        // Clear the input field
        input.value = "";
    }
});

// Toggle speech recognition (start/stop listening)
function toggleRecognition() {
    if (isListening) {
        recognition.stop();
        isListening = false;
        document.getElementById("micButton").textContent = "🎤 Start Speaking";
    } else {
        recognition.start();
        isListening = true;
        document.getElementById("micButton").textContent = "🛑 Stop Listening";
    }
}

// When speech is recognized
recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    document.getElementById("questionInput").value = transcript;
    handleQuestion(); // Process the recognized speech as a question
};

recognition.onerror = function(event) {
    console.error("Speech recognition error", event.error);
};

function handleQuestion() {
    const input = document.getElementById("questionInput").value.trim().toLowerCase();
    if (!input) return;

    addMessage(input, 'user');
    const reply = getBotReply(input);
    setTimeout(() => addMessage(reply, 'bot'), 500);
    document.getElementById("questionInput").value = '';
}

function addMessage(text, type) {
    const chatBox = document.getElementById("chatBox");
    const msg = document.createElement("div");
    msg.className = `message ${type}`;
    msg.innerHTML = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotReply(input) {
    const responses = {
        "what is html": `HTML (HyperText Markup Language) is used to create the structure of a webpage.
        Example:
        <pre>&lt;html&gt;
  &lt;head&gt;&lt;title&gt;My Web Page&lt;/title&gt;&lt;/head&gt;
  &lt;body&gt;&lt;h1&gt;Welcome to My Webpage!&lt;/h1&gt;&lt;/body&gt;
&lt;/html&gt;</pre>`,

        "what is div tag": `The <div> tag is used to group content for styling or scripting purposes.
        Example:
        <pre>&lt;div class="container"&gt;
  &lt;h2&gt;This is a div container&lt;/h2&gt;
&lt;/div&gt;</pre>`,

        "what is a tag": `The <a> tag is used to create hyperlinks.
        Example:
        <pre>&lt;a href="https://www.example.com"&gt;Click here&lt;/a&gt;</pre>`,

        "what is css": `CSS (Cascading Style Sheets) is used to style the appearance of a webpage.
        Example:
        <pre>body {
  background-color: lightblue;
}</pre>`,

        "what is class in css": `A class is used to define a group of elements with similar styles in CSS.
        Example:
        <pre>.button {
  background-color: blue;
  color: white;
}</pre>`,

        "what is id in css": `An ID is used to style a specific element uniquely.
        Example:
        <pre>#header {
  font-size: 24px;
  color: black;
}</pre>`,

        "what is javascript": `JavaScript is a programming language used to create dynamic and interactive web pages.
        Example:
        <pre>console.log('Hello, World!');</pre>`,

        "what is variable in javascript": `A variable in JavaScript is used to store data values.
        Example:
        <pre>let x = 5;</pre>`,

        "what is a function in javascript": `A function is a block of code designed to perform a specific task.
        Example:
        <pre>function greet() {
  console.log('Hello, World!');
}</pre>`,

        "what is react": `React is a JavaScript library for building user interfaces.
        Example:
        <pre>import React from 'react';

function App() {
  return <h1>Hello, World!</h1>;
}

export default App;</pre>`,

        "what is jsx": `JSX is a syntax extension for JavaScript that allows HTML to be written inside JavaScript code.
        Example:
        <pre>const element = <h1>Hello, World!</h1>;</pre>`,

        "what are props in react": `Props are inputs to React components that allow data to be passed from one component to another.
        Example:
        <pre>function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}</pre>`,

        "what is python": `Python is a high-level programming language used for web development, data analysis, and more.
        Example:
        <pre>print('Hello, World!')</pre>`,

        "what is list in python": `A list in Python is an ordered collection of items.
        Example:
        <pre>my_list = [1, 2, 3]</pre>`,

        "what is a function in python": `A function in Python is a block of code that only runs when it is called.
        Example:
        <pre>def greet():
  print('Hello, World!')</pre>`
    };

    return responses[input] || "Sorry, I didn't understand that.";
}