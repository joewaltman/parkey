# Quick Start Guide

Get your Tom Plumb water heater landing page running in 5 minutes.

## Step 1: Install Dependencies (1 minute)

```bash
npm install
```

## Step 2: Configure Environment (1 minute)

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your text editor
# You need:
# - Resend API key (get from resend.com)
# - Your business email
# - Your notification sender email
```

Minimum `.env` file:

```
RESEND_API_KEY=re_your_key_here
BUSINESS_EMAIL=your-email@example.com
NOTIFICATION_FROM_EMAIL=onboarding@resend.dev
```

**Note**: For testing, use `onboarding@resend.dev` as the from email (no domain verification needed!)

## Step 3: Run Development Server (1 minute)

```bash
npm run dev
```

Server will start at `http://localhost:3000`

## Step 4: Test the Form (2 minutes)

1. Open `http://localhost:3000` in your browser
2. Fill out the contact form
3. Submit and verify success message
4. Check your email for notifications

## Common Issues

### "Resend not configured"

Add your `RESEND_API_KEY` to the `.env` file.

### "Cannot find module 'express'"

Run `npm install` first.

### Port 3000 already in use

Change `PORT=3001` in `.env` file.

## Next Steps

- **Add Images**: Place logo and images in `public/images/`
- **Customize Content**: Edit `public/index.html`
- **Deploy**: See `DEPLOYMENT.md` for Railway setup
- **Go Live**: Update DNS and configure custom domain

## Need Help?

Check out:
- `README.md` - Full documentation
- `DEPLOYMENT.md` - Deployment guide
- Railway logs - For deployment errors
- Resend Logs - For email delivery issues (https://resend.com/logs)

---

**Ready to deploy?** Follow the step-by-step guide in `DEPLOYMENT.md`
