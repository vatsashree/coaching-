

// listen for the file upload event
fileInput.addEventListener('change', function() {
  // get the selected file
  const file = this.files[0];

  // create a new FileReader object
  const reader = new FileReader();

  // set up the onload event handler to send the file to the server
  reader.onload = function() {
    const data = reader.result;
    // send the file to the server using an AJAX request
    // replace the URL with the server-side script that handles file storage
    fetch('/upload', {
      method: 'POST',
      body: data
    })
    .then(response => {
      // handle the response from the server
      console.log(response);
    })
    .catch(error => {
      // handle any errors that occur during the file upload process
      console.error(error);
    });
  };

  // read the selected file as a binary string
  reader.readAsBinaryString(file);
});


// listen for the file upload event
fileInput.addEventListener('change', function() {
  // get the selected file
  const file = this.files[0];

  // check the file size
  const fileSize = file.size;
  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (fileSize > maxSize) {
    // display an error message and return
    alert('File size is too large. Maximum size is 10 MB.');
    return;
  }

  // validate the file type
  const fileType = file.type;
  const allowedTypes = ['application/pdf'];
  if (!allowedTypes.includes(fileType)) {
    // display an error message and return
    alert('Invalid file type. Only PDF files are allowed.');
    return;
  }

  // create a new FileReader object
  const reader = new FileReader();

  // set up the onload event handler to send the file to the server
  reader.onload = function() {
    const data = reader.result;
    // send the file to the server using an AJAX request
    // replace the URL with the server-side script that handles file storage
    fetch('/upload', {
      method: 'POST',
      body: data
    })
    .then(response => {
      // handle the response from the server
      console.log(response);
    })
    .catch(error => {
      // handle any errors that occur during the file upload process
      console.error(error);
    });
  };

  // read the selected file as a binary string
  reader.readAsBinaryString(file);
});
// get the file input element
const fileInput = document.querySelector('#file-input');

// listen for the file upload event
fileInput.addEventListener('change', function() {
  // get the selected file
  const file = this.files[0];

  // check the file size
  const fileSize = file.size;
  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (fileSize > maxSize) {
    // display an error message and return
    alert('File size is too large. Maximum size is 10 MB.');
    return;
  }

  // validate the file type
  const fileType = file.type;
  const allowedTypes = ['application/pdf'];
  if (!allowedTypes.includes(fileType)) {
    // display an error message and return
    alert('Invalid file type. Only PDF files are allowed.');
    return;
  }

  // create a new FormData object
  const formData = new FormData();
  formData.append('file', file);

  // send the file to VirusTotal API for scanning
  fetch('https://www.virustotal.com/api/v3/files', {
    method: 'POST',
    headers: {
      'x-apikey': 'YOUR_API_KEY_HERE'
    },
    body: formData
  })
  .then(response => {
    // handle the response from VirusTotal API
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('VirusTotal API returned an error.');
    }
  })
  .then(data => {
    // check the scan results for viruses or malware
    const scanResults = data.data.attributes.last_analysis_results;
    const virusCount = Object.values(scanResults).filter(result => result.category === 'malicious').length;
    if (virusCount > 0) {
      // display an error message and return
      alert('The selected file contains viruses or malware.');
      return;
    }

    // create a new FileReader object
    const reader = new FileReader();

    // set up the onload event handler to send the file to the server
    reader.onload = function() {
      const data = reader.result;
      // send the file to the server using an AJAX request
      // replace the URL with the server-side script that handles file storage
      fetch('/upload', {
        method: 'POST',
        body: data
      })
      .then(response => {
        // handle the response from the server
        console.log(response);
      })
      .catch(error => {
        // handle any errors that occur during the file upload process
        console.error(error);
      });
    };

    // read the selected file as a binary string
    reader.readAsBinaryString(file);
  })
  .catch(error => {
    // handle any errors that occur during the virus scanning process
    console.error(error);
  });
});


// Select the chat box elements
const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatSendBtn = document.getElementById('chat-send-btn');
// Create a WebSocket connection to the server
const socket = new WebSocket('ws://localhost:8080/chat');

// When the WebSocket connection is open, send a message to the server
socket.addEventListener('open', (event) => {
  console.log('WebSocket connection established');
  socket.send('Hello server!');
});

// When the WebSocket connection receives a message, add it to the chat messages list
socket.addEventListener('message', (event) => {
  const message = event.data;
  const li = document.createElement('li');
  li.textContent = message;
  chatMessages.appendChild(li);
});

