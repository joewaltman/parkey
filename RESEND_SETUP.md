# Resend Email Setup Guide

Complete guide to setting up Resend for the Tom Plumb landing page.

## Why Resend?

Resend is a modern email API that's:
- **Simpler**: Cleaner API, easier to use
- **Developer-friendly**: Better docs, instant testing domain
- **Affordable**: Free tier includes 100 emails/day (3,000/month)
- **Fast**: No complex setup, works in minutes
- **Reliable**: Built by developers, for developers

## Quick Start (5 Minutes)

### Step 1: Create Resend Account

1. Go to https://resend.com
2. Click "Sign Up"
3. Verify your email
4. You're in!

### Step 2: Get API Key

1. Go to **API Keys** in the dashboard
2. Click "Create API Key"
3. Name it: "Tom Plumb Landing Page"
4. Copy the key (starts with `re_`)
5. Save it securely

### Step 3: Configure Environment

Add to your `.env` file:

```env
RESEND_API_KEY=re_your_api_key_here
BUSINESS_EMAIL=your-email@example.com
NOTIFICATION_FROM_EMAIL=onboarding@resend.dev
```

**For Testing**: Use `onboarding@resend.dev` as the from email. No domain verification required!

### Step 4: Test It!

```bash
npm run dev
```

Fill out the form on `http://localhost:3000` and submit. Check your email!

## Production Setup (Add Your Domain)

For production, you'll want emails to come from your domain (e.g., `noreply@tomplumbs.com`).

### Step 1: Add Domain to Resend

1. Go to **Domains** in Resend dashboard
2. Click "Add Domain"
3. Enter your domain: `tomplumbs.com`
4. Click "Add"

### Step 2: Add DNS Records

Resend will show you DNS records to add. In your domain registrar (GoDaddy, Namecheap, etc.):

**Example DNS Records:**

| Type | Name | Value |
|------|------|-------|
| TXT | @ | v=spf1 include:_spf.resend.com ~all |
| CNAME | resend._domainkey | resend._domainkey.resend.com |
| TXT | _dmarc | v=DMARC1; p=none; pct=100; rua=mailto:dmarc@yourdomain.com |

**Note**: Your exact records will be shown in the Resend dashboard.

### Step 3: Verify Domain

1. Wait 5-10 minutes for DNS propagation
2. Click "Verify" in Resend dashboard
3. Once verified, you'll see a green checkmark

### Step 4: Update Environment

Change your `.env`:

```env
NOTIFICATION_FROM_EMAIL=noreply@tomplumbs.com
```

Now emails will come from your domain!

## Railway Deployment

### Add Environment Variables

In Railway dashboard:

1. Go to your project
2. Click **Variables**
3. Add these variables:

```
RESEND_API_KEY=re_your_actual_key_here
BUSINESS_EMAIL=leads@tomplumbs.com
NOTIFICATION_FROM_EMAIL=onboarding@resend.dev
NODE_ENV=production
PORT=3000
```

**Note**: For production, use your verified domain email instead of `onboarding@resend.dev`.

### Deploy

Railway will automatically deploy. Check the logs to verify:

```
✅ Resend initialized successfully
```

## Testing Email Delivery

### Method 1: Form Submission

1. Visit your landing page
2. Fill out the contact form
3. Submit
4. Check your email

### Method 2: Resend Logs

1. Go to **Logs** in Resend dashboard
2. See all sent emails
3. View delivery status
4. Check for errors

### Method 3: Server Logs

In Railway:
1. Go to **Deployments**
2. Click on latest deployment
3. View logs for:
   - `✅ Lead notification email sent to: ...`
   - `✅ Auto-response email sent to: ...`

## Troubleshooting

### Emails Not Sending

**Check 1: API Key**
- Is `RESEND_API_KEY` set correctly?
- Does it start with `re_`?
- Is it in Railway environment variables?

