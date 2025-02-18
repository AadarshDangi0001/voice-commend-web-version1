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
    let currentLang = "en-IN";
    let isListening = false;
    let isSoundOn = false;
    let isSwitchingLanguage = false;

    soundButton.style.display = "none";
    langButton.style.display = "none";

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
        langButton.style.display = "inline-block";
        console.log("Voice recognition started... Language:", currentLang);
    }

    function stopListening() {
        recognition.stop();
        isListening = false;
        previewButton.textContent = "Preview";
        soundButton.style.display = "none";
        langButton.style.display = "none";
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

        // Switch Language
        if (transcript.includes("hindi") || transcript.includes("हिंदी")) {
            switchLanguage("hi-IN");
        } else if (transcript.includes("english") || transcript.includes("इंग्लिश")) {
            switchLanguage("en-IN");
        }

        // Sound Control
        if (transcript.includes("sound on") || transcript.includes("आवाज़ चालू")) {
            toggleSound(true);
        } else if (transcript.includes("sound off") || transcript.includes("sound of") || transcript.includes("आवाज़ बंद")) {
            toggleSound(false);
        }

        // Stop Listening
        if (transcript.includes("stop") || transcript.includes("बंद करो")) {
            stopListening();
        }

        // Scrolling Commands
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

        // Page Navigation
        if (currentLang === "en-IN") {
            if (transcript.includes("go to about page") || transcript.includes("open about page")) {
                window.location.href = "about.html";
                speak("Opening About Page");
            } else if (transcript.includes("go to contact page") || transcript.includes("open contact page")) {
                window.location.href = "contact.html";
                speak("Opening Contact Page");
            } else if (transcript.includes("go to home page") || transcript.includes("open home page")) {
                window.location.href = "index.html";
                speak("Opening Home Page");
            }
        } else if (currentLang === "hi-IN") {
            if (transcript.includes("अबाउट पेज पर जाओ") || transcript.includes("अबाउट पेज खोलो")) {
                window.location.href = "/about";
                speak("अबाउट पेज खोल रहा हूँ");
            } else if (transcript.includes("कांटेक्ट पेज पर जाओ") || transcript.includes("कांटेक्ट पेज खोलो")) {
                window.location.href = "/contact";
                speak("कांटेक्ट पेज खोल रहा हूँ");
            } else if (transcript.includes("होम पेज पर जाओ") || transcript.includes("होम पेज खोलो")) {
                window.location.href = "/";
                speak("होम पेज खोल रहा हूँ");
            }
        }
    };

    function switchLanguage(lang) {
        if (currentLang !== lang && !isSwitchingLanguage) {
            console.log("Switching language to:", lang);
            isSwitchingLanguage = true;
            currentLang = lang;
            recognition.stop();

            setTimeout(() => {
                recognition.lang = currentLang;
                recognition.start();
                langButton.textContent = currentLang === "en-IN" ? "English" : "Hindi";
                isSwitchingLanguage = false;
            }, 500);
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












  
  
  
  
  
  