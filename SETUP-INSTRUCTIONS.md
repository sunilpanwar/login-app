# Google Sheets Setup Instructions

Follow these steps to set up your Google Spreadsheet for user authentication:

## Step 1: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click on **"+ Blank"** to create a new spreadsheet
3. Name your spreadsheet (e.g., "Login App Users")

## Step 2: Set Up Users Sheet

1. Rename the first sheet to **"Users"** (right-click on the sheet tab → Rename)
2. In the first row, add the following headers:
   - Cell A1: `username`
   - Cell B1: `password`

3. Add sample user credentials in the rows below:
   
   | username | password |
   |----------|----------|
   | admin    | admin123 |
   | user1    | pass123  |
   | demo     | demo123  |

   Example:
   ```
   A2: admin      B2: admin123
   A3: user1      B3: pass123
   A4: demo       B4: demo123
   ```

## Step 3: Set Up Google Apps Script

1. In your Google Spreadsheet, go to **Extensions** → **Apps Script**
2. Delete any existing code in the script editor
3. Copy the entire content from [`google-apps-script.js`](google-apps-script.js) file
4. Paste it into the Apps Script editor
5. Click **Save** (💾 icon) and give your project a name (e.g., "Login Validator")

## Step 4: Test the Script (Optional but Recommended)

1. In the Apps Script editor, select the `testValidation` function from the dropdown
2. Click **Run** (▶️ icon)
3. You may need to authorize the script:
   - Click **Review Permissions**
   - Choose your Google account
   - Click **Advanced** → **Go to [Your Project Name] (unsafe)**
   - Click **Allow**
4. Check the **Execution log** at the bottom to see if the test passed

## Step 5: Deploy as Web App

1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type" and choose **Web app**
3. Configure the deployment:
   - **Description**: "Login API v1" (or any description)
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. You may need to authorize again - follow the same steps as in Step 4
6. **IMPORTANT**: Copy the **Web app URL** that appears (it will look like: `https://script.google.com/macros/s/AKfycby.../exec`)

## Step 6: Update Your HTML File

1. Open [`index.html`](index.html)
2. Find this line (around line 33):
   ```javascript
   const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` with your Web app URL:
   ```javascript
   const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
4. Save the file

## Step 7: Test Your Login System

1. Open [`index.html`](index.html) in a web browser
2. Try logging in with one of your test credentials:
   - Username: `admin`
   - Password: `admin123`
3. If successful, you should be redirected to the landing page

## Troubleshooting

### Issue: "Error connecting to server"
- **Solution**: Make sure you deployed the script with "Who has access: Anyone"
- Check that the Web app URL is correctly copied in [`index.html`](index.html)

### Issue: "Invalid credentials" even with correct password
- **Solution**: Check your Google Sheet for extra spaces in username/password cells
- Make sure the sheet is named exactly "Users" (case-sensitive)

### Issue: Script authorization problems
- **Solution**: Go to Apps Script editor → Run → testValidation
- Complete the authorization process
- Then try deploying again

### Issue: CORS errors in browser console
- **Solution**: The script uses GET requests to avoid CORS issues
- Make sure you're using the latest version of [`index.html`](index.html)
- The Web app must be deployed with "Execute as: Me" and "Who has access: Anyone"

## Adding New Users

To add new users to your system:

1. Open your Google Spreadsheet
2. Add a new row with username and password
3. No need to redeploy the script - changes are immediate!

Example:
```
A5: newuser     B5: newpass123
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Passwords are stored in plain text** - This is for learning purposes only
2. For production use, you should:
   - Hash passwords before storing
   - Use HTTPS for all connections
   - Implement rate limiting
   - Add session management
   - Use OAuth or other secure authentication methods

## Next Steps for Enhancement

- Add password hashing
- Implement user registration
- Add "Forgot Password" functionality
- Create user roles and permissions
- Add session timeout
- Implement 2-factor authentication