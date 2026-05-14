<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3308', 'root', '');
    $pdo->exec('CREATE DATABASE IF NOT EXISTS solecraft');
    echo "Database created successfully\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
