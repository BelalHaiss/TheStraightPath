document.querySelector("#email").addEventListener("blur", validateEmail);
if (document.querySelector("#password")) {
  document
    .querySelector("#password")
    .addEventListener("blur", validatePassword);
}
document.querySelector("#username").addEventListener("blur", validateUsername);

const reSpaces = /^\S*$/;

function validateUsername(e) {
  const username = document.querySelector("#username");

  if (reSpaces.test(username.value)) {
    username.classList.remove("is-invalid", "invalidStyle");
    return true;
  } else {
    username.classList.add("is-invalid", "invalidStyle");
    return false;
  }
}

function validateEmail(e) {
  const email = document.querySelector("#email");
  const re = /^([a-zA-Z0-9_\-?\.?]){3,}@([a-zA-Z]){3,}\.([a-zA-Z]){2,5}$/;

  if (reSpaces.test(email.value) && re.test(email.value)) {
    email.classList.remove("is-invalid", "invalidStyle");
    return true;
  } else {
    email.classList.add("is-invalid", "invalidStyle");
    return false;
  }
}
if (document.querySelector("#password")) {
  function validatePassword() {
    const password = document.querySelector("#password");
    const re = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})(?=.*[!@#$%^&*])/;
    if (re.test(password.value) && reSpaces.test(password.value)) {
      password.classList.remove("is-invalid", "invalidStyle");
      return true;
    } else {
      password.classList.add("is-invalid", "invalidStyle");
      return false;
    }
  }
}
(function () {
  const forms = document.querySelectorAll(".needs-validation");

  for (let form of forms) {
    form.addEventListener(
      "submit",
      function (event) {
        if (
          !form.checkValidity() ||
          !validateEmail() ||
          !validateUsername() ||
          !validatePassword()
        ) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  }
})();
