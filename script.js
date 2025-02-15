document.addEventListener("DOMContentLoaded", function () {
    const previewButton = document.getElementById("preview-button");
  
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Your browser does not support speech recognition. Please use Chrome.");
      return;
    }
  
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
  
    let isListening = false;
  
    previewButton.addEventListener("click", function () {
      if (!isListening) {
        startListening();
      } else {
        stopListening();
      }
    });
  
    function startListening() {
      recognition.start();
      isListening = true;
      previewButton.textContent = "Stop";
      console.log("Voice recognition started...");
    }
  
    function stopListening() {
      recognition.stop();
      isListening = false;
      previewButton.textContent = "Preview";
      console.log("Voice recognition stopped.");
    }
  
    recognition.onresult = function (event) {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("You said:", transcript);
  
      if (transcript.includes("scroll down")) {
        window.scrollBy({ top: 500, behavior: "smooth" });
      } else if (transcript.includes("scroll up")) {
        window.scrollBy({ top: -500, behavior: "smooth" });
      } else if (transcript.includes("scroll bottom")) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      } else if (transcript.includes("scroll top")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (transcript.includes("stop")) {
        stopListening();
      }
    };
  
    recognition.onerror = function (event) {
      console.error("Speech recognition error", event);
    };
  
    recognition.onend = function () {
      if (isListening) {
        recognition.start(); // Restart recognition if it stops unexpectedly
      }
    };
  });
  
  