// When the chat form is submitted, send the input value to the server and clear the input field
chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = chatInput.value;
    socket.send(message);
    chatInput.value = '';
  });
  
  // Open the chat box when the chat icon is clicked
  document.getElementById('chat-icon').addEventListener('click', (event) => {
    event.preventDefault();
    chatBox.style.display = 'block';
  });
  
  // Close the chat box when the close button is clicked
  document.getElementById('chat-close-btn').addEventListener('click', (event) => {
    event.preventDefault();
    chatBox.style.display = 'none';
  });
  // Select the quiz form and list elements
const quizForm = document.getElementById('quiz-form');
const quizList = document.getElementById('quiz-list');

// Add a submit event listener to the quiz form
quizForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = event.target.elements.quizTitle.value;
  const description = event.target.elements.quizDescription.value;
  const file = event.target.elements.quizFile.files[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      // File size limit is 10 MB
      alert('File size exceeds 10 MB limit');
    } else if (!['application/pdf'].includes(file.type)) {
      // Only allow PDF files
      alert('Invalid file type. Only PDF files are allowed');
    } else {
      // Submit the quiz form
      const formData = new FormData();
      formData.append('quizTitle', title);
      formData.append('quizDescription', description);
      formData.append('quizFile', file);
      fetch('/quizzes', {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (response.ok) {
            alert('Quiz posted successfully');
            event.target.reset();
          } else {
            alert('Error posting quiz');
          }
        })
        .catch(error => {
          console.error('Error posting quiz', error);
          alert('Error posting quiz');
        });
    }
  } else {
    alert('No file selected');
  }
});

// Load the quiz list on page load
fetch('/quizzes')
  .then(response => response.json())
  .then(quizzes => {
    quizzes.forEach(quiz => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = quiz.fileUrl;
      link.textContent = quiz.title;
      li.appendChild(link);
      quizList.appendChild(li);
    });
  })
  .catch(error => {
    console.error('Error loading quizzes', error);
  });

  // Initialize the Zoom Video SDK
const ZoomMtg = require('@zoomus/websdk');

// Set up Zoom Video SDK credentials
ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.0/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

// Generate a random meeting ID for the video call
const meetingId = Math.floor(Math.random() * 1000000000);

// Create the Zoom meeting URL
const zoomMeetingUrl = `https://zoom.us/j/${meetingId}`;

// Initialize the Zoom meeting options
const zoomMeetingOptions = {
  apiKey: 'YOUR_API_KEY',
  meetingNumber: meetingId,
  userName: 'Admin',
  userEmail: 'admin@example.com',
  passWord: 'YOUR_MEETING_PASSWORD',
  leaveUrl: 'https://yourapp.com',
  role: 1 // 1 for host, 0 for participant
};

// Join the Zoom meeting as the host
ZoomMtg.init({
  leaveUrl: zoomMeetingOptions.leaveUrl,
  isSupportAV: true,
  success: function() {
    ZoomMtg.join({
      signature: '',
      meetingNumber: zoomMeetingOptions.meetingNumber,
      userName: zoomMeetingOptions.userName,
      apiKey: zoomMeetingOptions.apiKey,
      userEmail: zoomMeetingOptions.userEmail,
      passWord: zoomMeetingOptions.passWord,
      success: function(res) {
        console.log('Zoom meeting join success: ', res);
      },
      error: function(res) {
        console.log('Zoom meeting join error: ', res);
      }
    });
  },
  error: function(res) {
    console.log('Zoom meeting init error: ', res);
  }
});

//get elements
const loginForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.getElementById("login-btn");
const errorMsg = document.getElementById("error-msg");
const appContainer = document.getElementById("app-container");

//check if user is already logged in
if(localStorage.getItem("loggedIn") === "true"){
  appContainer.style.display = "block";
  loginForm.style.display = "none";
}else{
  appContainer.style.display = "none";
  loginForm.style.display = "block";
}

//add event listener to login button
loginBtn.addEventListener("click", e => {
  e.preventDefault();
  const email = loginEmail.value;
  const password = loginPassword.value;
  
  //perform authentication check here
  //if authentication is successful
  localStorage.setItem("loggedIn", "true");
  appContainer.style.display = "block";
  loginForm.style.display = "none";
  
  //if authentication fails
  errorMsg.innerText = "Invalid email or password.";
});

