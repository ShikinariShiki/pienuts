<?php
/**
 * Authentication API Handler
 * 
 * This script handles user authentication:
 * - Login
 * - Registration
 * - Session management
 */

// Set headers for CORS and JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // In production, specify your domain
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration
$host = 'localhost';
$dbname = 'kawaii_site';
$username = 'db_username'; // Replace with actual username
$password = 'db_password'; // Replace with actual password

// Connect to database
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    sendResponse(false, 'Database connection failed: ' . $e->getMessage(), 500);
    exit;
}

// Get request path
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$endpoint = basename($path);

// Process based on endpoint
switch ($endpoint) {
    case 'login':
        handleLogin();
        break;
    case 'register':
        handleRegistration();
        break;
    case 'logout':
        handleLogout();
        break;
    default:
        sendResponse(false, 'Endpoint not found', 404);
        break;
}

/**
 * Handle user login
 */
function handleLogin() {
    global $pdo;
    
    // Only accept POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse(false, 'Method not allowed', 405);
        return;
    }
    
    try {
        // Get JSON data from request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($data['username']) || !isset($data['password'])) {
            sendResponse(false, 'Username and password are required', 400);
            return;
        }
        
        $username = $data['username'];
        $password = $data['password'];
        
        // Get user from database
        $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE username = :username");
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->execute();
        
        $user = $stmt->fetch();
        
        // Check if user exists and password is correct
        if (!$user || !password_verify($password, $user['password'])) {
            sendResponse(false, 'Invalid username or password', 401);
            return;
        }
        
        // Generate session token
        $sessionId = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));
        $ipAddress = $_SERVER['REMOTE_ADDR'];
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        
        // Store session in database
        $stmt = $pdo->prepare("INSERT INTO sessions (id, user_id, ip_address, user_agent, expires_at) 
                              VALUES (:id, :user_id, :ip_address, :user_agent, :expires_at)");
        $stmt->bindParam(':id', $sessionId, PDO::PARAM_STR);
        $stmt->bindParam(':user_id', $user['id'], PDO::PARAM_INT);
        $stmt->bindParam(':ip_address', $ipAddress, PDO::PARAM_STR);
        $stmt->bindParam(':user_agent', $userAgent, PDO::PARAM_STR);
        $stmt->bindParam(':expires_at', $expiresAt, PDO::PARAM_STR);
        $stmt->execute();
        
        // Return session token and user info
        $userData = [
            'id' => $user['id'],
            'username' => $user['username'],
            'session_id' => $sessionId,
            'expires_at' => $expiresAt
        ];
        
        sendResponse(true, 'Login successful', 200, $userData);
    } catch (PDOException $e) {
        sendResponse(false, 'Login failed: ' . $e->getMessage(), 500);
    }
}

/**
 * Handle user registration
 */
function handleRegistration() {
    global $pdo;
    
    // Only accept POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse(false, 'Method not allowed', 405);
        return;
    }
    
    try {
        // Get JSON data from request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
            sendResponse(false, 'Username, email, and password are required', 400);
            return;
        }
        
        $username = $data['username'];
        $email = $data['email'];
        $password = $data['password'];
        
        // Validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendResponse(false, 'Invalid email format', 400);
            return;
        }
        
        // Check if username or email already exists
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = :username OR email = :email");
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();
        
        if ($stmt->fetchColumn() > 0) {
            sendResponse(false, 'Username or email already exists', 409);
            return;
        }
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert new user
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)");
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
        $stmt->execute();
        
        // Get the ID of the inserted user
        $userId = $pdo->lastInsertId();
        
        // Generate session token
        $sessionId = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));
        $ipAddress = $_SERVER['REMOTE_ADDR'];
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        
        // Store session in database
        $stmt = $pdo->prepare("INSERT INTO sessions (id, user_id, ip_address, user_agent, expires_at) 
                              VALUES (:id, :user_id, :ip_address, :user_agent, :expires_at)");
        $stmt->bindParam(':id', $sessionId, PDO::PARAM_STR);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':ip_address', $ipAddress, PDO::PARAM_STR);
        $stmt->bindParam(':user_agent', $userAgent, PDO::PARAM_STR);
        $stmt->bindParam(':expires_at', $expiresAt, PDO::PARAM_STR);
        $stmt->execute();
        
        // Return session token and user info
        $userData = [
            'id' => $userId,
            'username' => $username,
            'email' => $email,
            'session_id' => $sessionId,
            'expires_at' => $expiresAt
        ];
        
        sendResponse(true, 'Registration successful', 201, $userData);
    } catch (PDOException $e) {
        sendResponse(false, 'Registration failed: ' . $e->getMessage(), 500);
    }
}

/**
 * Handle user logout
 */
function handleLogout() {
    global $pdo;
    
    // Only accept POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse(false, 'Method not allowed', 405);
        return;
    }
    
    try {
        // Get JSON data from request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate session ID
        if (!isset($data['session_id'])) {
            sendResponse(false, 'Session ID is required', 400);
            return;
        }
        
        $sessionId = $data['session_id'];
        
        // Delete session from database
        $stmt = $pdo->prepare("DELETE FROM sessions WHERE id = :id");
        $stmt->bindParam(':id', $sessionId, PDO::PARAM_STR);
        $stmt->execute();
        
        sendResponse(true, 'Logout successful', 200);
    } catch (PDOException $e) {
        sendResponse(false, 'Logout failed: ' . $e->getMessage(), 500);
    }
}

/**
 * Send a JSON response
 * 
 * @param bool $success Whether the request was successful
 * @param string $message Response message
 * @param int $statusCode HTTP status code
 * @param array $data Optional data to include in the response
 */
function sendResponse($success, $message, $statusCode, $data = null) {
    http_response_code($statusCode);
    
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response);
    exit;
}
