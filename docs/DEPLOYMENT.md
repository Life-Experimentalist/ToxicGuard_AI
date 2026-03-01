# 🌐 GitHub Pages Deployment Guide

Deploy ToxicGuard AI landing page to GitHub Pages for free hosting.

## 📋 Prerequisites

- GitHub account
- Git installed on your system
- Repository with updated `index.html`

---

## 🚀 Quick Deployment (Recommended)

### Step 1: Push Your Changes

```powershell
# Navigate to your project directory
cd V:\Code\ProjectCode\ToxicGuard_AI

# Add all changes
git add .

# Commit with a descriptive message
git commit -m "feat: Complete UI/UX overhaul with contributors section"

# Push to GitHub
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/Life-Experimentalist/ToxicGuard_AI`
2. Click **Settings** (top right)
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Click **Save**

### Step 3: Wait for Deployment

- GitHub will automatically build and deploy
- Usually takes 1-5 minutes
- Check the green checkmark at the top of Settings > Pages

### Step 4: Access Your Site

Your site will be available at:
```
https://Life-Experimentalist.github.io/ToxicGuard_AI/
```

---

## 🔧 Advanced: Custom Domain (Optional)

### Step 1: Purchase Domain

Purchase a domain from:
- Namecheap
- GoDaddy
- Google Domains
- Cloudflare

### Step 2: Configure DNS

Add these DNS records at your domain provider:

```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153

Type: CNAME
Name: www
Value: Life-Experimentalist.github.io
```

### Step 3: Update GitHub Pages Settings

1. Go to Settings > Pages
2. Enter your custom domain (e.g., `toxicguard.ai`)
3. Check **Enforce HTTPS** (wait for certificate)
4. Save

### Step 4: Add CNAME File

Create a file named `CNAME` (no extension) in the repository root:

```
toxicguard.ai
```

Commit and push:

```powershell
echo "toxicguard.ai" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push origin main
```

---

## 📝 Update Landing Page Content

### Modify Hero Section

Edit `index.html` around line 400:

```html
<h1>🛡️ ToxicGuard AI</h1>
<p class="subtitle">Your custom tagline here</p>
```

### Update Links

Ensure all links point to the correct URLs:

```html
<!-- Update repository links -->
<a href="https://github.com/Life-Experimentalist/ToxicGuard_AI">

<!-- Update test page link -->
<a href="test.html" target="_blank">

<!-- Update contributor profiles -->
<a href="https://github.com/VKrishna04">
<a href="https://github.com/Jayanth-0703">
```

### Add Google Analytics (Optional)

Add before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🎨 Optimize for Production

### Minify CSS (Optional)

Use online tools like:
- https://www.minifier.org/
- https://cssminifier.com/

### Optimize Images

1. **Compress icons:**
   ```powershell
   # Use ImageOptim, TinyPNG, or similar
   ```

2. **Convert to WebP:**
   ```powershell
   # Use cwebp or online converters
   ```

3. **Add lazy loading:**
   ```html
   <img src="image.png" loading="lazy" alt="Description">
   ```

### Add Meta Tags for SEO

Already included in the updated `index.html`:

```html
<meta name="description" content="...">
<meta name="keywords" content="...">
<meta property="og:title" content="ToxicGuard AI">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta name="twitter:card" content="summary_large_image">
```

---

## 🔒 Security Best Practices

### Enable HTTPS

✅ Already enabled by GitHub Pages automatically

### Content Security Policy

Add to `<head>`:

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
               style-src 'self' 'unsafe-inline';
               img-src 'self' https: data:;">
```

### Subresource Integrity

For external scripts:

```html
<script src="https://cdn.example.com/script.js"
        integrity="sha384-..."
        crossorigin="anonymous"></script>
```

---

## 📊 Monitor Your Site

### GitHub Pages Status

Check deployment status:
1. Go to **Actions** tab in your repository
2. View workflow runs
3. Check for errors

### Analytics

Once deployed, monitor:
- Page views
- Bounce rate
- User demographics
- Traffic sources

### Uptime Monitoring

Use free services:
- UptimeRobot: https://uptimerobot.com/
- StatusCake: https://www.statuscake.com/
- Pingdom: https://www.pingdom.com/

---

## 🐛 Troubleshooting

### Site Not Updating?

**Problem:** Changes not visible after push

**Solutions:**
1. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear cache:** Browser settings > Clear browsing data
3. **Check build status:** GitHub Actions tab
4. **Wait longer:** Can take up to 10 minutes
5. **Verify push:** Check GitHub repository for latest commits

### 404 Error?

**Problem:** Page not found

**Solutions:**
1. **Check branch:** Must be `main` or `gh-pages`
2. **Verify file name:** Must be `index.html` (lowercase)
3. **Check permissions:** Repository must be public
4. **Wait for build:** First deployment can take longer

### Images Not Loading?

**Problem:** Images show broken icon

**Solutions:**
1. **Check file paths:** Use relative paths (`./icons/icon.png`)
2. **Case sensitivity:** Ensure exact filename match
3. **File exists:** Verify image files are pushed to GitHub
4. **Large files:** GitHub has 100MB file limit

### Custom Domain Not Working?

**Problem:** Domain shows error

**Solutions:**
1. **DNS propagation:** Wait 24-48 hours
2. **CNAME file:** Must be in repository root
3. **DNS records:** Verify A and CNAME records
4. **HTTPS:** Wait for SSL certificate provisioning

---

## 🎯 Post-Deployment Checklist

After deployment, verify:

- [ ] Site loads correctly
- [ ] All images display properly
- [ ] Links work (internal and external)
- [ ] Test page accessible
- [ ] Extension detection works
- [ ] Mobile responsive
- [ ] Forms submit correctly (if any)
- [ ] No console errors
- [ ] SEO meta tags present
- [ ] Social media previews work

---

## 🔄 Continuous Deployment

### Automatic Updates

GitHub Pages automatically deploys when you push to the configured branch:

```powershell
# Make changes to index.html
# Commit and push
git add .
git commit -m "Update hero section"
git push origin main

# Site updates automatically within minutes
```

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml` for custom builds:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## 📈 Enhance Your Site

### Add Features

1. **Contact Form:**
   - Use Formspree: https://formspree.io/
   - Or Google Forms

2. **Newsletter Signup:**
   - Mailchimp
   - ConvertKit
   - EmailOctopus

3. **Live Chat:**
   - Tawk.to
   - Crisp
   - Intercom

4. **Search Functionality:**
   - Algolia DocSearch
   - Lunr.js

### Performance Optimization

1. **Use CDN:**
   ```html
   <link rel="dns-prefetch" href="https://cdn.example.com">
   ```

2. **Enable Caching:**
   ```html
   <meta http-equiv="Cache-Control" content="max-age=31536000">
   ```

3. **Lazy Load:**
   ```html
   <img loading="lazy" src="image.jpg">
   ```

---

## 🎓 Learning Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Web Performance](https://web.dev/performance/)

---

## ✅ Success!

Your ToxicGuard AI landing page is now live and accessible worldwide! 🎉

**Share your site:**
- 🐦 Twitter
- 💼 LinkedIn
- 📱 Reddit
- 👨‍💻 Dev.to
- 📧 Email signature

**Next steps:**
1. Monitor analytics
2. Gather user feedback
3. Iterate and improve
4. Add more features
5. Promote your extension

---

**Need help?** Open an issue on [GitHub](https://github.com/Life-Experimentalist/ToxicGuard_AI/issues)

**Share your success!** Tweet with #ToxicGuardAI
