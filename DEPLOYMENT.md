# Deployment Guide - Tom Plumb Landing Page

Complete step-by-step guide to deploy your landing page to Railway.

## Prerequisites

- [x] GitHub account
- [x] Railway account (https://railway.app)
- [x] SendGrid account (https://sendgrid.com)
- [x] Domain name (optional)

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Tom Plumb water heater landing page"
```

### 1.2 Push to GitHub

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up SendGrid

### 2.1 Create SendGrid Account

1. Go to https://sendgrid.com
2. Sign up for a free account (up to 100 emails/day)
3. Verify your email address

### 2.2 Verify Sender Identity

1. Navigate to **Settings → Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill out the form with your business details:
   - From Name: `Tom Plumb Plumbing`
   - From Email: `noreply@tomplumbs.com` (or your domain)
   - Reply To: `info@tomplumbs.com`
4. Click **Save**
5. Check your email and click the verification link

### 2.3 Create API Key

1. Navigate to **Settings → API Keys**
2. Click **Create API Key**
3. Name it: `Tom Plumb Landing Page`
4. Select **Restricted Access**
5. Enable **Mail Send** permission
6. Click **Create & View**
7. **Copy the API key immediately** (you won't see it again!)
8. Save it securely for the next step

## Step 3: Deploy to Railway

### 3.1 Connect GitHub to Railway

1. Go to https://railway.app
2. Sign in with GitHub
3. Click **New Project**
4. Select **Deploy from GitHub repo**
5. Choose your repository: `YOUR_USERNAME/YOUR_REPO`
6. Click **Deploy Now**

### 3.2 Configure Environment Variables

1. Click on your deployed service
2. Click **Variables** tab
3. Click **+ New Variable**
4. Add each variable:

```
SENDGRID_API_KEY=SG.your_actual_api_key_here
BUSINESS_EMAIL=leads@tomplumbs.com
NOTIFICATION_FROM_EMAIL=noreply@tomplumbs.com
NODE_ENV=production
PORT=3000
```

**Important**:
- Replace `SG.your_actual_api_key_here` with your actual SendGrid API key
- Replace email addresses with your actual business emails
- The `NOTIFICATION_FROM_EMAIL` must match the verified sender in SendGrid

### 3.3 Verify Deployment

1. Wait for the build to complete (2-3 minutes)
2. Click **Deployments** tab
3. Check for green checkmark (✓)
4. Click on the **domain** to view your live site

### 3.4 Generate Public Domain

1. Go to **Settings** tab
2. Under **Networking**, click **Generate Domain**
3. Copy the Railway domain (e.g., `your-app.railway.app`)
4. Visit the domain to see your live landing page

## Step 4: Test Everything

### 4.1 Test Form Submission

1. Visit your Railway domain
2. Fill out the contact form with a test email
3. Submit the form
4. Verify success message appears

### 4.2 Check Email Delivery

1. Check your business email (BUSINESS_EMAIL) for lead notification
2. Check your test email for auto-response
3. **Check spam folders** if emails don't arrive
4. Verify all data appears correctly in emails

### 4.3 Test on Mobile

1. Open the site on your phone
2. Test form submission
3. Click phone number link (should open phone app)
4. Test responsive design

## Step 5: Custom Domain (Optional)

### 5.1 Add Domain to Railway

1. Go to **Settings** tab
2. Under **Networking**, click **Custom Domain**
3. Enter your domain: `www.tomplumbs.com`
4. Click **Add Domain**

### 5.2 Configure DNS

Railway will show you DNS records to add. In your domain registrar:

1. Add **CNAME record**:
   - Name: `www`
   - Value: `your-app.railway.app`
   - TTL: Automatic or 3600

2. For root domain, add **A record** (if supported):
   - Name: `@`
   - Value: (IP provided by Railway)
   - TTL: Automatic or 3600

3. Wait 5-60 minutes for DNS propagation

### 5.3 Enable SSL (Automatic)

Railway automatically provisions SSL certificates via Let's Encrypt. No action needed!

## Step 6: Configure SendGrid Domain Authentication (Recommended)

For better email deliverability, authenticate your domain:

### 6.1 Set Up Domain Authentication

1. Go to SendGrid → **Settings → Sender Authentication**
2. Click **Authenticate Your Domain**
3. Follow the wizard:
   - DNS Provider: Your registrar (e.g., GoDaddy, Namecheap)
   - Domain: `tomplumbs.com`
   - Advanced Settings: Leave default
4. Copy the DNS records provided

### 6.2 Add DNS Records

Add these records to your domain registrar:

1. **CNAME records** (typically 3 records)
2. Wait 24-48 hours for verification
3. Return to SendGrid and click **Verify**

### 6.3 Update From Email

Once verified, you can use `@yourdomain.com` emails without "via sendgrid.net" warnings.

## Step 7: Monitoring & Maintenance

### 7.1 Monitor Railway Logs

1. Go to your Railway project
2. Click **Deployments**
3. Click on latest deployment
4. View logs to monitor:
   - Form submissions
   - Email delivery status
   - Any errors

### 7.2 Check SendGrid Activity

1. Go to SendGrid → **Activity**
2. Monitor email delivery rates
3. Check for bounces or spam reports
4. Review open/click rates

### 7.3 Set Up Alerts (Optional)

1. Railway: Enable **Deploy Notifications** in Settings
2. SendGrid: Set up **Alerts** for bounces/spam

## Troubleshooting

### Problem: Emails Not Arriving

**Solution**:
1. Check SendGrid Activity Feed for delivery status
2. Verify sender email is authenticated
3. Check spam folder
4. Verify `NOTIFICATION_FROM_EMAIL` matches verified sender
5. Check Railway logs for errors

### Problem: Form Submission Fails

**Solution**:
1. Check Railway logs for error messages
2. Verify all environment variables are set
3. Test API endpoint: `https://your-domain.com/api/test`
4. Check browser console for JavaScript errors

### Problem: Page Not Loading

**Solution**:
1. Check Railway deployment status
2. Verify domain DNS settings (if using custom domain)
3. Check Railway logs for startup errors
4. Try redeploying: Click **Deploy → Redeploy**

### Problem: Slow Performance

**Solution**:
1. Run Lighthouse audit in Chrome DevTools
2. Optimize images (compress, use WebP)
3. Minify CSS/JS for production
4. Enable Railway's **Sleep on Idle** setting if traffic is low

## Performance Optimization

### Enable Caching

Add to `server/index.js`:

```javascript
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '1d'
}));
```

### Minify CSS/JS

For production, consider using build tools:

```bash
npm install --save-dev clean-css-cli uglify-js
```

Add to `package.json`:

```json
"scripts": {
  "build": "npm run minify-css && npm run minify-js",
  "minify-css": "cleancss -o public/css/styles.min.css public/css/*.css",
  "minify-js": "uglifyjs public/js/*.js -o public/js/scripts.min.js"
}
```

## Security Checklist

- [x] Environment variables are stored in Railway (not in code)
- [x] `.env` is in `.gitignore`
- [x] SendGrid API key has restricted permissions (Mail Send only)
- [x] Form validation on both client and server
- [x] Input sanitization in `submit-lead.js`
- [x] HTTPS enabled (automatic on Railway)
- [x] CORS configured appropriately

## Maintenance Schedule

### Weekly
- Check SendGrid email delivery rates
- Review Railway logs for errors
- Test form submission

### Monthly
- Check Railway usage (free tier limits)
- Review and update content
- Run Lighthouse performance audit
- Check for broken links

### Quarterly
- Update npm dependencies
- Review and refresh testimonials
- Analyze conversion rates
- A/B test headlines/CTAs

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **SendGrid Docs**: https://docs.sendgrid.com
- **Node.js Docs**: https://nodejs.org/docs
- **Express.js Docs**: https://expressjs.com

---

**Deployment Complete!** 🎉

Your Tom Plumb water heater landing page is now live and ready to generate leads.

Next steps:
1. Share the URL with your marketing team
2. Set up Google Analytics (optional)
3. Create ad campaigns pointing to the landing page
4. Monitor conversions and iterate
