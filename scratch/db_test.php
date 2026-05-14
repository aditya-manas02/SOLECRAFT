<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3308;dbname=solecraft", "root", "");
    echo "Connected successfully";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
