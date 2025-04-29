<?php
/**
 * Messages API Handler
 * 
 * This script handles all message-related API requests including:
 * - Retrieving messages
 * - Storing new messages
 * - Deleting messages
 * - User authentication for messages
 */

// Set headers for CORS and JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // In production, specify your domain
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
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

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Process based on request method
switch ($method) {
    case 'GET':
        getMessages();
        break;
    case 'POST':
        addMessage();
        break;
    case 'DELETE':
        deleteMessage();
        break;
    default:
        sendResponse(false, 'Method not allowed', 405);
        break;
}

/**
 * Get messages from the database
 * Optional query parameters:
 * - limit: Maximum number of messages to return
 * - user_id: Filter messages by user ID
 */
function getMessages() {
    global $pdo;
    
    try {
        // Get query parameters
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
        
        // Build query
        $query = "SELECT m.id, m.message, m.created_at, 
                 COALESCE(u.username, 'Anonymous') as username
                 FROM messages m
                 LEFT JOIN users u ON m.user_id = u.id";
        
        // Add user filter if specified
        if ($userId) {
            $query .= " WHERE m.user_id = :user_id";
        }
        
        // Add order and limit
        $query .= " ORDER BY m.created_at DESC LIMIT :limit";
        
        // Prepare and execute query
        $stmt = $pdo->prepare($query);
        
        if ($userId) {
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        }
        
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        // Fetch results
        $messages = $stmt->fetchAll();
        
        // Format dates for display
        foreach ($messages as &$message) {
            $date = new DateTime($message['created_at']);
            $message['formatted_date'] = $date->format('Y-m-d');
            $message['time_ago'] = getTimeAgo($date);
        }
        
        sendResponse(true, 'Messages retrieved successfully', 200, $messages);
    } catch (PDOException $e) {
        sendResponse(false, 'Failed to retrieve messages: ' . $e->getMessage(), 500);
    }
}

/**
 * Add a new message to the database
 */
function addMessage() {
    global $pdo;
    
    try {
        // Get JSON data from request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate message
        if (!isset($data['message']) || empty(trim($data['message']))) {
            sendResponse(false, 'Message is required', 400);
            return;
        }
        
        // Sanitize message
        $message = trim($data['message']);
        
        // Get user ID if available
        $userId = isset($data['user_id']) ? $data['user_id'] : null;
        
        // Prepare insert statement
        if ($userId) {
            $stmt = $pdo->prepare("INSERT INTO messages (message, user_id, created_at) VALUES (:message, :user_id, NOW())");
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        } else {
            $stmt = $pdo->prepare("INSERT INTO messages (message, created_at) VALUES (:message, NOW())");
        }
        
        $stmt->bindParam(':message', $message, PDO::PARAM_STR);
        $stmt->execute();
        
        // Get the ID of the inserted message
        $messageId = $pdo->lastInsertId();
        
        // Get the inserted message
        $stmt = $pdo->prepare("SELECT id, message, created_at FROM messages WHERE id = :id");
        $stmt->bindParam(':id', $messageId, PDO::PARAM_INT);
        $stmt->execute();
        $newMessage = $stmt->fetch();
        
        // Format date
        $date = new DateTime($newMessage['created_at']);
        $newMessage['formatted_date'] = $date->format('Y-m-d');
        $newMessage['time_ago'] = getTimeAgo($date);
        
        sendResponse(true, 'Message added successfully', 201, $newMessage);
    } catch (PDOException $e) {
        sendResponse(false, 'Failed to add message: ' . $e->getMessage(), 500);
    }
}

/**
 * Delete a message from the database
 * Requires message ID and user authentication
 */
function deleteMessage() {
    global $pdo;
    
    try {
        // Get JSON data from request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate message ID
        if (!isset($data['id']) || empty($data['id'])) {
            sendResponse(false, 'Message ID is required', 400);
            return;
        }
        
        $messageId = $data['id'];
        $userId = isset($data['user_id']) ? $data['user_id'] : null;
        
        // Check if user is authorized to delete this message
        // In a real app, you would check if the user is the owner or an admin
        if ($userId) {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM messages WHERE id = :id AND user_id = :user_id");
            $stmt->bindParam(':id', $messageId, PDO::PARAM_INT);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
            
            if ($stmt->fetchColumn() == 0) {
                sendResponse(false, 'Unauthorized to delete this message', 403);
                return;
            }
        }
        
        // Delete the message
        $stmt = $pdo->prepare("DELETE FROM messages WHERE id = :id");
        $stmt->bindParam(':id', $messageId, PDO::PARAM_INT);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            sendResponse(true, 'Message deleted successfully', 200);
        } else {
            sendResponse(false, 'Message not found', 404);
        }
    } catch (PDOException $e) {
        sendResponse(false, 'Failed to delete message: ' . $e->getMessage(), 500);
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

/**
 * Get a human-readable time difference
 * 
 * @param DateTime $date The date to compare
 * @return string Human-readable time difference
 */
function getTimeAgo(DateTime $date) {
    $now = new DateTime();
    $diff = $now->diff($date);
    
    if ($diff->y > 0) {
        return $diff->y . ' year' . ($diff->y > 1 ? 's' : '') . ' ago';
    }
    
    if ($diff->m > 0) {
        return $diff->m . ' month' . ($diff->m > 1 ? 's' : '') . ' ago';
    }
    
    if ($diff->d > 0) {
        return $diff->d . ' day' . ($diff->d > 1 ? 's' : '') . ' ago';
    }
    
    if ($diff->h > 0) {
        return $diff->h . ' hour' . ($diff->h > 1 ? 's' : '') . ' ago';
    }
    
    if ($diff->i > 0) {
        return $diff->i . ' minute' . ($diff->i > 1 ? 's' : '') . ' ago';
    }
    
    return 'just now';
}
