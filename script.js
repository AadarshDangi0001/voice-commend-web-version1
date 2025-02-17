document.addEventListener("DOMContentLoaded", function () {
  const previewButton = document.getElementById("preview-button");
  const soundButton = document.getElementById("sound");
  const langButton = document.getElementById("lang");

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
  let isSoundOn = false;
  let isSwitchingLanguage = false;

  soundButton.style.display = "none";
  langButton.style.display = "none"; // Initially hidden

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

  langButton.addEventListener("click", function () {
      switchLanguage(currentLang === "en-IN" ? "hi-IN" : "en-IN");
  });

  function toggleSound(state = null) {
    if (state !== null) {
        isSoundOn = state;
    } else {
        isSoundOn = !isSoundOn;
    }
    soundButton.innerHTML = isSoundOn 
        ? '<i class="ri-volume-up-line"></i>'
        : '<i class="ri-volume-mute-line"></i>';
  }

  function startListening() {
      recognition.lang = currentLang;
      recognition.start();
      isListening = true;
      previewButton.textContent = "Stop";
      soundButton.style.display = "inline-block";
      langButton.style.display = "inline-block"; // Show language button
      console.log("Voice recognition started... Language:", currentLang);
  }

  function stopListening() {
      recognition.stop();
      isListening = false;
      previewButton.textContent = "Preview";
      soundButton.style.display = "none";
      langButton.style.display = "none"; // Hide language button
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

      // Switch between Hindi and English via voice command
      if (transcript.includes("hindi") || transcript.includes("हिंदी")) {
          switchLanguage("hi-IN");
      } else if (transcript.includes("english") || transcript.includes("इंग्लिश")) {
          switchLanguage("en-IN");
      }

      // Control sound via voice command
      if (transcript.includes("sound on") || transcript.includes("आवाज़ चालू")) {
          toggleSound(true);
      } else if (transcript.includes("sound off") || transcript.includes("sound of") || transcript.includes("आवाज़ बंद")) {
          toggleSound(false);
      }

      // Stop listening when 'stop' or 'बंद करो' is said
      if (transcript.includes("stop") || transcript.includes("बंद करो")) {
          stopListening();
      }

      // Handling scrolling commands
      if (currentLang === "en-IN") {
          if (transcript.includes("scroll down")) {
              window.scrollBy({ top: 500, behavior: "smooth" });
              speak("Scrolling down");
          } else if (transcript.includes("scroll up")) {
              window.scrollBy({ top: -500, behavior: "smooth" });
              speak("Scrolling up");
          } else if (transcript.includes("scroll top")) {
              window.scrollTo({ top: 0, behavior: "smooth" });
              speak("Scrolling to top");
          } else if (transcript.includes("scroll bottom")) {
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
              speak("Scrolling to bottom");
          }
      } else if (currentLang === "hi-IN") {
          if (transcript.includes("नीचे करो")) {
              window.scrollBy({ top: 500, behavior: "smooth" });
              speak("niche ja raha hai");
          } else if (transcript.includes("ऊपर करो")) {
              window.scrollBy({ top: -500, behavior: "smooth" });
              speak("ooper ja raha hai");
          } else if (transcript.includes("पूरा ऊपर")) {
              window.scrollTo({ top: 0, behavior: "smooth" });
              speak("poora upar ja raha hai");
          } else if (transcript.includes("पूरा नीचे")) {
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
              speak("poora neeche ja raha hai");
          }
      }
  };

  function switchLanguage(lang) {
      if (currentLang !== lang && !isSwitchingLanguage) {
          console.log("Switching language to:", lang);
          isSwitchingLanguage = true;
          currentLang = lang;

          // Stop the recognition process first before switching the language
          recognition.stop();

          // Wait for the recognition to stop completely before restarting it
          setTimeout(() => {
              recognition.lang = currentLang;
              recognition.start(); // Start recognition with the new language
              langButton.textContent = currentLang === "en-IN" ? "English" : "Hindi"; // Update button text
              isSwitchingLanguage = false; // Reset the flag after starting recognition
          }, 500); // 500ms delay to prevent any issues with state
      }
  }

  recognition.onerror = function (event) {
      console.error("Speech recognition error", event);
  };

  recognition.onend = function () {
      if (isListening && !isSwitchingLanguage) {
          recognition.start();
      }
  };
});











  
  
  
  
  
  