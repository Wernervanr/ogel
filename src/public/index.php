<?php

declare(strict_types=1);

use Dotenv\Dotenv;
use Slim\App;

require_once '../../vendor/autoload.php';

$dotenv = new Dotenv(__DIR__ . '/../../');
$dotenv->load();

// Create our Slim App
$configuration = [
    'settings' => [
        'displayErrorDetails' => true
    ]
];
$app = new App($configuration);

// Define our routes
$app->get('/', 'App\Controller\MachinesStatusController:homepage');
$app->get('/machines/{MachineName}/', 'App\Controller\MachinesStatusController:list');

// Execute the current request
$app->run();