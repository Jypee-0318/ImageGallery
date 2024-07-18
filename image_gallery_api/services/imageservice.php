<?php
class ImageService
{
    private $conn;
    private $table_name = "images";
    private $upload_dir;

    public function __construct($db)
    {
        $this->conn = $db;
        $this->upload_dir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/';
    }

    public function uploadImage($file)
    {
        // Validate file type and size
        $fileName = htmlspecialchars(strip_tags($file['name']));
        $filePath = $this->upload_dir . $fileName;
        $relativePath = $fileName;
        $uploadDate = date('Y-m-d H:i:s');

        $imageFileType = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $validTypes = ["jpg", "png", "jpeg", "gif"];
        if (!in_array($imageFileType, $validTypes)) {
            return json_encode(["error" => "Invalid file type. Only " . implode(", ", $validTypes) . " files are allowed."], 400);
        }

        if ($file['size'] > 5000000) {
            return json_encode(["error" => "File size is too large. Maximum file size is 5 MB."], 400);
        }

        if (file_exists($filePath)) {
            return json_encode(["error" => "File already exists."], 400);
        }

        $check = getimagesize($file['tmp_name']);
        if ($check === false) {
            return json_encode(["error" => "File is not an image."], 400);
        }

        // Move uploaded file and insert into database
        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            $query = "INSERT INTO " . $this->table_name . " (file_name, file_path, upload_date) VALUES (:file_name, :file_path, :upload_date)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":file_name", $fileName);
            $stmt->bindParam(":file_path", $relativePath);
            $stmt->bindParam(":upload_date", $uploadDate);

            if ($stmt->execute()) {
                return json_encode(["message" => "Image was uploaded.", "file_path" => $relativePath], 201);
            } else {
                error_log("Database insert failed");
                return json_encode(["message" => "Unable to upload image."], 503);
            }
        } else {
            error_log("Failed to move uploaded file");
            return json_encode(["message" => "Failed to move uploaded file."], 500);
        }
    }

    public function getImages()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $images_arr = ["records" => []];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $images_arr["records"][] = $row;
        }

        return json_encode($images_arr);
    }

    public function deleteImage($id)
    {
        $query = "SELECT file_path FROM " . $this->table_name . " WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $filePath = $this->upload_dir . $row['file_path'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $query = "DELETE FROM " . $this->table_name . " WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            return json_encode(["message" => "Image deleted successfully."], 200);
        } else {
            error_log("Database delete failed");
            return json_encode(["message" => "Unable to delete image."], 503);
        }
    }
}
?>
