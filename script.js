/*
  AuthPortal JavaScript
  - Form validation
  - Password show/hide
  - Password match check
  - AJAX username availability check
  - Success and status messages
*/

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initializePasswordToggles();
  initializeLoginForm();
  initializeRegisterForm();
});

function initializePasswordToggles() {
  const toggleButtons = document.querySelectorAll("[data-toggle-password]");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-toggle-password");
      const input = document.getElementById(targetId);
      const icon = button.querySelector("i");

      if (!input || !icon) {
        return;
      }

      const isVisible = input.type === "text";
      input.type = isVisible ? "password" : "text";
      icon.classList.toggle("fa-eye", isVisible);
      icon.classList.toggle("fa-eye-slash", !isVisible);
      button.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
    });
  });
}

function initializeLoginForm() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) {
    return;
  }

  const emailField = document.getElementById("loginEmail");
  const passwordField = document.getElementById("loginPassword");

  addLiveValidation(emailField, () => validateEmailField(emailField, "loginEmailError"));
  addLiveValidation(passwordField, () => validatePasswordField(passwordField, "loginPasswordError"));

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isEmailValid = validateEmailField(emailField, "loginEmailError");
    const isPasswordValid = validatePasswordField(passwordField, "loginPasswordError");

    if (!isEmailValid || !isPasswordValid) {
      showAlert("loginSuccess", "", false);
      focusFirstInvalidField(loginForm);
      return;
    }

    showAlert("loginSuccess", "Login successful! Validation completed.");
    loginForm.reset();
    clearValidationState(loginForm);
  });
}

function initializeRegisterForm() {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) {
    return;
  }

  const fields = {
    fullName: document.getElementById("fullName"),
    username: document.getElementById("username"),
    email: document.getElementById("registerEmail"),
    mobile: document.getElementById("mobileNumber"),
    password: document.getElementById("registerPassword"),
    confirmPassword: document.getElementById("confirmPassword")
  };

  const usernameStatus = document.getElementById("usernameStatus");
  let usernameAvailable = false;
  let usernameRequestTimer;

  fields.mobile.addEventListener("input", () => {
    fields.mobile.value = fields.mobile.value.replace(/\D/g, "").slice(0, 10);
  });

  addLiveValidation(fields.fullName, () => validateFullNameField(fields.fullName, "fullNameError"));
  addLiveValidation(fields.username, () => {
    const isUsernameValid = validateUsernameField(fields.username, "usernameError");

    usernameAvailable = false;
    setAvailabilityMessage(usernameStatus, "", "");

    window.clearTimeout(usernameRequestTimer);

    if (isUsernameValid) {
      usernameRequestTimer = window.setTimeout(() => {
        checkUsernameAvailability(fields.username.value.trim(), usernameStatus)
          .then((isAvailable) => {
            usernameAvailable = isAvailable;
          });
      }, 350);
    }

    return isUsernameValid;
  });
  addLiveValidation(fields.email, () => validateEmailField(fields.email, "registerEmailError"));
  addLiveValidation(fields.mobile, () => validateMobileField(fields.mobile, "mobileNumberError"));
  addLiveValidation(fields.password, () => {
    const isPasswordValid = validatePasswordField(fields.password, "registerPasswordError");

    if (fields.confirmPassword.value.trim() !== "") {
      validateConfirmPassword(fields.password, fields.confirmPassword, "confirmPasswordError");
    }

    return isPasswordValid;
  });
  addLiveValidation(fields.confirmPassword, () => validateConfirmPassword(fields.password, fields.confirmPassword, "confirmPasswordError"));

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isNameValid = validateFullNameField(fields.fullName, "fullNameError");
    const isUsernameValid = validateUsernameField(fields.username, "usernameError");
    const isEmailValid = validateEmailField(fields.email, "registerEmailError");
    const isMobileValid = validateMobileField(fields.mobile, "mobileNumberError");
    const isPasswordValid = validatePasswordField(fields.password, "registerPasswordError");
    const isConfirmPasswordValid = validateConfirmPassword(fields.password, fields.confirmPassword, "confirmPasswordError");

    if (!isNameValid || !isUsernameValid || !isEmailValid || !isMobileValid || !isPasswordValid || !isConfirmPasswordValid) {
      showAlert("registerSuccess", "", false);
      focusFirstInvalidField(registerForm);
      return;
    }

    usernameAvailable = await checkUsernameAvailability(fields.username.value.trim(), usernameStatus);
    if (!usernameAvailable) {
      setFieldState(fields.username, "usernameError", false, "Please choose an available username.");
      focusFirstInvalidField(registerForm);
      return;
    }

    showAlert("registerSuccess", "Registration successful! Your account details are validated.");
    registerForm.reset();
    clearValidationState(registerForm);
    setAvailabilityMessage(usernameStatus, "", "");
  });
}

