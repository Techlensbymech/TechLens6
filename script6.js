const predefinedObjects = {
  bottle: {
    name: "Bottle",
    function: "A container used to hold liquids.",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/88/Plastic_bottle.jpg",
    quiz: {
      question: "What material is most commonly used to make bottles?",
      options: ["Glass", "Plastic", "Metal", "Wood"],
      correct: "Plastic",
    },
  },
  keyboard: {
    name: "Keyboard",
    function: "An input device used to type text.",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/db/Computer_keyboard.jpg",
    quiz: {
      question: "Which key is typically used to capitalize letters?",
      options: ["Ctrl", "Shift", "Alt", "Tab"],
      correct: "Shift",
    },
  },
};

document.addEventListener("DOMContentLoaded", async () => {
  const videoElement = document.getElementById("camera");
  const scanButton = document.getElementById("scan-btn");
  const scanningEffect = document.getElementById("scanning-effect");
  const statusText = document.getElementById("status");
  const scannerSection = document.getElementById("scanner");
  const resultSection = document.getElementById("result");
  const quizSection = document.getElementById("quiz");
  const objectName = document.getElementById("object-name");
  const objectFunction = document.getElementById("object-function");
  const objectImage = document.getElementById("object-image");
  const quizButton = document.getElementById("quiz-btn");
  const restartButton = document.getElementById("restart-btn");
  const questionText = document.getElementById("question");
  const answersContainer = document.getElementById("answers");
  const quizFeedback = document.getElementById("quiz-feedback");

  const model = await cocoSsd.load();

  // Try to access camera
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoElement.srcObject = stream;
      videoElement.play();
      statusText.textContent = "Ready to scan...";
    } catch (error) {
      console.error("Error accessing camera:", error);
      statusText.textContent = "Camera access denied. Please allow camera access.";
      alert("Camera access is required to use this app.");
    }
  }

  // Start the camera on page load
  startCamera();

  scanButton.addEventListener("click", async () => {
    scanningEffect.style.display = "block";
    statusText.textContent = "Scanning...";

    setTimeout(async () => {
      const predictions = await model.detect(videoElement);
      scanningEffect.style.display = "none";

      if (predictions.length > 0) {
        const detectedObject = predictions[0].class.toLowerCase();

        if (predefinedObjects[detectedObject]) {
          const objectData = predefinedObjects[detectedObject];
          objectName.textContent = `Object Name: ${objectData.name}`;
          objectFunction.textContent = `Function: ${objectData.function}`;
          objectImage.src = objectData.image;

          scannerSection.hidden = true;
          resultSection.hidden = false;

          quizButton.onclick = () => showQuiz(objectData.quiz);
        } else {
          alert("Object not recognized!");
        }
      } else {
        alert("No object detected.");
      }

      statusText.textContent = "Ready to scan...";
    }, 2000);
  });

  function showQuiz(quiz) {
    resultSection.hidden = true;
    quizSection.hidden = false;
    questionText.textContent = quiz.question;
    answersContainer.innerHTML = "";

    quiz.options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.onclick = () => checkAnswer(option, quiz.correct);
      answersContainer.appendChild(button);
    });
  }

  function checkAnswer(selected, correct) {
    if (selected === correct) {
      quizFeedback.textContent = "🎉 Correct! Great job!";
      quizFeedback.style.color = "green";
    } else {
      quizFeedback.textContent = "❌ Wrong answer. Try again!";
      quizFeedback.style.color = "red";
    }
  }

  restartButton.addEventListener("click", () => {
    quizSection.hidden = true;
    scannerSection.hidden = false;
    statusText.textContent = "Ready to scan...";
  });
});
