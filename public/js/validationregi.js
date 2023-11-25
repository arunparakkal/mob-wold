// console.log("pag loaded")
// document.addEventListener('DOMContentLoaded', function() {
//     var form = document.getElementById("myForm");
//     console.log("Form element found:", form);
  
//     var errorName = document.getElementById("errorName");
//     console.log("Error name element found:", errorName);
  
//     var errorMno = document.getElementById("errorMno"); // Add this line
//     console.log("Error mobile element found:", errorMno); // Add this line
  
//     var errorEmail = document.getElementById("errorEmail"); // Add this line for email error
//     console.log("Error email element found:", errorEmail); // Add this line
  
//     var errorPassword = document.getElementById("errorPassword"); // Fix the typo here
//     console.log("Error password element found:", errorPassword); // Fix the typo here
  
//     form.addEventListener("submit", function(event) {
      
//       var nameInput = document.getElementsByName("name")[0];
//       var emailInput = document.getElementsByName("email")[0];
//       var mobileInput = document.getElementsByName("mno")[0]; // Add [0] to access the first element
//       var passwordInput = document.getElementsByName("password")[0];
//       var CpasswordInput = document.getElementsByName("password")[0];
    
  
//       var name = nameInput.value;
//       var email = emailInput.value;
//       var mno = mobileInput.value;
//       var password = passwordInput.value;
//       var Cpassword = CpasswordInput.value;
  
//       var nameValid = name.length >= 4;
//       var emailValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
//       var mobileValid = mno.length >= 10 && /^[6789]\d{9}$/;
//       var passwordValid = password.length >= 4 && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
//       var CpasswordValid = Cpassword.length >= 4;
  
//       // Reset error display for each validation check
//       errorName.style.display = "none";
//       errorMno.style.display = "none";
//       errorEmail.style.display = "none"; // Add this line
//       errorPassword.style.display = "none"; // Fix the typo here
//       errorCPassword.style.display = "none"; //
  
//       // Validate name
//       if (!nameValid) {
//         errorName.style.display = "block";
//         event.preventDefault();
//       }
  
//       // Validate email
//       if (!emailValid) {
//         errorEmail.style.display = "block"; // Update this line
//         event.preventDefault();
//       }
  
//       // Validate mobile
//       if (!mobileValid) {
//         errorMno.style.display = "block";
//         event.preventDefault();
//       }
  
//       // Validate password
//       if (!passwordValid) {
//         errorPassword.style.display = "block"; // Fix the typo here
//         event.preventDefault();
//       }
//       // if (!CpasswordValid) {
//       //   errorCPassword.style.display = "block"; // Fix the typo here
//       //   event.preventDefault();
//       // }
//     });
//   });
  

    // document.addEventListener('DOMContentLoaded', function () {
    //     var form = document.getElementById("myForm");
    //     var errorName = document.getElementById("errorName");
    //     var errorMno = document.getElementById("errorMno");
    //     var errorEmail = document.getElementById("errorEmail");
    //     var errorPassword = document.getElementById("errorPassword");
    //     var errorCPassword = document.getElementById("errorCPassword");

    //     form.addEventListener("submit", function (event) {
    //         var nameInput = document.getElementsByName("name")[0];
    //         var emailInput = document.getElementsByName("email")[0];
    //         var mobileInput = document.getElementsByName("mno")[0];
    //         var passwordInput = document.getElementsByName("password")[0];
    //         var CpasswordInput = document.getElementsByName("Cpassword")[0];

    //         var name = nameInput.value;
    //         var email = emailInput.value;
    //         var mno = mobileInput.value;
    //         var password = passwordInput.value;
    //         var Cpassword = CpasswordInput.value;

    //         var nameValid = name.length >= 4;
    //         var emailValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
    //         var mobileValid = /^[6789]\d{9}$/.test(mno);
    //         var passwordValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(password);
    //         var CpasswordValid = password === Cpassword;

    //         // Reset error display for each validation check
    //         errorName.style.display = "none";
    //         errorMno.style.display = "none";
    //         errorEmail.style.display = "none";
    //         errorPassword.style.display = "none";
    //         errorCPassword.style.display = "none";

    //         // Validate name
    //         if (!nameValid) {
    //             errorName.style.display = "block";
    //             event.preventDefault();
    //         }

    //         // Validate email
    //         if (!emailValid) {
    //             errorEmail.style.display = "block";
    //             event.preventDefault();
    //         }

    //         // Validate mobile
    //         if (!mobileValid) {
    //             errorMno.style.display = "block";
    //             event.preventDefault();
    //         }

    //         // Validate password
    //         if (!passwordValid) {
    //             errorPassword.style.display = "block";
    //             event.preventDefault();
    //         }

    //         // Validate confirm password
    //         if (!CpasswordValid) {
    //             errorCPassword.style.display = "block";
    //             event.preventDefault();
    //         }
    //     });
    // });

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById("myForm");
        var errorName = document.getElementById("errorName");
        var errorMno = document.getElementById("errorMno");
        var errorEmail = document.getElementById("errorEmail");
        var errorPassword = document.getElementById("errorPassword");
        var errorCPassword = document.getElementById("errorCPassword");
    
        form.addEventListener("submit", function (event) {
            var nameInput = document.getElementsByName("name")[0];
            var emailInput = document.getElementsByName("email")[0];
            var mobileInput = document.getElementsByName("mno")[0];
            var passwordInput = document.getElementsByName("password")[0];
            var CpasswordInput = document.getElementsByName("Cpassword")[0];
    
            var name = nameInput.value.trim(); // Remove leading and trailing white spaces
            var email = emailInput.value.trim();
            var mno = mobileInput.value.trim(); // Remove leading and trailing white spaces
            var password = passwordInput.value.trim();
            var Cpassword = CpasswordInput.value.trim();
    
            var nameValid = name.length >= 4;
            var emailValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
            var mobileValid = /^[6789]\d{9}$/.test(mno);
            var passwordValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(password);
            var CpasswordValid = password === Cpassword;
    
            // Reset error display for each validation check
            errorName.style.display = "none";
            errorMno.style.display = "none";
            errorEmail.style.display = "none";
            errorPassword.style.display = "none";
            errorCPassword.style.display = "none";
    
            // Validate name
            if (!nameValid) {
                errorName.style.display = "block";
                errorName.innerText = "Please enter a valid name (at least 4 characters)";
                event.preventDefault();
            }
    
            // Validate email
            if (!emailValid) {
                errorEmail.style.display = "block";
                errorEmail.innerText = "Please enter a valid email address";
                event.preventDefault();
            }
    
            // Validate mobile
            if (!mobileValid) {
                errorMno.style.display = "block";
                errorMno.innerText = "Please enter a valid mobile number";
                event.preventDefault();
            }
    
            // Validate password
            if (!passwordValid) {
                errorPassword.style.display = "block";
                errorPassword.innerText = "Please enter a valid password (at least 6 characters, including one letter, one number, and one special character)";
                event.preventDefault();
            }
    
            // Validate confirm password
            if (!CpasswordValid) {
                errorCPassword.style.display = "block";
                errorCPassword.innerText = "Passwords do not match";
                event.preventDefault();
            }
        });
    });
    