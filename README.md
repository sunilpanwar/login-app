# Login App with Google Apps Script

A simple login application that validates user credentials using Google Apps Script and Google Sheets as a backend database. The frontend is hosted on GitHub Pages.

## 🎯 Project Overview

This project demonstrates:
- HTML/CSS/JavaScript frontend
- Google Apps Script as backend API
- Google Sheets as database
- Session management with sessionStorage
- CORS-friendly API implementation
- GitHub Pages deployment

## 📁 Project Structure

```
login-app/
├── index.html              # Login page
├── landing.html            # Dashboard/Landing page after login
├── styles.css              # Styling for all pages
├── google-apps-script.js   # Backend script for Google Apps Script
├── SETUP-INSTRUCTIONS.md   # Detailed setup guide
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- A Google account
- A GitHub account
- Basic knowledge of HTML/CSS/JavaScript

### Setup Steps

1. **Set up Google Sheets and Apps Script**
   - Follow the detailed instructions in [`SETUP-INSTRUCTIONS.md`](SETUP-INSTRUCTIONS.md)
   - Create a Google Spreadsheet with user credentials
   - Deploy the Apps Script as a Web App
   - Copy the Web App URL

2. **Update the HTML file**
   - Open [`index.html`](index.html)
   - Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your Web App URL

3. **Deploy to GitHub Pages**
   - Create a new GitHub repository
   - Push all files to the repository
   - Go to repository Settings → Pages
   - Select branch (usually `main`) and root folder
   - Save and wait for deployment
   - Access your app at: `https://yourusername.github.io/repository-name/`

## 🔧 Configuration

### Google Sheets Structure

Your spreadsheet should have a sheet named "Users" with this structure:

| username | password |
|----------|----------|
| admin    | admin123 |
| user1    | pass123  |

### Sample Credentials

For testing purposes, you can use:
- Username: `admin` / Password: `admin123`
- Username: `user1` / Password: `pass123`

## 📝 How It Works

1. **User enters credentials** on the login page ([`index.html`](index.html))
2. **JavaScript sends request** to Google Apps Script Web App
3. **Apps Script validates** credentials against Google Sheets
4. **Response is sent back** with success/failure status
5. **On success**, user is redirected to landing page ([`landing.html`](landing.html))
6. **Session is maintained** using browser's sessionStorage

## 🔐 Security Considerations

⚠️ **This is a learning project and NOT production-ready!**

Current limitations:
- Passwords stored in plain text
- No password hashing
- Basic session management
- No rate limiting
- No HTTPS enforcement

For production use, implement:
- Password hashing (bcrypt, Argon2)
- Secure session tokens (JWT)
- HTTPS only
- Rate limiting
- Input validation and sanitization
- CSRF protection
- 2-factor authentication

## 🌐 Deploying to GitHub Pages

### Method 1: Using Git Command Line

```bash
# Navigate to your project directory
cd /Users/c2096299/Documents/learningProjects/login-app

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Login app with Google Apps Script"

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/yourusername/login-app.git

# Push to GitHub
git push -u origin main
```

### Method 2: Using GitHub Desktop

1. Open GitHub Desktop
2. File → Add Local Repository
3. Select the `login-app` folder
4. Publish repository to GitHub
5. Enable GitHub Pages in repository settings

### Accessing Your App

After deployment, your app will be available at:
```
https://yourusername.github.io/login-app/
```

## 🎨 Customization

### Changing Colors
Edit [`styles.css`](styles.css) and modify the gradient colors:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adding More Fields
1. Update the HTML form in [`index.html`](index.html)
2. Modify the Google Sheets structure
3. Update the validation logic in [`google-apps-script.js`](google-apps-script.js)

### Customizing Landing Page
Edit [`landing.html`](landing.html) to add:
- User profile information
- Dashboard widgets
- Navigation menu
- Additional features

## 🐛 Troubleshooting

### Login not working?
1. Check browser console for errors (F12)
2. Verify the Apps Script URL is correct in [`index.html`](index.html)
3. Ensure Apps Script is deployed with "Anyone" access
4. Check Google Sheets has correct structure and data

### CORS errors?
- The script uses GET requests to avoid CORS
- Ensure deployment settings: "Execute as: Me" and "Who has access: Anyone"

### Can't access after GitHub Pages deployment?
- Wait 2-3 minutes for deployment to complete
- Check repository Settings → Pages for deployment status
- Ensure all files are in the root directory

## 📚 Learning Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🔄 Future Enhancements

Planned improvements:
- [ ] Password hashing
- [ ] User registration page
- [ ] Forgot password functionality
- [ ] Email verification
- [ ] User roles and permissions
- [ ] Activity logging
- [ ] Profile management
- [ ] Remember me functionality
- [ ] Session timeout

## 📄 License

This project is open source and available for learning purposes.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 📧 Support

For issues or questions, please refer to [`SETUP-INSTRUCTIONS.md`](SETUP-INSTRUCTIONS.md) for detailed troubleshooting steps.

---

**Note**: This is a learning project. For production applications, implement proper security measures and use established authentication frameworks.