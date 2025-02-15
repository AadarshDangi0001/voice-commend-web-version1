document.addEventListener("DOMContentLoaded", function () {
    const previewButton = document.getElementById("preview-button");
  
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Your browser does not support speech recognition. Please use Chrome.");
      return;
    }
  
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    let currentLang = "en-IN"; // Default language
  
    let isListening = false;
  
    previewButton.addEventListener("click", function () {
      if (!isListening) {
        startListening();
      } else {
        stopListening();
      }
    });
  
    function startListening() {
      recognition.lang = currentLang;
      recognition.start();
      isListening = true;
      previewButton.textContent = "Stop";
      console.log("Voice recognition started... Language:", currentLang);
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
  
      // **Language Switching**
      if (transcript.includes("hindi")) {
        switchLanguage("hi-IN");
      } else if (transcript.includes("इंग्लिश")) { 

        switchLanguage("en-IN");
      }
  
      // **Scroll Commands (Both Languages)**
      if (currentLang === "en-IN") {
        if (transcript.includes("scroll down")) {
          window.scrollBy({ top: 500, behavior: "smooth" });
        } else if (transcript.includes("scroll up")) {
          window.scrollBy({ top: -500, behavior: "smooth" });
        } else if (transcript.includes("scroll bottom")) {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        } else if (transcript.includes("scroll top")) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else if (currentLang === "hi-IN") {
        if (transcript.includes("नीचे करो")) {
          window.scrollBy({ top: 500, behavior: "smooth" });
        } else if (transcript.includes("ऊपर करो")) {
          window.scrollBy({ top: -500, behavior: "smooth" });
        } else if (transcript.includes("पूरा नीचे करो")) {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        } else if (transcript.includes("पूरा ऊपर करो")) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
  
      // **Stop Command**
      if (transcript.includes("stop") || transcript.includes("बंद करो")) {
        stopListening();
      }
  
      // **Navigation Commands**
      if (currentLang === "en-IN") {
        if (transcript.includes("go to home")) {
          window.location.href = "index.html";
        } else if (transcript.includes("go to about")) {
          window.location.href = "about.html";
        } else if (transcript.includes("go to contact")) {
          window.location.href = "contact.html";
        }
      } else if (currentLang === "hi-IN") {
        if (transcript.includes("होम पेज खोलो")) {
          window.location.href = "index.html";
        } else if (transcript.includes("अबाउट पेज खोलो")) {
          window.location.href = "about.html";
        } else if (transcript.includes("कांटेक्ट पेज खोलो")) {
          window.location.href = "contact.html";
        }
      }
    };
  
    function switchLanguage(lang) {
      if (currentLang !== lang) {
        console.log("Switching language to:", lang);
        currentLang = lang;
        stopListening();
        startListening();
      }
    }
  
    recognition.onerror = function (event) {
      console.error("Speech recognition error", event);
    };
  
    recognition.onend = function () {
      if (isListening) {
        recognition.start();
      }
    };
  });
  
  
  
  
  
  