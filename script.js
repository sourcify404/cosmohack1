// Timer for the hackathon countdown
const countdownDate = new Date("February 21, 2025 00:00:00").getTime();

const timerElement = document.getElementById('timer');

// Update the countdown every 1 second
const interval = setInterval(() => {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  // Time calculations for days, hours, minutes, and seconds
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result
  timerElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

  // If the countdown ends, display a message
  if (distance < 0) {
    clearInterval(interval);
    timerElement.innerHTML = "The Hackathon has started!";
  }
}, 1000);