function addLiveValidation(input, callback) {
  if (!input) {
    return;
  }

  input.addEventListener("input", callback);
  input.addEventListener("blur", callback);
}

function validateFullNameField(input, errorId) {
  const value = input.value.trim();

  if (value.length === 0) {
    setFieldState(input, errorId, false, "Full name is required.");
    return false;
  }

  if (value.length < 2) {
    setFieldState(input, errorId, false, "Please enter at least 2 characters.");
    return false;
  }

  if (/\d/.test(value)) {
    setFieldState(input, errorId, false, "Full name should not contain numbers.");
    return false;
  }

  setFieldState(input, errorId, true, "");
  return true;
}

function validateUsernameField(input, errorId) {
  const value = input.value.trim();
  const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;

  if (value.length === 0) {
    setFieldState(input, errorId, false, "Username is required.");
    return false;
  }

  if (!usernamePattern.test(value)) {
    setFieldState(input, errorId, false, "Use 3-20 letters, numbers, or underscores only.");
    return false;
  }

  setFieldState(input, errorId, true, "");
  return true;
}

function validateEmailField(input, errorId) {
  const value = input.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (value.length === 0) {
    setFieldState(input, errorId, false, "Email address is required.");
    return false;
  }

  if (!emailPattern.test(value)) {
    setFieldState(input, errorId, false, "Please enter a valid email address.");
    return false;
  }

  setFieldState(input, errorId, true, "");
  return true;
}

function validateMobileField(input, errorId) {
  const value = input.value.trim();
  const mobilePattern = /^\d{10}$/;

  if (value.length === 0) {
    setFieldState(input, errorId, false, "Mobile number is required.");
    return false;
  }

  if (!mobilePattern.test(value)) {
    setFieldState(input, errorId, false, "Please enter a valid 10-digit mobile number.");
    return false;
  }

  setFieldState(input, errorId, true, "");
  return true;
}

function validatePasswordField(input, errorId) {
  const value = input.value;

  if (value.trim().length === 0) {
    setFieldState(input, errorId, false, "Password is required.");
    return false;
  }

  if (value.length < 6) {
    setFieldState(input, errorId, false, "Password must be at least 6 characters long.");
    return false;
  }

  setFieldState(input, errorId, true, "");
  return true;
}

function validateConfirmPassword(passwordInput, confirmPasswordInput, errorId) {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (confirmPassword.trim().length === 0) {
    setFieldState(confirmPasswordInput, errorId, false, "Please confirm your password.");
    return false;
  }

  if (password !== confirmPassword) {
    setFieldState(confirmPasswordInput, errorId, false, "Password and Confirm Password must match.");
    return false;
  }

  setFieldState(confirmPasswordInput, errorId, true, "");
  return true;
}

async function checkUsernameAvailability(username, statusElement) {
  if (!statusElement) {
    return false;
  }

  setAvailabilityMessage(statusElement, "Checking username availability...", "checking");

  try {
    const response = await fetch(`check_user.php?username=${encodeURIComponent(username)}`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest"
      }
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();
    const stateClass = data.available ? "available" : "unavailable";
    setAvailabilityMessage(statusElement, data.message, stateClass);
    return Boolean(data.available);
  } catch (error) {
    setAvailabilityMessage(statusElement, "Username check unavailable. Run the project with PHP to enable this feature.", "unavailable");
    return false;
  }
}

function setFieldState(input, errorId, isValid, message) {
  const errorElement = document.getElementById(errorId);

  input.classList.toggle("is-valid", isValid);
  input.classList.toggle("is-invalid", !isValid);

  if (errorElement) {
    errorElement.textContent = message;
  }
}

function setAvailabilityMessage(element, message, className) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.classList.remove("available", "unavailable", "checking");

  if (className) {
    element.classList.add(className);
  }
}

function showAlert(elementId, message, show = true) {
  const alertElement = document.getElementById(elementId);
  if (!alertElement) {
    return;
  }

  window.clearTimeout(alertElement.dismissTimer);

  if (!show) {
    alertElement.classList.add("d-none");
    alertElement.textContent = "";
    return;
  }

  alertElement.textContent = message;
  alertElement.classList.remove("d-none");
  alertElement.dismissTimer = window.setTimeout(() => {
    alertElement.classList.add("d-none");
  }, 4500);
}

function clearValidationState(form) {
  const controls = form.querySelectorAll(".form-control");
  const errors = form.querySelectorAll(".error-message");
  const availabilityMessages = form.querySelectorAll(".availability-message");

  controls.forEach((control) => {
    control.classList.remove("is-valid", "is-invalid");
  });

  errors.forEach((error) => {
    error.textContent = "";
  });

  availabilityMessages.forEach((message) => {
    message.textContent = "";
    message.classList.remove("available", "unavailable", "checking");
  });
}

function focusFirstInvalidField(form) {
  const firstInvalid = form.querySelector(".is-invalid");

  if (firstInvalid) {
    firstInvalid.focus();
  }
}
