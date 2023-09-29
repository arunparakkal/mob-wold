 // JavaScript function to move focus to the next input
 function moveToNext(input, nextInputId) {
  if (input.value.length === input.maxLength) {
      document.getElementById(nextInputId).focus();
  }
}

var otpGenerationTime;
var otpTimeoutDuration = 20000; // Timeout duration in milliseconds (e.g., 2 minutes)
var otpExpired = false;

function generateOTP() {
  otpGenerationTime = Date.now();
  // Start the countdown for OTP expiration
  var countdownInterval = setInterval(function () {
      var currentTime = Date.now();
      var elapsedTime = currentTime - otpGenerationTime;
      var remainingTime = otpTimeoutDuration - elapsedTime;
      if (remainingTime <= 0) {
          clearInterval(countdownInterval);
          remainingTime = 0;
          otpExpired = true;
          var expirationMessage = "OTP has expired. Please request a new OTP.";
          document.getElementById("otpExpirationMessage").innerText = expirationMessage;
          // You can display the expiration message here or take any other action.
      }

      // Calculate remaining minutes and seconds
      var remainingMinutes = Math.floor(remainingTime / 60000);
      var remainingSeconds = Math.floor((remainingTime % 60000) / 1000);

      // Display the remaining time to the user
      document.getElementById("otpTimer").innerText = "Time left: " + remainingMinutes + " min " + remainingSeconds + " sec";
  }, 1000); // Update every second
}

function isOTPExpired() {
  return otpExpired;
}

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("myForm");
  generateOTP(); // Start OTP generation and expiration countdown
  form.addEventListener("submit", function (event) {
      event.preventDefault();
      console.log("entered");
      if (isOTPExpired()) {
          alert("OTP has expired. Please request a new OTP.");
          // You can add additional logic here, such as resending OTP or redirecting.
      } else {
          form.submit()
      }
  });
});
