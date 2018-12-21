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
$app->get('/machines', 'App\Controller\MachinesStatusController:machineNames');
$app->get('/machines/{MachineName}', 'App\Controller\MachinesStatusController:machineData');
$app->get('/machines/runtime/{MachineName}', 'App\Controller\MachinesStatusController:machineRunTime');
$app->get('/machines/produceperhour/{MachineName}', 'App\Controller\MachinesStatusController:productionPerHour');

// Execute the current request
$app->run();