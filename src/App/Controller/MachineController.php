<?php

declare(strict_types=1);

namespace App\Controller;

use App\Model\MachineModel;
use Slim\Http\Request;
use Slim\Http\Response;

class MachineController extends BaseController
{

    public function homePage(Request $request, Response $response, array $args)
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
        $_24HoursBeforeLastDateInDb = $machineModel->getLastDateMinus24Hours();
        $machine = $machineModel->getMachineData($machineName, $_24HoursBeforeLastDateInDb);

        return $response->withJson($machine,201);
    }

    public function machineRuntime(Request $request, Response $response, array $args)
    {
        $machineName = $args['MachineName'];

        $machineModel = new MachineModel();
        $_24HoursBeforeLastDateInDb = $machineModel->getLastDateMinus24Hours();
        $machineRuntime = $machineModel->getMachineRuntime($machineName, $_24HoursBeforeLastDateInDb);

        $totalDownTime = 0;
        for ($i = 0; $i < count($machineRuntime); $i++) {
            if ($machineRuntime[($i +1)]['isrunning'] > $machineRuntime[($i)]['isrunning']) {
                $convertedTimeStringA = strtotime($machineRuntime[$i]['datetime']);
                $convertedTimeStringB = strtotime($machineRuntime[($i + 1)]['datetime']);

                $downtime = $convertedTimeStringB - $convertedTimeStringA;
                $totalDownTime += $downtime;

            } else if ($machineRuntime[$i]['isrunning'] == 0 && end($machineRuntime) == $machineRuntime[$i]) {
                $convertedTimeStringA = strtotime($machineRuntime[$i]['datetime']);
                $convertedTimeStringB = strtotime('+24 hour', strtotime($_24HoursBeforeLastDateInDb));

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
        $_24HoursBeforeLastDateInDb = $machineModel->getLastDateMinus24Hours();

        $hourlyNetProductionArray = [];

        $dateTime = $_24HoursBeforeLastDateInDb;
        for ($i = 0; $i < 24; $i++) {
            $parsedDateTime = strtotime($dateTime);
            $parsedDateTimePlusOneHour = strtotime('1 hour', $parsedDateTime);
            $dateTimePlusOneHour = date('Y-m-d H:i:s', $parsedDateTimePlusOneHour);

            $netProductionPerHour = 0;
            $productionWithinHour = $machineModel->getMachineDataPerHour($machineName, $dateTime, $dateTimePlusOneHour, 'PRODUCTION');
            foreach ($productionWithinHour as $productionPerTimeUnit) {
                $netProductionPerHour += $productionPerTimeUnit['value'];
            }
            $scrapWithinHour = $machineModel->getMachineDataPerHour($machineName, $dateTime, $dateTimePlusOneHour, 'SCRAP');
            foreach ($scrapWithinHour as $scrapPerTimeUnit) {
                $netProductionPerHour -= $scrapPerTimeUnit['value'];
            }

            array_push($hourlyNetProductionArray, $netProductionPerHour);
            $dateTime = $dateTimePlusOneHour;
        }

        return $response->withJson($hourlyNetProductionArray,201);
    }
}