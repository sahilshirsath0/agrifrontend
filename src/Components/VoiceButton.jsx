
import React, { useState } from "react";

const VoiceButton = () => {
  const [isListening, setIsListening] = useState(false);

  const startVoiceRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US"; // Default language (can be changed dynamically)
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      console.log("Voice recognition started...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Recognized Command:", transcript);
      handleVoiceCommand(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log("Voice recognition ended.");
    };

    recognition.start();
  };

  const handleVoiceCommand = (command) => {
    const commands = {
      home: ["go to home","home","Main page","Go home", "मुख्यपृष्ठ", "होम", "होम जाओ","Home page"],
      cart: ["open cart", "open card", "खरेदी कार्ट", "कार्ट खोलो","cart","card","Open car","Cart open"],
      recommend: ["open recommend", "शिफारस", "सिफारिश", "सिफारिश पेज","Show recommend","get pesticide","get fertilzier","get pescticide and fertilizer"],
      camera: ["open camera", "कॅमेरा सुरू करा", "कैमरा खोलो","camera"],
      suggest: ["suggest recommendation", "शिफारस द्या", "सिफारिश करो","get recommendation","Show suggestions"],
      open_file: ["choose from file"],
      open_map: ["nearby shops", "आसपास की दुकानें", "जवळील दुकाने","map","open map"],
    };
  
    if (commands.home.some(cmd => command.includes(cmd))) {
      window.location.href = "/";
    } 
    if (commands.cart.some(cmd => command.includes(cmd))) {
      window.location.href = "/cart";
    } 
    if (commands.recommend.some(cmd => command.includes(cmd))) {
      window.location.href = "/recommend";
    } 
    if (commands.camera.some(cmd => command.includes(cmd))) {
      document.getElementById("camera-button")?.click();
    } 
    if (commands.suggest.some(cmd => command.includes(cmd))) {
      document.getElementById("recommend-button")?.click();
    } 
    if (commands.open_map.some(cmd => command.includes(cmd))) {
      window.location.href = "/map"; // Navigate to Maps page
    }
    if (commands.open_file.some(cmd => command.includes(cmd))) {
      const fileInput = document.getElementById("file-button");
      if (fileInput) {
        setTimeout(() => {
          fileInput.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
        }, 300); // Delay to mimic user interaction
      }
    }
  };
  
  return (
    <button onClick={startVoiceRecognition} className="voice-command-btn">
      🎙️ {isListening ? "Listening..." : "Voice Command"}
      <style>
        {`
          .voice-command-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #178c15;
            color: white;
            border: none;
            border-radius: 50px;
            padding: 15px 20px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            transition: background 0.3s ease-in-out;
          }

          .voice-command-btn:hover {
            background-color: #2eab3a;
          }
        `}
      </style>
    </button>
  );
};

export default VoiceButton;
