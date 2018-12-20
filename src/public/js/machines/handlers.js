const totalScrapInLastDay = (machineData) => {
    const sortedByScrap = machineData.filter((machine) => {
        if(machine.variable_name === 'SCRAP' ) {
            return true;
        }
    });

    // Count the total amount of scrap in last 24 hours. ///////////// OPLETTEN, bij de return is een overbodige rekensom nodig. Waarom?
    const totalScrap = sortedByScrap.reduce((total, scrap) => {
        return total + (scrap.value - 0);
    }, 0);

    return totalScrap;
};

const totalProductionInLastDay = (machineData) => {
    const sortedByProduction = machineData.filter((machine) => {
        if(machine.variable_name === 'PRODUCTION' ) {
            return true;
        }
    });

    // Count the total amount of production in last 24 hours. ///////////// OPLETTEN, bij de return is een overbodige rekensom nodig. Waarom?
    const totalProduction = sortedByProduction.reduce((total, production) => {
        return total + (production.value - 0);
    }, 0);

    return totalProduction;
};

const averageCoreTemperatureInLastDay = (machineData) => {
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

    return averageCoreTemperature;
};

const calculateNetProduction = (grossProduction, scrap) => {
    const netProduction = grossProduction - scrap;

    return netProduction;
};

const calculateScrapPercentage = (grossProduction, scrap) => {
    const rawScrapPercentage = (scrap / grossProduction) * 100;
    const roundedUpScrapPercentage = Math.ceil(rawScrapPercentage * 1000) / 1000;

    return roundedUpScrapPercentage;
};