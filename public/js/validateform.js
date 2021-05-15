(function () {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");
  for (let form of forms) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  }
})();
