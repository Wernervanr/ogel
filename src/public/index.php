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
$app->get('/', 'App\Controller\MachineController:homepage');
$app->get('/machines', 'App\Controller\MachineController:machineNames');
$app->get('/machines/{MachineName}', 'App\Controller\MachineController:machineData');
$app->get('/machines/runtime/{MachineName}', 'App\Controller\MachineController:machineRunTime');
$app->get('/machines/produceperhour/{MachineName}', 'App\Controller\MachineController:productionPerHour');

// Execute the current request
$app->run();