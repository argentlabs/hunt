/*
 * Countdown timer
 */

// Set the date we're counting down to
let countDownDate = new Date("Jul 4, 2019 15:37:25").getTime();

// Update the count down every 1 second
let x = setInterval(function() {

  // Get today's date and time
  let now = new Date().getTime();

  // Find the distance between now and the count down date
  let distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);


  // Display the result in the element with id="demo"
  document.getElementById("daysValue").innerHTML = days + "";
  document.getElementById("hoursValue").innerHTML = hours + "";
  document.getElementById("minutesValue").innerHTML = minutes + "";

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "<h1>GAME IN PROGRESS!</h1>";
  }
}, 1000);
