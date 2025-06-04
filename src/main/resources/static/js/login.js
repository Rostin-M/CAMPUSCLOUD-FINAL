(() => {
  const emailInput = document.getElementById("username");
  const passInput = document.getElementById("password");
  const submitBtn = document.getElementById("submitBtn");
  const emailErr = document.getElementById("emailError");
  const passErr = document.getElementById("passwordError");
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@(soyudemedellin\.edu\.co|udemedellin\.edu\.co)$/;

  function showTooltip(element, message) {
    element.textContent = message;
    element.style.display = "block";
  }

  function hideTooltip(element) {
    element.style.display = "none";
  }

  function validateEmail() {
    const emailVal = emailInput.value.trim();

    if (emailVal === "") {
      hideTooltip(emailErr);
      return false;
    }

    if (!emailVal.includes("@")) {
      showTooltip(emailErr, "Falta el símbolo @.");
      return false;
    }

    const [localPart, domainPart] = emailVal.split("@");

    if (!domainPart) {
      showTooltip(emailErr, "Falta el dominio.");
      return false;
    }

    if (
      domainPart !== "soyudemedellin.edu.co" &&
      domainPart !== "udemedellin.edu.co"
    ) {
      showTooltip(
        emailErr,
        "El dominio debe ser @soyudemedellin.edu.co o @udemedellin.edu.co."
      );
      return false;
    }

    if (!emailRegex.test(emailVal)) {
      showTooltip(
        emailErr,
        "Formato incorrecto. Usa @soyudemedellin.edu.co o @udemedellin.edu.co."
      );
      return false;
    }

    hideTooltip(emailErr);
    return true;
  }

  function validatePassword() {
    const passVal = passInput.value;

    if (passVal === "") {
      hideTooltip(passErr);
      return false;
    }

    if (passVal.length < 6) {
      showTooltip(passErr, "Mínimo 6 caracteres.");
      return false;
    }

    hideTooltip(passErr);
    return true;
  }

  function validateForm() {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    submitBtn.disabled = !(isEmailValid && isPasswordValid);
  }

  emailInput.addEventListener("input", validateForm);
  passInput.addEventListener("input", validateForm);
  document.addEventListener("DOMContentLoaded", validateForm);
})();
