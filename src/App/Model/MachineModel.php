<?php

declare(strict_types=1);

namespace App\Model;

class MachineModel extends PdoModel
{
    public function getMachine($machineName) : array
    {
        // Determine the date of the last inserted machine data
        $query =   "SELECT
                      datetime_to
                    FROM
                      Production
                    ORDER BY 
                      datetime_to
                    DESC 
                    LIMIT 1";

        $statementOne = $this->getConnection()->prepare($query);
        $statementOne->execute();

        $result = $statementOne->fetch();

        // Convert the result, a string, to UNIX timestamp and subtract 24 hours. Convert back to DATETIME format after.

        $lastDateInDb = strtotime($result['datetime_to']);
        $fullDayBeforeLastDateInDb = strtotime('-24 hour', $lastDateInDb);

        $newDate = date('Y-m-d H:i:s', $fullDayBeforeLastDateInDb);

        // Get all data from the machine within the last 24 hours the last known datetime_to.
        $query = "SELECT
                    *
                  FROM
                    Production
                  WHERE
                    datetime_to >= :datetime_to 
                  AND 
                    machine_name = :machine_name";

        $parameters = [
            'datetime_to' => $newDate,
            'machine_name' => $machineName
        ];

        $statementTwo = $this->getConnection()->prepare($query);
        $statementTwo->execute($parameters);

        return $statementTwo->fetchAll();
    }
}