/**
 * Email Service - Tom Plumb Landing Page
 * Handles Resend email integration
 */

const { Resend } = require('resend');

// Initialize Resend with API key
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'leads@tomplumbs.com';
const NOTIFICATION_FROM_EMAIL = process.env.NOTIFICATION_FROM_EMAIL || 'noreply@tomplumbs.com';

let resend = null;

if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
  console.log('✅ Resend initialized successfully');
} else {
  console.warn('⚠️  RESEND_API_KEY not found. Email functionality will be disabled.');
}

/**
 * Generate HTML for lead notification email (to business)
 */
function generateLeadEmailHTML(data) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Water Heater Lead</title>
</head>
<body style="font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif; padding: 0; margin: 0; background-color: #FFFCF7;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #FF8C42, #FF6B35); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">🔥 New Water Heater Lead!</h1>
      <p style="color: rgba(255, 255, 255, 0.95); margin: 10px 0 0; font-size: 16px;">Someone just requested your $1,950 water heater replacement</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">

      <!-- Customer Info -->
      <div style="background: #F4E4D7; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h2 style="color: #3D3D3D; margin: 0 0 15px; font-size: 20px;">Customer Information</h2>

        <div style="margin-bottom: 12px;">
          <strong style="color: #6B6B6B; display: inline-block; width: 140px;">Name:</strong>
          <span style="color: #3D3D3D; font-size: 16px;">${data.name}</span>
        </div>

        <div style="margin-bottom: 12px;">
          <strong style="color: #6B6B6B; display: inline-block; width: 140px;">Phone:</strong>
          <a href="tel:${data.phone.replace(/\D/g, '')}" style="color: #4A90E2; text-decoration: none; font-weight: 600; font-size: 16px;">${data.phone}</a>
        </div>

        <div style="margin-bottom: 12px;">
          <strong style="color: #6B6B6B; display: inline-block; width: 140px;">Email:</strong>
          <a href="mailto:${data.email}" style="color: #4A90E2; text-decoration: none; font-size: 16px;">${data.email}</a>
        </div>

        <div style="margin-bottom: 12px;">
          <strong style="color: #6B6B6B; display: inline-block; width: 140px;">Contact Method:</strong>
          <span style="color: #3D3D3D; font-size: 16px; text-transform: capitalize;">${data.contactMethod || 'Phone'}</span>
        </div>
      </div>

      <!-- Water Heater Details -->
      ${data.waterHeaterAge || data.condition ? `
      <div style="background: #E8F4F0; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h2 style="color: #3D3D3D; margin: 0 0 15px; font-size: 20px;">Water Heater Details</h2>

        ${data.waterHeaterAge ? `
        <div style="margin-bottom: 12px;">
          <strong style="color: #6B6B6B; display: inline-block; width: 140px;">Age:</strong>
          <span style="color: #3D3D3D; font-size: 16px;">${data.waterHeaterAge}</span>
        </div>
        ` : ''}

        ${data.condition ? `
        <div style="margin-bottom: 12px;">
          <strong style="color: #6B6B6B; display: inline-block; width: 140px;">Condition:</strong>
          <span style="color: #3D3D3D; font-size: 16px; text-transform: capitalize;">${data.condition.replace('-', ' ')}</span>
        </div>
        ` : ''}
      </div>
      ` : ''}

      <!-- Additional Details -->
      ${data.details ? `
      <div style="background: #FCF0ED; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h2 style="color: #3D3D3D; margin: 0 0 15px; font-size: 20px;">Additional Details</h2>
        <p style="color: #3D3D3D; line-height: 1.6; margin: 0; white-space: pre-wrap; font-size: 15px;">${data.details}</p>
      </div>
      ` : ''}

      <!-- Call to Action -->
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #6B6B6B; margin: 0 0 20px; font-size: 15px;">⏰ <strong>Response Time Goal:</strong> Contact within 1 hour</p>
        <a href="tel:${data.phone.replace(/\D/g, '')}" style="display: inline-block; background: linear-gradient(135deg, #FF8C42, #FF6B35); color: white; padding: 15px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 18px; box-shadow: 0 4px 15px rgba(255, 140, 66, 0.3);">
          Call ${data.name} Now
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #2D2D2D; padding: 20px; text-align: center;">
      <p style="color: rgba(255, 255, 255, 0.7); margin: 0; font-size: 13px;">
        This lead was submitted via TomPlumbs.com<br>
        ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST
      </p>
    </div>

  </div>
