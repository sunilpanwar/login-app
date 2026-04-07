/**
 * Configuration file for the Login App
 * 
 * IMPORTANT: Update the SCRIPT_URL with your Google Apps Script Web App URL
 * After deploying your Google Apps Script, copy the Web App URL and paste it below.
 * 
 * This URL will be used across all pages (index.html, landing.html, register.html)
 */

const CONFIG = {
    // Replace this with your actual Google Apps Script Web App URL
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzO6wqGHUYUpKLbGnr7mcP1nHNR8YZVd3kjMtv2zPWWAFTgCDrJNFRpkUHXWwdJH6mg/exec',
    
    // You can add more configuration options here as needed
    // For example:
    // APP_NAME: 'My Login App',
    // VERSION: '1.0.0',
    // etc.
};

// Make CONFIG available globally
window.CONFIG = CONFIG;