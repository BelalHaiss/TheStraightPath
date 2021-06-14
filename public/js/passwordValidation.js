document
  .querySelector("#oldpassword")
  .addEventListener("blur", validateOldPassword);
document
  .querySelector("#newpassword")
  .addEventListener("blur", validateNewPassword);

const reSpaces = /^\S*$/;

function validateOldPassword() {
  const oldpassword = document.querySelector("#oldpassword");
  const re = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})(?=.*[!@#$%^&*])/;
  if (re.test(oldpassword.value) && reSpaces.test(oldpassword.value)) {
    oldpassword.classList.remove("is-invalid", "invalidStyle");
    return true;
  } else {
    oldpassword.classList.add("is-invalid", "invalidStyle");
    return false;
  }
}
function validateNewPassword() {
  const newpassword = document.querySelector("#newpassword");
  const re = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})(?=.*[!@#$%^&*])/;
  if (re.test(newpassword.value) && reSpaces.test(newpassword.value)) {
    newpassword.classList.remove("is-invalid", "invalidStyle");
    return true;
  } else {
    newpassword.classList.add("is-invalid", "invalidStyle");
    return false;
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
          !validateOldPassword() ||
          !validateNewPassword()
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