</body>
</html>
  `;
}

/**
 * Generate HTML for auto-response email (to customer)
 */
function generateAutoResponseHTML(data) {
  const firstName = data.name.split(' ')[0];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for Contacting Tom Plumb Plumbing</title>
</head>
<body style="font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif; padding: 0; margin: 0; background-color: #FFFCF7;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #FFD166, #FF8C42); padding: 40px 30px; text-align: center;">
      <div style="font-size: 60px; margin-bottom: 15px;">☀️</div>
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Thanks, ${firstName}!</h1>
      <p style="color: rgba(255, 255, 255, 0.95); margin: 15px 0 0; font-size: 16px;">We received your water heater replacement request</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">

      <!-- Main Message -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #3D3D3D; margin: 0 0 15px; font-size: 24px;">What Happens Next?</h2>
        <p style="color: #6B6B6B; line-height: 1.7; margin: 0; font-size: 16px;">
          Our team will contact you <strong style="color: #FF8C42;">within 1 hour</strong> to schedule your $1,950 water heater installation.
        </p>
      </div>

      <!-- Timeline -->
      <div style="background: #F4E4D7; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <div style="margin-bottom: 20px;">
          <div style="display: inline-block; background: #6B9080; color: white; width: 30px; height: 30px; border-radius: 50%; text-align: center; line-height: 30px; font-weight: 700; margin-right: 10px;">1</div>
          <strong style="color: #3D3D3D; font-size: 16px;">We'll call you within 1 hour</strong>
          <p style="color: #6B6B6B; margin: 5px 0 0 40px; font-size: 14px;">To discuss your needs and schedule installation</p>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="display: inline-block; background: #6B9080; color: white; width: 30px; height: 30px; border-radius: 50%; text-align: center; line-height: 30px; font-weight: 700; margin-right: 10px;">2</div>
          <strong style="color: #3D3D3D; font-size: 16px;">Same-day installation available</strong>
          <p style="color: #6B6B6B; margin: 5px 0 0 40px; font-size: 14px;">Most installations take just 2-4 hours</p>
        </div>

        <div>
          <div style="display: inline-block; background: #6B9080; color: white; width: 30px; height: 30px; border-radius: 50%; text-align: center; line-height: 30px; font-weight: 700; margin-right: 10px;">3</div>
          <strong style="color: #3D3D3D; font-size: 16px;">Enjoy hot water again!</strong>
          <p style="color: #6B6B6B; margin: 5px 0 0 40px; font-size: 14px;">Plus we'll help you claim your $100 SDG&E rebate</p>
        </div>
      </div>

      <!-- What's Included -->
      <div style="background: #E8F4F0; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <h3 style="color: #3D3D3D; margin: 0 0 15px; font-size: 18px;">Your $1,950 Package Includes:</h3>
        <ul style="color: #6B6B6B; line-height: 1.8; margin: 0; padding-left: 20px; font-size: 15px;">
          <li>40-gallon Bradford White or Rheem water heater</li>
          <li>Professional installation by licensed plumbers</li>
          <li>All permits and code compliance</li>
          <li>Complete haul-away of old unit</li>
          <li>Professional site cleanup</li>
          <li>6-year manufacturer warranty</li>
          <li>1-year labor warranty</li>
        </ul>
      </div>

      <!-- Urgent Need? -->
      <div style="background: #FFD166; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 25px;">
        <p style="color: #3D3D3D; margin: 0 0 15px; font-size: 16px; font-weight: 600;">Need immediate assistance?</p>
        <a href="tel:7608460414" style="display: inline-block; background: #FF8C42; color: white; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 18px; box-shadow: 0 4px 15px rgba(255, 140, 66, 0.3);">
          Call Now: (760) 846-0414
        </a>
      </div>

      <!-- Trust Signals -->
      <div style="text-align: center; padding: 20px 0; border-top: 2px solid #F4E4D7;">
        <p style="color: #6B6B6B; margin: 0 0 10px; font-size: 14px;">
          ✅ <strong>Licensed & Insured</strong> • CA License #955168<br>
          👨‍👩‍👧‍👦 <strong>Family-Owned</strong> • Serving San Diego Since 1986<br>
          ⭐ <strong>Same-Day Service</strong> • Available 7 Days a Week
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #2D2D2D; padding: 25px; text-align: center;">
      <p style="color: rgba(255, 255, 255, 0.9); margin: 0 0 10px; font-size: 16px; font-weight: 600;">
        Tom Plumb Plumbing
      </p>
      <p style="color: rgba(255, 255, 255, 0.7); margin: 0; font-size: 14px; line-height: 1.6;">
        Your North County San Diego Neighbor<br>
        (760) 846-0414 • CA License #955168<br>
        <a href="https://tomplumbs.com" style="color: #FFD166; text-decoration: none;">TomPlumbs.com</a>
      </p>
    </div>

  </div>
</body>
</html>
  `;
}

