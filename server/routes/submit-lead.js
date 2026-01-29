/**
 * Submit Lead Route - Tom Plumb Landing Page
 * Handles form submission and email notifications
 */

const express = require('express');
const router = express.Router();
const emailService = require('../services/email');

// Validation helper
function validateLeadData(data) {
  const errors = [];

  // Required fields
  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  } else if (data.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!data.phone || data.phone.trim() === '') {
    errors.push('Phone number is required');
  } else if (!/^\(\d{3}\)\s\d{3}-\d{4}$/.test(data.phone)) {
    errors.push('Phone number must be in format (XXX) XXX-XXXX');
  }

  if (!data.email || data.email.trim() === '') {
    errors.push('Email is required');
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  return errors;
}

// Sanitize data
function sanitizeLeadData(data) {
  return {
    name: (data.name || '').trim().substring(0, 100),
    phone: (data.phone || '').trim().substring(0, 20),
    email: (data.email || '').trim().substring(0, 100),
    waterHeaterAge: (data.waterHeaterAge || '').trim().substring(0, 50),
    condition: (data.condition || '').trim().substring(0, 50),
    contactMethod: (data.contactMethod || 'phone').trim().substring(0, 20),
    details: (data.details || '').trim().substring(0, 1000)
  };
}

// POST /api/submit-lead
router.post('/submit-lead', async (req, res) => {
  try {
    console.log('Received lead submission:', {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    });

    // Sanitize input data
    const sanitizedData = sanitizeLeadData(req.body);

    // Validate required fields
    const validationErrors = validateLeadData(sanitizedData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', '),
        errors: validationErrors
      });
    }

    // Send email notifications
    try {
      // Send lead notification to business
      await emailService.sendLeadNotification(sanitizedData);
      console.log('Lead notification email sent successfully');

      // Send auto-response to customer
      await emailService.sendAutoResponse(sanitizedData);
      console.log('Auto-response email sent successfully');
    } catch (emailError) {
      console.error('Email sending error:', emailError);

      // Still return success to user, but log the error
      // (Don't fail the submission just because email failed)
      return res.status(200).json({
        success: true,
        message: 'Lead submitted successfully! However, there was an issue sending confirmation emails. We will contact you shortly at the phone number provided.',
        warning: 'Email notification failed'
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      message: 'Lead submitted successfully! Check your email for confirmation.'
    });

  } catch (error) {
    console.error('Form submission error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to submit your request. Please call us directly at (760) 846-0414.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/test - Test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
