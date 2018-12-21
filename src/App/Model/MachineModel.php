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

    public function getLastDate() : string
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
        $fullDayBeforeLastDateInDb = strtotime('-24 hour', $lastDateInDb);

        $newDate = date('Y-m-d H:i:s', $fullDayBeforeLastDateInDb);

        return $newDate;
    }

    public function getMachineData($machineName, $newDate) : array
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
            'datetime_from' => $newDate,
            'machine_name' => $machineName
        ];

        $statement = $this->getConnection()->prepare($query);
        $statement->execute($parameters);

        return $statement->fetchAll();
    }

    public function getMachineRuntime($machineName, $newDate) : array
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
            'datetime' => $newDate,
            'machine_name' => $machineName
        ];

        $statement = $this->getConnection()->prepare($query);
        $statement->execute($parameters);

        return $statement->fetchAll();
    }

    public function getMachineDataPerHour($machineName, $newDate, $variableName, $newDatePlusHour) : array
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
            'datetime_from' => $newDate,
            'datetime_to' => $newDatePlusHour,
            'machine_name' => $machineName,
            'variable_name' => $variableName
        ];

        $statement = $this->getConnection()->prepare($query);
        $statement->execute($parameters);

        return $statement->fetchAll();
    }
}