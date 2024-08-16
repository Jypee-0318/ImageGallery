<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/services/imageservice.php';

$db = (new Connection())->connect();
$imageService = new ImageService($db);

$method = $_SERVER['REQUEST_METHOD'];
$url = $_GET['request'] ?? '';
$request = explode('/', trim($url, '/'));

switch ($method) {
    case 'GET':
        switch ($request[0]) {
            case 'images':
                echo $imageService->getImages();
                break;
            default:
                http_response_code(404);
                echo json_encode(["error" => "Endpoint not found"]);
        }
        break;

    case 'POST':
        switch ($request[0]) {
            case 'upload':
                $file = $_FILES['file'] ?? null;
                if ($file) {
                    echo $imageService->uploadImage($file);
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "Invalid request data"]);
                }
                break;
            default:
                http_response_code(404);
                echo json_encode(["error" => "Endpoint not found"]);
        }
        break;

    case 'DELETE':
        switch ($request[0]) {
            case 'delete':
                $id = $request[1] ?? null; // Extract the id from the URL path
                if ($id) {
                    echo $imageService->deleteImage($id);
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "Invalid request data"]);
                }
                break;
            default:
                http_response_code(404);
                echo json_encode(["error" => "Endpoint not found"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        break;
}
?>
