document.querySelector("#email").addEventListener("blur", validateEmail);
document.querySelector("#password").addEventListener("blur", validatePassword);
function validateEmail(e) {
  const email = document.querySelector("#email");
  const re = /^([a-zA-Z0-9_\-?\.?]){3,}@([a-zA-Z]){3,}\.([a-zA-Z]){2,5}$/;

  if (re.test(email.value)) {
    email.classList.remove("is-invalid");
    return true;
  } else {
    email.classList.add("is-invalid");
    return false;
  }
}

function validatePassword() {
  const password = document.querySelector("#password");
  const re = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})(?=.*[!@#$%^&*])/;
  if (re.test(password.value)) {
    password.classList.remove("is-invalid");
    return true;
  } else {
    password.classList.add("is-invalid");
    return false;
  }
}
(function () {
  const forms = document.querySelectorAll(".needs-validation");

  for (let form of forms) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity() || !validateEmail() || !validatePassword()) {
          event.preventDefault();
          event.stopPropagation();
          document
            .querySelectorAll(
              ".form-control.is-valid.was-validated.form-control:valid"
            )
            .classList.add("is-invalid");
        }
        form.classList.add("was-validated");
      },
      false
    );
  }
})();
