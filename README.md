# Tom Plumb Plumbing - Water Heater Landing Page

A high-conversion landing page for water heater replacement leads targeting North County San Diego customers. Features a warm, local, neighborhood aesthetic with the **$1,950 price as the unforgettable hero**.

## Features

- **Distinctive Design**: Warm San Diego aesthetic with sunset oranges, ocean blues, and friendly typography
- **Price Hero**: Massive, impossible-to-miss $1,950 display that visitors will remember
- **Mobile-First**: Fully responsive design optimized for all devices
- **Real-Time Form Validation**: Instant feedback with phone number auto-formatting
- **Email Integration**: Automatic lead notifications via SendGrid with beautiful HTML templates
- **SEO Optimized**: Complete meta tags, Schema.org markup, semantic HTML
- **Performance**: Optimized for fast loading with lazy loading and efficient assets
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels and keyboard navigation

## Technology Stack

- **Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript (ES6+)
- **Backend**: Express.js on Railway
- **Email**: SendGrid API integration
- **Hosting**: Railway (static frontend + Express worker for API)

## Project Structure

```
/
├── public/                      # Static frontend files
│   ├── index.html              # Main landing page
│   ├── css/
│   │   ├── variables.css       # Design system (warm colors, spacing, fonts)
│   │   ├── base.css            # Typography and base styles
│   │   ├── components.css      # All section and component styles
│   │   └── responsive.css      # Mobile/tablet/desktop breakpoints
│   ├── js/
│   │   ├── form-validation.js  # Real-time form validation
│   │   ├── form-submission.js  # API integration for lead capture
│   │   └── main.js             # Page interactions (FAQ, smooth scroll)
│   └── images/                 # Logo, hero, water-heater images
├── server/                      # Express backend
│   ├── index.js                # Express server entry point
│   ├── routes/
│   │   └── submit-lead.js      # Form submission endpoint
│   └── services/
│       └── email.js            # SendGrid integration
├── package.json                # Dependencies
├── railway.toml                # Railway configuration
├── .env.example                # Example environment variables
└── README.md                   # This file
```

## Local Development

### Prerequisites

