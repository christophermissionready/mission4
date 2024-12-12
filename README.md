<h1>MissionReady Mission 4</h1> 
by Christopher Fomai Ryan

<h2>About the Project</h2>
<ul>
  <li>Create an AI chatbot that gathers information from a customer to recommend an insurance policy</li>
  <li>Create a front end that allows a customer to interact with the AI chatbot</li>
  <li>Dockerize the app</li>
</ul>

<h2>How To</h2>
<ol>
  <li>Make sure docker desktop is installed</li>
  <li>Git clone this repo, or download and unzip</li>
  <li>Create a .env file in the root directory</li>
  <li>In the .env file, paste this: </br>API_KEY="PUT_API_KEY_HERE"</br>
GEMINI_MODEL_NAME="gemini-1.5-flash"</li>
  <li>Where it says "PUT_API_KEY_HERE" replace it with your Google Gemini Api Key</li>
  <li>Open your command terminal in the root directory</li>
  <li>Execute the command:</br>docker-compose up --build</li>
  <li>Once done building, either click on the front-end link or go to http://localhost:5173/</li>
</ol>

<h2>How the Chatbot Should Work</h2>
<ol>
  <li>Should ask the user if you want to answer questions about insurance</li>
  <li>Should ask user relevant questions about their vehicle such as model, make, year and what kind of insurance you need</li>
  <li>Should prompt the user to press the "Get Recommendation" button once all information is recieved</li>
  <li>Once the recommendation is made it should filter out unavailable policies</li>
</ol>
