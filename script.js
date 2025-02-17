document.addEventListener("DOMContentLoaded", function () {
  const previewButton = document.getElementById("preview-button");
  const soundButton = document.getElementById("sound");

  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Your browser does not support speech recognition. Please use Chrome.");
      return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  let currentLang = "en-IN"; 
  let isListening = false;
  let isSoundOn = false;

  soundButton.style.display = "none";

  previewButton.addEventListener("click", function () {
      if (!isListening) {
          startListening();
      } else {
          stopListening();
      }
  });

  soundButton.addEventListener("click", function () {
      toggleSound();
  });

  function toggleSound(state = null) {
      if (state !== null) {
          isSoundOn = state;
      } else {
          isSoundOn = !isSoundOn;
      }
      soundButton.textContent = isSoundOn ? "Sound On" : "Sound Off";
      if (isSoundOn) speak("Sound On");
  }

  function startListening() {
      recognition.lang = currentLang;
      recognition.start();
      isListening = true;
      previewButton.textContent = "Stop";
      soundButton.style.display = "inline-block";
      console.log("Voice recognition started... Language:", currentLang);
  }

  function stopListening() {
      recognition.stop();
      isListening = false;
      previewButton.textContent = "Preview";
      soundButton.style.display = "none";
      console.log("Voice recognition stopped.");
  }

  function speak(text) {
      if (!isSoundOn) return;
      let utterance = new SpeechSynthesisUtterance(text);
      let voices = speechSynthesis.getVoices();
      
      if (currentLang === "hi-IN") {
          let hindiVoice = voices.find(voice => voice.lang === "hi-IN");
          if (hindiVoice) utterance.voice = hindiVoice;
      }

      utterance.lang = currentLang;
      speechSynthesis.speak(utterance);
  }

  speechSynthesis.onvoiceschanged = function () {
      console.log("Voices loaded:", speechSynthesis.getVoices().map(v => v.lang));
  };

  recognition.onresult = function (event) {
      let transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("You said:", transcript);

      if (transcript.includes("hindi")) {
          switchLanguage("hi-IN");
      } else if (transcript.includes("इंग्लिश")) { 
          switchLanguage("en-IN");
      }

      // FIXED: Handling variations like "sound of", "sound off", etc.
      if (transcript.includes("sound on")) {
          toggleSound(true);
      } else if (transcript.includes("sound off") || transcript.includes("sound of")) {
          toggleSound(false);
      } else if (transcript.includes("आवाज चालू")) {
          toggleSound(true);
      } else if (transcript.includes("आवाज बंद")) {
          toggleSound(false);
      }

      if (currentLang === "en-IN") {
          if (transcript.includes("scroll down")) {
              window.scrollBy({ top: 500, behavior: "smooth" });
              speak("Scrolling down");
          } else if (transcript.includes("scroll up")) {
              window.scrollBy({ top: -500, behavior: "smooth" });
              speak("Scrolling up");
          } else if (transcript.includes("scroll bottom")) {
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
              speak("Scrolling to bottom");
          } else if (transcript.includes("scroll top")) {
              window.scrollTo({ top: 0, behavior: "smooth" });
              speak("Scrolling to top");
          }
      } else if (currentLang === "hi-IN") {
          if (transcript.includes("नीचे करो")) {
              window.scrollBy({ top: 500, behavior: "smooth" });
              speak("नीचे जा रहा है");
          } else if (transcript.includes("ऊपर करो")) {
              window.scrollBy({ top: -500, behavior: "smooth" });
              speak("ऊपर जा रहा है");
          } else if (transcript.includes("पूरा नीचे")) {
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
              speak("नीचे जा रहा है");
          } else if (transcript.includes("पूरा ऊपर")) {
              window.scrollTo({ top: 0, behavior: "smooth" });
              speak("ऊपर जा रहा है");
          }
      }

      if (transcript.includes("stop") || transcript.includes("बंद करो")) {
          stopListening();
      }

      if (currentLang === "en-IN") {
          if (transcript.includes("go to home")) {
              speak("Navigating to Home");
              window.location.href = "index.html";
          } else if (transcript.includes("go to about")) {
              speak("Navigating to About");
              window.location.href = "about.html";
          } else if (transcript.includes("go to contact")) {
              speak("Navigating to Contact");
              window.location.href = "contact.html";
          }
      } else if (currentLang === "hi-IN") {
          if (transcript.includes("होम पेज खोलो")) {
              speak("होम पेज खोल रहा हूँ");
              window.location.href = "index.html";
          } else if (transcript.includes("अबाउट पेज खोलो")) {
              speak("अबाउट पेज खोल रहा हूँ");
              window.location.href = "about.html";
          } else if (transcript.includes("कांटेक्ट पेज खोलो")) {
              speak("कांटेक्ट पेज खोल रहा हूँ");
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






  
  
  
  
  
  