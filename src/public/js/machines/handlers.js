const totalScrapInLastDay = (machineData) => {
    // Filter the items in the object based on variable_name SCRAP.
    const sortedByScrap = machineData.filter((machine) => {
        if(machine.variable_name === 'SCRAP' ) {
            return true;
        }
    });
    // Count the total amount of scrap in last 24 hours. ///////////// OPLETTEN, bij de return is een overbodige rekensom nodig. Waarom?
    const totalScrap = sortedByScrap.reduce((total, scrap) => {
        return total + (scrap.value - 0);
    }, 0);

    // Return the total scrap.
    return totalScrap;
};

const totalProductionInLastDay = (machineData) => {
    // Filter the items in the object based on variable_name PRODUCTION.
    const sortedByProduction = machineData.filter((machine) => {
        if(machine.variable_name === 'PRODUCTION' ) {
            return true;
        }
    });
    // Count the total amount of production in last 24 hours. ///////////// OPLETTEN, bij de return is een overbodige rekensom nodig. Waarom?
    const totalProduction = sortedByProduction.reduce((total, production) => {
        return total + (production.value - 0);
    }, 0);

    // Return the total production
    return totalProduction;
};

const averageCoreTemperatureInLastDay = (machineData) => {
    // Filter the items in the object based on variable_name CORE TEMPERATURE.
    const sortedByTemperature = machineData.filter((machine) => {
        if(machine.variable_name === 'CORE TEMPERATURE' ) {
            return true;
        }
    });

    // Determine the amount the core temperature is measured,
    const timesCoreTemperatureIsMeasured = sortedByTemperature.length;

    // Add-up the temperature for each time this was measured.
    const totalCoreTemperature = sortedByTemperature.reduce((total, temperature) => {
        return total + (temperature.value - 0);
    }, 0);

    // Divide the total of the added up temperatures by the amount that the temperature was measured.
    const averageCoreTemperature = totalCoreTemperature / timesCoreTemperatureIsMeasured;

    // Return the average core temperature.
    return averageCoreTemperature;
};