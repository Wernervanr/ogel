<?php

declare(strict_types=1);

namespace App\Model;

class MachineModel extends PdoModel
{
    public function getMachineNames() : array
    {
        $query =   "SELECT DISTINCT 
                      machine_name
                    FROM
                      Production";

        $statement = $this->getConnection()->prepare($query);
        $statement->execute();

        return $statement->fetchAll();
    }

    public function getLastDateMinus24Hours() : string
    {
        $query =   "SELECT
                      datetime_to
                    FROM
                      Production
                    ORDER BY 
                      datetime_to
                    DESC 
                    LIMIT 1";

        $statement = $this->getConnection()->prepare($query);
        $statement->execute();

        $result = $statement->fetch();

        // Convert the result, a string, to UNIX timestamp and subtract 24 hours. Convert back to DATETIME format after.
        $lastDateInDb = strtotime($result['datetime_to']);
        $_24HoursBeforeLastDateInDb = strtotime('-24 hour', $lastDateInDb);

        $newDateTime = date('Y-m-d H:i:s', $_24HoursBeforeLastDateInDb);

        return $newDateTime;
    }

    public function getMachineData($machineName, $startDateTime) : array
    {
        $query = "SELECT
                    *
                  FROM
                    Production
                  WHERE
                    datetime_from >= :datetime_from
                  AND 
                    machine_name = :machine_name";

        $parameters = [
            'datetime_from' => $startDateTime,
            'machine_name' => $machineName
        ];

        $statement = $this->getConnection()->prepare($query);
        $statement->execute($parameters);

        return $statement->fetchAll();
    }

    public function getMachineRuntime($machineName, $startDateTime) : array
    {
        $query = "SELECT
                    *
                  FROM
                    Runtime
                  WHERE
                    datetime >= :datetime 
                  AND 
                    machine_name = :machine_name";

        $parameters = [
            'datetime' => $startDateTime,
            'machine_name' => $machineName
        ];

        $statement = $this->getConnection()->prepare($query);
        $statement->execute($parameters);

        return $statement->fetchAll();
    }

    public function getMachineDataPerHour($machineName, $startDateTime, $endDateTime, $variableName) : array
    {
        $query = "SELECT
                    *
                  FROM
                    Production
                  WHERE
                    machine_name = :machine_name
                  AND 
                    variable_name = :variable_name
                  AND 
                    datetime_from >= :datetime_from
                  AND
                    datetime_to <= :datetime_to";

        $parameters = [
            'datetime_from' => $startDateTime,
            'datetime_to' => $endDateTime,
            'machine_name' => $machineName,
            'variable_name' => $variableName
        ];

        $statement = $this->getConnection()->prepare($query);
        $statement->execute($parameters);

        return $statement->fetchAll();
    }
}