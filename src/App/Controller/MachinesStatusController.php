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

    public function machineData(Request $request, Response $response, array $args)
    {
        $machineName = $args['MachineName'];

        $machineModel = new MachineModel();
        $lastDateInDb = $machineModel->getLastDate();
        $machines = $machineModel->getMachineData($machineName, $lastDateInDb);

        return $response->withJson($machines,201);
    }

    public function machineRuntime(Request $request, Response $response, array $args)
    {
        $machineName = $args['MachineName'];

        $machineModel = new MachineModel();
        $lastDateInDb = $machineModel->getLastDate();
        $machineRuntime = $machineModel->getMachineRuntime($machineName, $lastDateInDb);

        $totalDownTime = 0;
        for ($i = 0; $i < count($machineRuntime); $i++) {
            if ($machineRuntime[($i +1)]['isrunning'] > $machineRuntime[($i)]['isrunning']) {
                $convertedTimeStringA = strtotime($machineRuntime[$i]['datetime']);
                $convertedTimeStringB = strtotime($machineRuntime[($i + 1)]['datetime']);

                $downtime = $convertedTimeStringB - $convertedTimeStringA;
                $totalDownTime += $downtime;

            } else if ($machineRuntime[$i]['isrunning'] == 0 && end($machineRuntime) == $machineRuntime[$i]) {
                $convertedTimeStringA = strtotime($machineRuntime[$i]['datetime']);
                $convertedTimeStringB = strtotime('+24 hour', strtotime($lastDateInDb));

                $downtime = $convertedTimeStringB - $convertedTimeStringA;
                $totalDownTime += $downtime;
            }
        }

        return $response->withJson($totalDownTime,201);
    }

    public function productionPerHour(Request $request, Response $response, array $args)
    {
        $machineName = $args['MachineName'];

        $machineModel = new MachineModel();
        $lastDateInDb = $machineModel->getLastDate();

        $hourlyProductionArray = [];

        for ($i = 0; $i < 24; $i++) {
            $parsedLastDateInDb = strtotime($lastDateInDb);
            $parsedLastDatePlusOneHour = strtotime('1 hour', $parsedLastDateInDb);
            $lastDatePlusOneHour = date('Y-m-d H:i:s', $parsedLastDatePlusOneHour);

            $netProductionPerHour = 0;

            $productionWithinHour = $machineModel->getMachineDataPerHour($machineName, $lastDateInDb, 'PRODUCTION', $lastDatePlusOneHour);
            foreach ($productionWithinHour as $productionPerTimeUnit) {
                $netProductionPerHour += $productionPerTimeUnit['value'];
            }

            $scrapWithinHour = $machineModel->getMachineDataPerHour($machineName, $lastDateInDb, 'SCRAP', $lastDatePlusOneHour);
            foreach ($scrapWithinHour as $scrapPerTimeUnit) {
                $netProductionPerHour -= $scrapPerTimeUnit['value'];
            }

            $lastDateInDb = $lastDatePlusOneHour;

            array_push($hourlyProductionArray, $netProductionPerHour);
        }

        return $response->withJson($hourlyProductionArray,201);
    }
}