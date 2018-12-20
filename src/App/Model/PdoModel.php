<?php

declare(strict_types=1);

namespace App\Model;

use PDO;

abstract class PdoModel
{
    protected static $connection;

    protected function getConnection() : PDO
    {
        // Singleton pattern to use just 1 DB connection for all database calls
        if (!self::$connection) {
            self::$connection = new PDO('mysql:host=' . getenv('DB_HOST') . ';dbname=' . getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'));
            self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        }

        return self::$connection;
    }
}