- Node.js 16+ and npm 8+
- SendGrid account (free tier is fine)

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your values:
   ```
   SENDGRID_API_KEY=SG.your_api_key_here
   BUSINESS_EMAIL=your-email@example.com
   NOTIFICATION_FROM_EMAIL=noreply@yourdomain.com
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   ```
   http://localhost:3000
   ```

### Testing the Form

1. Fill out the contact form with valid information
2. Check the terminal for email sending logs
3. Verify emails arrive at the configured addresses

## SendGrid Setup

1. **Create Account**: https://sendgrid.com (free tier works)

2. **Verify Sender Email**:
   - Go to Settings → Sender Authentication
   - Verify a single sender email address
   - Use this as `NOTIFICATION_FROM_EMAIL`

3. **Create API Key**:
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Select "Mail Send" permissions
   - Copy the key to `SENDGRID_API_KEY`

4. **Test Email Delivery**:
   - Submit a test form
   - Check spam folder if emails don't arrive
   - Verify sender email is correct

## Railway Deployment

### Quick Deploy

1. **Connect Repository**:
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose this repository

2. **Add Environment Variables**:
   - Click on your service
   - Go to "Variables" tab
   - Add all variables from `.env.example`

3. **Deploy**:
   - Railway automatically deploys on git push
   - Or click "Deploy" in the dashboard

4. **Get Your URL**:
   - Go to "Settings"
   - Click "Generate Domain"
   - Your site is live!

### Custom Domain (Optional)

1. Go to Railway project settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records as instructed

## Design Philosophy

### Color Palette - Warm San Diego Aesthetic

- **Sunset Orange** (#FF8C42): Primary accent, warm and inviting
- **Ocean Blue** (#4A90E2): San Diego ocean vibes
- **Sunshine Yellow** (#FFD166): Bright, happy highlights
- **Sand Beige** (#F4E4D7): Warm neutral background
- **Palm Green** (#6B9080): Subtle natural accent

### Typography

- **Display Font**: Quicksand (friendly, rounded, approachable)
- **Price Font**: Poppins (bold, strong, memorable)
- **Body Font**: Open Sans (clean, readable, warm)

### Key Design Elements

1. **Massive Price Display**: 8-12rem font size, gradient background, impossible to miss
2. **Warm Gradients**: Sunset-inspired gradients throughout
3. **Organic Shapes**: Rounded corners, soft shadows, flowing layouts
4. **Local Touches**: Palm tree decorations, San Diego imagery
5. **Friendly Icons**: Emojis and approachable iconography

## Performance Optimization

### Current Performance Targets

- Lighthouse Score: 90+ (mobile/desktop)
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s

### Optimization Techniques

- CSS minification for production
- Image optimization (WebP with fallbacks)
- Lazy loading for below-fold images
- Efficient JavaScript with defer loading
- Mobile-first responsive design

## Form Validation

### Fields

- **Name**: Required, 2+ characters, letters/spaces only
- **Phone**: Required, auto-formatted to (XXX) XXX-XXXX
- **Email**: Required, RFC-compliant validation
- **Water Heater Age**: Optional dropdown
- **Condition**: Optional dropdown
- **Contact Method**: Required radio (Phone/Email/Either)
- **Additional Details**: Optional textarea

### Validation Features

- Real-time validation on blur
- Inline error messages
- Visual feedback (green/red borders)
- Phone number auto-formatting as user types
- Submit button disabled until form is valid

## Email Templates

### Lead Notification (to Business)

- Warm gradient header with 🔥 emoji
- Customer info in sand-colored card
- Water heater details in green card
- Additional details in coral card
- Call-to-action button to call customer
- Responsive design for mobile viewing

### Auto-Response (to Customer)

- Sunshine-themed header with ☀️ emoji
- Personalized greeting with first name
- 3-step timeline of what happens next
- Package details with bullet points
- Urgent CTA to call if needed
- Trust signals (licensed, family-owned, same-day)

## Analytics & Tracking

### Events Tracked (if Google Analytics is set up)

- Form submissions (conversions)
- Phone number clicks
- CTA button clicks
- FAQ expansions
- Scroll depth (25%, 50%, 75%, 100%)
- Time on page

### Setup Google Analytics

1. Add your GA4 measurement ID to `index.html`
2. Update the tracking code in `form-submission.js` and `main.js`
3. All events will automatically track

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

## Accessibility Features

- Semantic HTML5 structure
- Proper heading hierarchy (H1 → H6)
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators for all interactive elements
- Color contrast ratios meet WCAG AA standards
- Reduced motion support
- Screen reader friendly

## Customization

### Changing Colors

Edit `public/css/variables.css` and update the color values in the `:root` section.

### Updating Content

All content is in `public/index.html`. Sections are clearly marked with comments.

### Modifying Email Templates

Edit `server/services/email.js` to customize email HTML and styling.

### Adjusting Form Fields

1. Update HTML in `public/index.html`
2. Add validation rules in `public/js/form-validation.js`
3. Handle new fields in `server/routes/submit-lead.js`

## Troubleshooting

### Emails Not Sending

- Check SendGrid API key is correct
- Verify sender email is authenticated in SendGrid
- Check Railway logs for error messages
- Ensure environment variables are set correctly

### Form Submission Fails

- Open browser console for errors
- Check network tab for API response
- Verify server is running (`npm run dev`)
- Check server logs for errors

### Styling Issues

- Clear browser cache
- Check CSS file paths are correct
- Verify all CSS files are linked in `index.html`
- Test in different browsers

### Railway Deployment Issues

- Check Railway build logs
- Verify `railway.toml` is present
- Ensure all environment variables are set
- Check that `package.json` has correct start command

## Production Checklist

- [ ] Update all placeholder content in `index.html`
- [ ] Add real logo and images to `public/images/`
- [ ] Configure SendGrid with verified sender email
- [ ] Set all environment variables in Railway
- [ ] Test form submission end-to-end
- [ ] Run Lighthouse audit (target 90+)
- [ ] Test on mobile devices
- [ ] Test across different browsers
- [ ] Set up Google Analytics (optional)
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificate (automatic on Railway)
- [ ] Test email delivery to spam folder
- [ ] Verify phone number links work on mobile

## Support & Contact

For questions or issues with this landing page:

- **Business**: Tom Plumb Plumbing
- **Phone**: (760) 846-0414
- **License**: CA #955168
- **Service Area**: North County San Diego

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

Built with ❤️ for Tom Plumb Plumbing - Your North County San Diego Neighbor
