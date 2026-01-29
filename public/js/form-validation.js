/**
 * Form Validation - Tom Plumb Landing Page
 * Real-time validation with visual feedback
 */

// Validation Rules
const validationRules = {
  name: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s'-]+$/,
    errorMessages: {
      required: 'Please enter your full name',
      minLength: 'Name must be at least 2 characters',
      pattern: 'Please enter a valid name (letters, spaces, hyphens only)'
    }
  },
  phone: {
    required: true,
    pattern: /^\(\d{3}\)\s\d{3}-\d{4}$/,
    errorMessages: {
      required: 'Please enter your phone number',
      pattern: 'Please enter a valid phone number'
    }
  },
  email: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    errorMessages: {
      required: 'Please enter your email address',
      pattern: 'Please enter a valid email address'
    }
  }
};

// Phone Number Formatting
function formatPhoneNumber(value) {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');

  // Limit to 10 digits
  const truncated = numbers.slice(0, 10);

  // Format as (XXX) XXX-XXXX
  if (truncated.length === 0) {
    return '';
  } else if (truncated.length <= 3) {
    return `(${truncated}`;
  } else if (truncated.length <= 6) {
    return `(${truncated.slice(0, 3)}) ${truncated.slice(3)}`;
  } else {
    return `(${truncated.slice(0, 3)}) ${truncated.slice(3, 6)}-${truncated.slice(6)}`;
  }
}

// Validate Single Field
function validateField(fieldName, value) {
  const rules = validationRules[fieldName];

  if (!rules) {
    return { valid: true, error: '' };
  }

  // Required check
  if (rules.required && (!value || value.trim() === '')) {
    return { valid: false, error: rules.errorMessages.required };
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim() === '') {
    return { valid: true, error: '' };
  }

  // Min length check
  if (rules.minLength && value.length < rules.minLength) {
    return { valid: false, error: rules.errorMessages.minLength };
  }

  // Pattern check
  if (rules.pattern && !rules.pattern.test(value)) {
    return { valid: false, error: rules.errorMessages.pattern };
  }

  return { valid: true, error: '' };
}

// Show Error Message
function showError(fieldName, errorMessage) {
  const field = document.getElementById(fieldName);
  const errorElement = document.getElementById(`${fieldName}-error`);

  if (field && errorElement) {
    field.classList.add('error');
    field.classList.remove('valid');
    errorElement.textContent = errorMessage;
  }
}

// Show Success (Valid Field)
function showSuccess(fieldName) {
  const field = document.getElementById(fieldName);
  const errorElement = document.getElementById(`${fieldName}-error`);

  if (field && errorElement) {
    field.classList.remove('error');
    field.classList.add('valid');
    errorElement.textContent = '';
  }
}

// Clear Validation State
function clearValidation(fieldName) {
  const field = document.getElementById(fieldName);
  const errorElement = document.getElementById(`${fieldName}-error`);

  if (field && errorElement) {
    field.classList.remove('error', 'valid');
    errorElement.textContent = '';
  }
}

// Validate All Fields
function validateAllFields() {
  const fields = ['name', 'phone', 'email'];
  let allValid = true;

  fields.forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (field) {
      const validation = validateField(fieldName, field.value);

      if (!validation.valid) {
        showError(fieldName, validation.error);
        allValid = false;
      } else {
        showSuccess(fieldName);
      }
    }
  });

  return allValid;
}

// Check if Form is Valid
function isFormValid() {
  const fields = ['name', 'phone', 'email'];

  return fields.every(fieldName => {
    const field = document.getElementById(fieldName);
    if (!field) return false;

    const validation = validateField(fieldName, field.value);
    return validation.valid;
  });
}

// Initialize Form Validation
function initializeFormValidation() {
  const form = document.getElementById('leadForm');
  if (!form) return;

  // Name Field
  const nameField = document.getElementById('name');
  if (nameField) {
    nameField.addEventListener('blur', function() {
      const validation = validateField('name', this.value);
      if (!validation.valid) {
        showError('name', validation.error);
      } else {
        showSuccess('name');
      }
    });

    nameField.addEventListener('focus', function() {
      clearValidation('name');
    });

    nameField.addEventListener('input', function() {
      // Real-time validation on input (debounced)
      clearTimeout(this.validationTimeout);
      this.validationTimeout = setTimeout(() => {
        const validation = validateField('name', this.value);
        if (this.value.length > 0) {
          if (!validation.valid) {
            showError('name', validation.error);
          } else {
            showSuccess('name');
          }
        }
      }, 500);
    });
  }

  // Phone Field - With Formatting
  const phoneField = document.getElementById('phone');
  if (phoneField) {
    phoneField.addEventListener('input', function() {
      // Format phone number as user types
      const cursorPosition = this.selectionStart;
      const oldValue = this.value;
      const newValue = formatPhoneNumber(this.value);

      this.value = newValue;

      // Maintain cursor position after formatting
      if (newValue.length > oldValue.length) {
        this.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
      } else {
        this.setSelectionRange(cursorPosition, cursorPosition);
      }

      // Real-time validation
      clearTimeout(this.validationTimeout);
      this.validationTimeout = setTimeout(() => {
        const validation = validateField('phone', this.value);
        if (this.value.length > 0) {
          if (!validation.valid) {
            showError('phone', validation.error);
          } else {
            showSuccess('phone');
          }
        }
      }, 500);
    });

    phoneField.addEventListener('blur', function() {
      const validation = validateField('phone', this.value);
      if (!validation.valid) {
        showError('phone', validation.error);
      } else {
        showSuccess('phone');
      }
    });

    phoneField.addEventListener('focus', function() {
      clearValidation('phone');
    });
  }

  // Email Field
  const emailField = document.getElementById('email');
  if (emailField) {
    emailField.addEventListener('blur', function() {
      const validation = validateField('email', this.value);
      if (!validation.valid) {
        showError('email', validation.error);
      } else {
        showSuccess('email');
      }
    });

    emailField.addEventListener('focus', function() {
      clearValidation('email');
    });

    emailField.addEventListener('input', function() {
      // Real-time validation on input (debounced)
      clearTimeout(this.validationTimeout);
      this.validationTimeout = setTimeout(() => {
        const validation = validateField('email', this.value);
        if (this.value.length > 0) {
          if (!validation.valid) {
            showError('email', validation.error);
          } else {
            showSuccess('email');
          }
        }
      }, 500);
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFormValidation);
} else {
  initializeFormValidation();
}

// Export functions for use in form-submission.js
window.formValidation = {
  validateAllFields,
  isFormValid,
  showError,
  showSuccess
};
