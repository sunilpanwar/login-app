/**
 * Google Apps Script for Login Validation and Employee Management
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Spreadsheet
 * 2. Create two sheets:
 *    - Sheet 1: "Users" with headers: username | password
 *    - Sheet 2: "Employees" with headers: name | phone | address | salary | joinDate
 * 3. Add user credentials in the Users sheet
 * 4. Go to Extensions > Apps Script
 * 5. Copy this code into the script editor
 * 6. Deploy as Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy the Web App URL and paste it in config.js (SCRIPT_URL)
 */

// Main function to handle GET requests (to avoid CORS issues)
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    // Handle different actions
    if (action === 'getAllUsers') {
      return getAllUsers();
    }
    
    if (action === 'addUser') {
      const username = e.parameter.username;
      const password = e.parameter.password;
      return addUserViaAPI(username, password);
    }
    
    if (action === 'getAllEmployees') {
      return getAllEmployees();
    }
    
    if (action === 'addEmployee') {
      const name = e.parameter.name;
      const phone = e.parameter.phone;
      const address = e.parameter.address;
      const salary = e.parameter.salary;
      const joinDate = e.parameter.joinDate;
      return addEmployeeViaAPI(name, phone, address, salary, joinDate);
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
 * API endpoint to add a new user
 * @param {string} username - The username to add
 * @param {string} password - The password to add
 * @return {ContentService.TextOutput} - JSON response
 */
function addUserViaAPI(username, password) {
  try {
    // Validate input
    if (!username || !password) {
      return createResponse(false, 'Username and password are required');
    }
    
    // Validate username length
    if (username.trim().length < 3) {
      return createResponse(false, 'Username must be at least 3 characters long');
    }
    
    // Validate password length
    if (password.length < 6) {
      return createResponse(false, 'Password must be at least 6 characters long');
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');
    
    if (!sheet) {
      Logger.log('Sheet "Users" not found');
      return createResponse(false, 'Users sheet not found');
    }
    
    // Check if user already exists
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().toLowerCase() === username.toLowerCase()) {
        Logger.log('User already exists: ' + username);
        return createResponse(false, 'Username already exists. Please choose a different username.');
      }
    }
    
    // Add new user
    sheet.appendRow([username.trim(), password]);
    Logger.log('User added successfully: ' + username);
    return createResponse(true, 'User registered successfully!');
    
  } catch (error) {
    Logger.log('Error in addUserViaAPI: ' + error.toString());
    return createResponse(false, 'Error registering user: ' + error.toString());
  }
}

/**
 * Function to add a new user (for internal use)
 * @param {string} username - The username to add
 * @param {string} password - The password to add
 * @return {boolean} - True if successful, false otherwise
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
      if (data[i][0] && data[i][0].toString().toLowerCase() === username.toLowerCase()) {
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

/**
 * Get all employees from the spreadsheet
 * @return {ContentService.TextOutput} - JSON response with employee list
 */
function getAllEmployees() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Employees');
    
    if (!sheet) {
      Logger.log('Sheet "Employees" not found');
      return createResponseWithData(false, 'Employees sheet not found. Please create a sheet named "Employees" with headers: name | phone | address | salary | joinDate', []);
    }
    
    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    
    // Skip header row and extract employee data
    const employees = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const name = row[0] ? row[0].toString().trim() : '';
      
      if (name) {
        employees.push({
          id: i,
          name: name,
          phone: row[1] ? row[1].toString().trim() : '',
          address: row[2] ? row[2].toString().trim() : '',
          salary: row[3] ? row[3].toString() : '0',
          joinDate: row[4] ? row[4].toString() : ''
        });
      }
    }
    
    Logger.log('Retrieved ' + employees.length + ' employees');
    return createResponseWithData(true, 'Employees retrieved successfully', employees);
    
  } catch (error) {
    Logger.log('Error in getAllEmployees: ' + error.toString());
    return createResponseWithData(false, 'Error retrieving employees: ' + error.toString(), []);
  }
}

/**
 * API endpoint to add a new employee
 * @param {string} name - Employee name
 * @param {string} phone - Employee phone number
 * @param {string} address - Employee address
 * @param {string} salary - Employee salary
 * @param {string} joinDate - Employee join date
 * @return {ContentService.TextOutput} - JSON response
 */
function addEmployeeViaAPI(name, phone, address, salary, joinDate) {
  try {
    // Validate input
    if (!name || !phone || !address || !salary) {
      return createResponse(false, 'All fields (name, phone, address, salary) are required');
    }
    
    // Validate phone number length
    if (phone.length < 10 || phone.length > 15) {
      return createResponse(false, 'Phone number must be between 10-15 digits');
    }
    
    // Validate salary
    const salaryNum = parseFloat(salary);
    if (isNaN(salaryNum) || salaryNum < 0) {
      return createResponse(false, 'Salary must be a valid positive number');
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Employees');
    
    if (!sheet) {
      Logger.log('Sheet "Employees" not found');
      return createResponse(false, 'Employees sheet not found. Please create a sheet named "Employees"');
    }
    
    // Set default join date if not provided
    const finalJoinDate = joinDate || new Date().toISOString().split('T')[0];
    
    // Add new employee
    sheet.appendRow([name.trim(), phone.trim(), address.trim(), salaryNum, finalJoinDate]);
    Logger.log('Employee added successfully: ' + name);
    return createResponse(true, 'Employee added successfully!');
    
  } catch (error) {
    Logger.log('Error in addEmployeeViaAPI: ' + error.toString());
    return createResponse(false, 'Error adding employee: ' + error.toString());
  }
}

/**
 * Test function for employee operations
 * Run this function from the Apps Script editor to test
 */
function testEmployeeOperations() {
  // Test adding an employee
  const testEmployee = {
    name: 'John Doe',
    phone: '1234567890',
    address: '123 Main St, City, Country',
    salary: '50000',
    joinDate: '2024-01-01'
  };
  
  const addResult = addEmployeeViaAPI(
    testEmployee.name,
    testEmployee.phone,
    testEmployee.address,
    testEmployee.salary,
    testEmployee.joinDate
  );
  Logger.log('Add employee result: ' + addResult.getContent());
  
  // Test getting all employees
  const getAllResult = getAllEmployees();
  Logger.log('Get all employees result: ' + getAllResult.getContent());
}