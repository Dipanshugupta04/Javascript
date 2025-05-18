{/* <script>
let secondsLeft = 300; // 5 minutes
const timerEl = document.getElementById("timer");

function startTimer() {
  const interval = setInterval(() => {
    let min = Math.floor(secondsLeft / 60);
    let sec = secondsLeft % 60;
    timerEl.innerText = `Time Left: ${min}:${sec < 10 ? '0' : ''}${sec}`;
    secondsLeft--;

    if (secondsLeft < 0) {
      clearInterval(interval);
      submitQuiz(); // Auto-submit
    }
  }, 1000);
}

window.onload = startTimer;
</script>



<script>
function submitQuiz() {
  const form = document.getElementById("quizForm");
  const formData = new FormData(form);

  const answers = [];
  for (let [name, value] of formData.entries()) {
    if (name.startsWith("question_")) {
      const questionId = parseInt(name.split("_")[1]);
      const optionId = parseInt(value);
      answers.push({ questionId, selectedOptionId: optionId });
    }
  }

  const payload = {
    roomCode: "ABC123",
    userEmail: "test@example.com",
    answers: answers
  };

  fetch("/api/quiz/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    alert(`Score: ${data.score}/${data.total} - ${data.percentage}%`);
  })
  .catch(err => console.error("Submit failed", err));
}
</script> */}
