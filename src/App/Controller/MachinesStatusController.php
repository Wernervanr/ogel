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

    public function list(Request $request, Response $response, array $args)
    {
        $machineName = $args['MachineName'];

        $machineModel = new MachineModel();
        $machines = $machineModel->getMachine($machineName);

        return $response->withJson($machines,201);
    }
}