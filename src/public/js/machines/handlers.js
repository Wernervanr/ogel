const getAllMachineNames = (callback) => {
    getMachineNames()
        .done((data, text) => {
            let machineNames = [];

            data.forEach(function(machineName) {
                machineNames.push(machineName.machine_name);
            });

            callback(machineNames);
        })
        .fail((request, status, error) => {
            console.log('balen');
        });
};

// DETERMINERS

const totalScrapInLastDay = (machineData) => {
    const filteredByScrap = machineData.filter((machine) => {
        if(machine.variable_name === 'SCRAP' ) {
            return true;
        }
    });

    // Count the total amount of scrap in last 24 hours. ///////////// OPLETTEN, bij de return is een overbodige rekensom nodig. Waarom?
    const totalScrap = filteredByScrap.reduce((total, scrap) => {
        return total + (scrap.value - 0);
    }, 0);

    return totalScrap;
};

const totalProductionInLastDay = (machineData) => {
    const filteredByProduction = machineData.filter((machine) => {
        if(machine.variable_name === 'PRODUCTION' ) {
            return true;
        }
    });

    // Count the total amount of production in last 24 hours. ///////////// OPLETTEN, bij de return is een overbodige rekensom nodig. Waarom?
    const totalProduction = filteredByProduction.reduce((total, production) => {
        return total + (production.value - 0);
    }, 0);

    return totalProduction;
};

const determineMachineStatus = (machineData) => {

    // FILTERS
    const filteredByCoreTemperature = machineData.filter((machine) => {
        if (machine.variable_name === 'CORE TEMPERATURE') {
            return true;
        }
    });

    // DETERMINE IF WARNING TEMPERATURE
    const determineIfWarning = (potentialWarningsObject) => {
        for (i = 3; i < potentialWarningsObject.length; i++) {
            let a = potentialWarningsObject[i];
            let b = potentialWarningsObject[(i - 1)];
            let c = potentialWarningsObject[(i - 2)];
            let d = potentialWarningsObject[(i - 3)];

            if (a.datetime_from === b.datetime_to && b.datetime_from === c.datetime_to && c.datetime_from === d.datetime_to) {
                return true;
            }
        }
    };

    const objectOfPotentialWarnings = filteredByCoreTemperature.filter((coreTemperature) => {
        if(coreTemperature.value > 85 && coreTemperature.value <= 100) {
            return true;
        }
    });

    // DETERMINE IF FATAL TEMPERATURE

    const determineIfFatal = (potentialFatalsObject) => {
        if (potentialFatalsObject.length > 0) {
            return true;
        }
    };

    const objectOfPotentialFatals = filteredByCoreTemperature.filter((coreTemperature) => {
        if(coreTemperature.value > 100) {
            return true;
        }
    });

    // RETURN MACHINESTATUS

    const isWarning = determineIfWarning(objectOfPotentialWarnings);
    const isFatal = determineIfFatal(objectOfPotentialFatals);
    let machineStatus = '';

    if (isWarning === true){
        machineStatus = 'Warning';
    } else if (isFatal === true) {
        machineStatus = 'Fatal';
    } else {
        machineStatus = 'Good';
    }

    return machineStatus;
};

// CALCULATORS

const calculateNetProduction = (grossProduction, scrap) => {
    const netProduction = grossProduction - scrap;

    return netProduction;
};

const calculateScrapPercentage = (grossProduction, scrap) => {
    const rawScrapPercentage = (scrap / grossProduction) * 100;
    const roundedUpScrapPercentage = Math.ceil(rawScrapPercentage * 1000) / 1000;

    return roundedUpScrapPercentage;
};

const calculateDowntimePercentage = (totalDownTimeInSeconds) => {
    const rawDowntimePercentage = (((totalDownTimeInSeconds / 60) / 60) / 24) * 100;
    const roundedUpDowntimePercentage = Math.ceil(rawDowntimePercentage * 1000) / 1000;

    return roundedUpDowntimePercentage;
};