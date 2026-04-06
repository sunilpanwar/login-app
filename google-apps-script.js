/**
 * Google Apps Script for Login Validation
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Spreadsheet
 * 2. Name the first sheet "Users"
 * 3. Add headers in row 1: username | password
 * 4. Add user credentials in subsequent rows
 * 5. Go to Extensions > Apps Script
 * 6. Copy this code into the script editor
 * 7. Deploy as Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 8. Copy the Web App URL and paste it in index.html (SCRIPT_URL variable)
 */

// Main function to handle GET requests (to avoid CORS issues)
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    // Handle different actions
    if (action === 'getAllUsers') {
      return getAllUsers();
    }
    
    // Default: Login validation
    const username = e.parameter.username;
    const password = e.parameter.password;
    
    // Validate input
    if (!username || !password) {
      return createResponse(false, 'Username and password are required');
    }
    
    // Validate credentials
    const isValid = validateCredentials(username, password);
    
    if (isValid) {
      return createResponse(true, 'Login successful');
    } else {
      return createResponse(false, 'Invalid username or password');
    }
    
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return createResponse(false, 'Server error: ' + error.toString());
  }
}

// Alternative POST handler (if needed in future)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const username = data.username;
    const password = data.password;
    
    if (!username || !password) {
      return createResponse(false, 'Username and password are required');
    }
    
    const isValid = validateCredentials(username, password);
    
    if (isValid) {
      return createResponse(true, 'Login successful');
    } else {
      return createResponse(false, 'Invalid username or password');
    }
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse(false, 'Server error: ' + error.toString());
  }
}

/**
 * Validates user credentials against the spreadsheet
 * @param {string} username - The username to validate
 * @param {string} password - The password to validate
 * @return {boolean} - True if credentials are valid, false otherwise
 */
function validateCredentials(username, password) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');
    
    if (!sheet) {
      Logger.log('Sheet "Users" not found');
      return false;
    }
    
    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    
    // Skip header row (index 0) and check each user
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const storedUsername = row[0] ? row[0].toString().trim() : '';
      const storedPassword = row[1] ? row[1].toString().trim() : '';
      
      // Case-insensitive username comparison
      if (storedUsername.toLowerCase() === username.toLowerCase() && 
          storedPassword === password) {
        Logger.log('Valid credentials for user: ' + username);
        return true;
      }
    }
    
    Logger.log('Invalid credentials for user: ' + username);
    return false;
    
  } catch (error) {
    Logger.log('Error in validateCredentials: ' + error.toString());
    return false;
  }
}

/**
 * Creates a JSON response with CORS headers
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - The message to return
 * @return {ContentService.TextOutput} - The formatted response
 */
function createResponse(success, message) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function to verify setup
 * Run this function from the Apps Script editor to test
 */
function testValidation() {
  // Test with sample credentials
  const testUsername = 'admin';
  const testPassword = 'admin123';
  
  const result = validateCredentials(testUsername, testPassword);
  Logger.log('Test result for ' + testUsername + ': ' + result);
  
  // You can also test the full response
  const mockEvent = {
    parameter: {
      username: testUsername,
      password: testPassword
    }
  };
  
  const response = doGet(mockEvent);
  Logger.log('Full response: ' + response.getContent());
}

/**
 * Get all users from the spreadsheet (without passwords for security)
 * @return {ContentService.TextOutput} - JSON response with user list
 */
function getAllUsers() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');
    
    if (!sheet) {
      Logger.log('Sheet "Users" not found');
      return createResponseWithData(false, 'Users sheet not found', []);
    }
    
    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    
    // Skip header row and extract usernames only (not passwords for security)
    const users = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const username = row[0] ? row[0].toString().trim() : '';
      
      if (username) {
        users.push({
          id: i,
          username: username,
          // You can add more fields here if your spreadsheet has them
          // For example: email, role, createdDate, etc.
        });
      }
    }
    
    Logger.log('Retrieved ' + users.length + ' users');
    return createResponseWithData(true, 'Users retrieved successfully', users);
    
  } catch (error) {
    Logger.log('Error in getAllUsers: ' + error.toString());
    return createResponseWithData(false, 'Error retrieving users: ' + error.toString(), []);
  }
}

/**
 * Creates a JSON response with data payload
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - The message to return
 * @param {Array} data - The data to return
 * @return {ContentService.TextOutput} - The formatted response
 */
function createResponseWithData(success, message, data) {
  const response = {
    success: success,
    message: message,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Function to add a new user (optional - for future enhancement)
 * @param {string} username - The username to add
 * @param {string} password - The password to add
 */
function addUser(username, password) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');
    
    if (!sheet) {
      Logger.log('Sheet "Users" not found');
      return false;
    }
    
    // Check if user already exists
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0].toString().toLowerCase() === username.toLowerCase()) {
        Logger.log('User already exists: ' + username);
        return false;
      }
    }
    
    // Add new user
    sheet.appendRow([username, password]);
    Logger.log('User added successfully: ' + username);
    return true;
    
  } catch (error) {
    Logger.log('Error in addUser: ' + error.toString());
    return false;
  }
}