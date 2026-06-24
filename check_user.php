<?php
/*
|--------------------------------------------------------------------------
| check_user.php
|--------------------------------------------------------------------------
| Simple PHP endpoint to simulate username availability checks.
| Replace the sample array with a database lookup in a real project.
*/

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        'message' => 'Method Not Allowed'
    ]);
    exit;
}

$existingUsers = [
    'admin',
    'john_doe',
    'shruti',
    'intern2026',
    'authportal',
    'demo_user'
];

$username = isset($_GET['username']) ? trim($_GET['username']) : '';

if ($username === '') {
    echo json_encode([
        'available' => false,
        'message' => 'Username is required.'
    ]);
    exit;
}

if (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username)) {
    echo json_encode([
        'available' => false,
        'message' => 'Use 3-20 letters, numbers, or underscores only.'
    ]);
    exit;
}

$isAvailable = !in_array(strtolower($username), array_map('strtolower', $existingUsers), true);

echo json_encode([
    'available' => $isAvailable,
    'message' => $isAvailable ? 'Username Available' : 'Username Already Exists'
]);