**Check 2: From Email**
- Using `onboarding@resend.dev` for testing? (should work immediately)
- Using your domain? Is it verified in Resend?
- Check Resend dashboard for domain status

**Check 3: Server Logs**
- Check Railway logs for errors
- Look for "Resend not configured" warnings
- Check for error messages from Resend API

**Check 4: Resend Logs**
- Go to Resend dashboard → Logs
- Look for failed deliveries
- Check error messages

### Emails Going to Spam

**Solution 1: Verify Domain**
Add SPF, DKIM, and DMARC records to your domain. This greatly improves deliverability.

**Solution 2: Warm Up Domain**
If using a new domain, start with a few emails per day and gradually increase.

**Solution 3: Check Content**
Avoid spam trigger words in subject/body:
- ❌ "FREE!!!", "ACT NOW", "LIMITED TIME"
- ✅ "Thanks for contacting Tom Plumb Plumbing"

### Rate Limits

**Free Tier**: 100 emails/day (3,000/month)
**Pro Tier**: Starts at $20/month for 50,000 emails

If you hit limits:
- Upgrade to Pro tier
- Or use a paid SMTP service for high volume

## Email Templates

### Lead Notification (Business)

**To**: Your business email
**From**: Your verified domain or `onboarding@resend.dev`
**Subject**: 🔥 New $1,950 Water Heater Lead: [Customer Name]
**Reply-To**: Customer's email (so you can reply directly)

### Auto-Response (Customer)

**To**: Customer's email
**From**: Your verified domain or `onboarding@resend.dev`
**Subject**: ☀️ Thanks for reaching out to Tom Plumb Plumbing!

## API Key Security

### ✅ Do:
- Store API key in `.env` file
- Add `.env` to `.gitignore`
- Use Railway environment variables for production
- Rotate keys if compromised

### ❌ Don't:
- Commit API keys to Git
- Share keys in Slack/email
- Use same key for multiple projects
- Hard-code keys in source code

## Monitoring & Analytics

### Resend Dashboard

Track:
- **Emails Sent**: Total count
- **Delivery Rate**: Successfully delivered
- **Open Rate**: Emails opened (if tracking enabled)
- **Click Rate**: Links clicked (if tracking enabled)

### Enable Email Tracking (Optional)

In your email sending code, add:

```javascript
await resend.emails.send({
  // ... other fields
  tracking: {
    opens: true,
    clicks: true
  }
});
```

## Cost Calculator

### Free Tier (Perfect for Getting Started)
- 100 emails/day
- 3,000 emails/month
- Enough for ~100 leads/month

### Pro Tier ($20/month)
- 50,000 emails/month
- Enough for ~25,000 leads/month

### Example: 50 Leads/Month
- 2 emails per lead (1 to you, 1 to customer)
- 100 emails/month total
- **Free tier works perfectly!**

## Support

- **Resend Docs**: https://resend.com/docs
- **Resend Support**: support@resend.com
- **Resend Discord**: Join at https://resend.com/discord
- **Status Page**: https://status.resend.com

## Comparison: Resend vs SendGrid

| Feature | Resend | SendGrid |
|---------|--------|----------|
| Free Tier | 100/day (3k/mo) | 100/day |
| Setup Time | 5 minutes | 30 minutes |
| Domain Verification | Optional | Required |
| Testing Email | ✅ Built-in | ❌ None |
| API Complexity | Simple | Complex |
| Developer Experience | Modern | Legacy |
| Pricing | Transparent | Confusing |

## Migration Complete! 🎉

Your landing page now uses Resend for email delivery. It's:
- ✅ Simpler to set up
- ✅ Easier to test
- ✅ More developer-friendly
- ✅ Just as reliable

Next steps:
1. Test email delivery locally
2. Add your domain to Resend (optional)
3. Deploy to Railway
4. Monitor delivery in Resend dashboard

---

Built with ❤️ using Resend - The Email API for Developers
