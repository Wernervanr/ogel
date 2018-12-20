<?php

declare(strict_types=1);

namespace App\Controller;

use App\Model\MachineModel;
use Slim\Http\Request;
use Slim\Http\Response;

class MachinesStatusController extends BaseController
{

    public function homepage(Request $request, Response $response, array $args)
    {
        $viewModel = [
            'pageTitle' => 'Machines',
        ];

        return $this->getViewRenderer()->render($response, 'Dashboard/list.php', $viewModel)->withStatus(200);
    }

    public function machineNames(Request $request, Response $response, array $args)
    {
        $machineModel = new MachineModel();
        $machineNames = $machineModel->getMachineNames();

        return $response->withJson($machineNames,201);
    }

    public function list(Request $request, Response $response, array $args)
    {
        $machineName = $args['MachineName'];

        $machineModel = new MachineModel();
        $lastDateInDb = $machineModel->getLastDate();
        $machines = $machineModel->getMachine($machineName, $lastDateInDb);

        return $response->withJson($machines,201);
    }
}