/**
 * Send lead notification email to business
 */
async function sendLeadNotification(data) {
  if (!resend) {
    console.warn('Resend not configured. Skipping lead notification email.');
    return;
  }

  try {
    const result = await resend.emails.send({
      from: NOTIFICATION_FROM_EMAIL,
      to: BUSINESS_EMAIL,
      replyTo: data.email,
      subject: `🔥 New $1,950 Water Heater Lead: ${data.name}`,
      html: generateLeadEmailHTML(data),
      text: `
New Water Heater Lead Received

Customer Information:
- Name: ${data.name}
- Phone: ${data.phone}
- Email: ${data.email}
- Contact Method: ${data.contactMethod || 'Phone'}

Water Heater Details:
- Age: ${data.waterHeaterAge || 'Not specified'}
- Condition: ${data.condition || 'Not specified'}

Additional Details:
${data.details || 'None provided'}

Please contact this customer within 1 hour.
      `.trim()
    });

    console.log('✅ Lead notification email sent to:', BUSINESS_EMAIL);
    console.log('   Email ID:', result.data?.id);
  } catch (error) {
    console.error('❌ Error sending lead notification:', error);
    throw error;
  }
}

/**
 * Send auto-response email to customer
 */
async function sendAutoResponse(data) {
  if (!resend) {
    console.warn('Resend not configured. Skipping auto-response email.');
    return;
  }

  try {
    const result = await resend.emails.send({
      from: NOTIFICATION_FROM_EMAIL,
      to: data.email,
      subject: '☀️ Thanks for reaching out to Tom Plumb Plumbing!',
      html: generateAutoResponseHTML(data),
      text: `
Hi ${data.name.split(' ')[0]},

Thanks for requesting a water heater replacement from Tom Plumb Plumbing!

We received your request and our team will contact you within 1 hour to schedule your $1,950 installation.

Your package includes:
- 40-gallon Bradford White or Rheem water heater
- Professional installation by licensed plumbers
- All permits and code compliance
- Complete haul-away of old unit
- Professional site cleanup
- 6-year manufacturer warranty
- 1-year labor warranty

Need immediate assistance?
Call us now: (760) 846-0414

Tom Plumb Plumbing
Your North County San Diego Neighbor
CA License #955168
TomPlumbs.com
      `.trim()
    });

    console.log('✅ Auto-response email sent to:', data.email);
    console.log('   Email ID:', result.data?.id);
  } catch (error) {
    console.error('❌ Error sending auto-response:', error);
    throw error;
  }
}

module.exports = {
  sendLeadNotification,
  sendAutoResponse
};
