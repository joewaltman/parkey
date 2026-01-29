/**
 * Form Submission - Tom Plumb Landing Page
 * Handles API integration and form submission
 */

// State Management
let isSubmitting = false;

// Get Form Data
function getFormData() {
  const form = document.getElementById('leadForm');
  if (!form) return null;

  // Get selected contact method
  const contactMethodRadio = form.querySelector('input[name="contactMethod"]:checked');

  return {
    name: document.getElementById('name')?.value.trim() || '',
    phone: document.getElementById('phone')?.value.trim() || '',
    email: document.getElementById('email')?.value.trim() || '',
    waterHeaterAge: document.getElementById('waterHeaterAge')?.value || '',
    condition: document.getElementById('condition')?.value || '',
    contactMethod: contactMethodRadio?.value || 'phone',
    details: document.getElementById('details')?.value.trim() || ''
  };
}

// Show Loading State
function showLoadingState() {
  const submitButton = document.getElementById('submitButton');
  if (!submitButton) return;

  submitButton.classList.add('loading');
  submitButton.disabled = true;
  isSubmitting = true;
}

// Hide Loading State
function hideLoadingState() {
  const submitButton = document.getElementById('submitButton');
  if (!submitButton) return;

  submitButton.classList.remove('loading');
  submitButton.disabled = false;
  isSubmitting = false;
}

// Show Form Message
function showFormMessage(message, type) {
  const formMessage = document.getElementById('formMessage');
  if (!formMessage) return;

  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = 'block';

  // Scroll message into view
  formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Auto-hide success messages after 10 seconds
  if (type === 'success') {
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 10000);
  }
}

// Hide Form Message
function hideFormMessage() {
  const formMessage = document.getElementById('formMessage');
  if (formMessage) {
    formMessage.style.display = 'none';
  }
}

// Reset Form
function resetForm() {
  const form = document.getElementById('leadForm');
  if (!form) return;

  form.reset();

  // Clear validation states
  const fields = ['name', 'phone', 'email'];
  fields.forEach(fieldName => {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);

    if (field) {
      field.classList.remove('valid', 'error');
    }

    if (errorElement) {
      errorElement.textContent = '';
    }
  });
}

// Submit Form to API
async function submitForm(formData) {
  try {
    const response = await fetch('/api/submit-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, message: data.message };
    } else {
      return {
        success: false,
        message: data.message || 'Something went wrong. Please try again.'
      };
    }
  } catch (error) {
    console.error('Form submission error:', error);
    return {
      success: false,
      message: 'Unable to submit form. Please call us at (760) 846-0414.'
    };
  }
}

// Handle Form Submission
async function handleFormSubmit(event) {
  event.preventDefault();

  // Prevent duplicate submissions
  if (isSubmitting) {
    return;
  }

  // Hide any previous messages
  hideFormMessage();

  // Validate all fields
  if (window.formValidation && !window.formValidation.validateAllFields()) {
    showFormMessage(
      'Please fix the errors above before submitting.',
      'error'
    );
    return;
  }

  // Get form data
  const formData = getFormData();
  if (!formData) {
    showFormMessage(
      'Unable to read form data. Please try again.',
      'error'
    );
    return;
  }

  // Show loading state
  showLoadingState();

  // Submit to API
  const result = await submitForm(formData);

  // Hide loading state
  hideLoadingState();

  // Handle result
  if (result.success) {
    showFormMessage(
      `Thank you, ${formData.name}! We've received your request and will contact you within 1 hour. Check your email for confirmation.`,
      'success'
    );

    // Reset form after successful submission
    setTimeout(() => {
      resetForm();
    }, 1000);

    // Track conversion (if analytics are set up)
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'event_category': 'Lead',
        'event_label': 'Water Heater Lead',
        'value': 1950
      });
    }
  } else {
    showFormMessage(
      result.message,
      'error'
    );
  }
}

// Track Phone Clicks
function trackPhoneClick(phoneNumber) {
  console.log('Phone clicked:', phoneNumber);

  // Track with Google Analytics if available
  if (window.gtag) {
    window.gtag('event', 'phone_click', {
      'event_category': 'Contact',
      'event_label': phoneNumber,
      'value': 1
    });
  }
}

// Initialize Form Submission
function initializeFormSubmission() {
  const form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Track phone number clicks
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(link => {
    link.addEventListener('click', function() {
      const phoneNumber = this.getAttribute('href').replace('tel:', '');
      trackPhoneClick(phoneNumber);
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFormSubmission);
} else {
  initializeFormSubmission();
}
