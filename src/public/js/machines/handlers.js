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
    const filteredByCoreTemperature = machineData.filter((machine) => {
        if (machine.variable_name === 'CORE TEMPERATURE') {
            return true;
        }
    });
    const filteredByPotentialWarnings = filteredByCoreTemperature.filter((coreTemperature) => {
        if(coreTemperature.value > 85 && coreTemperature.value <= 100) {
            return true;
        }
    });
    const filteredByPotentialFatals = filteredByCoreTemperature.filter((coreTemperature) => {
        if(coreTemperature.value > 100) {
            return true;
        }
    });

    const checkIfWarning = (potentialWarningsObject) => {
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

    const checkIfFatal = (potentialFatalsObject) => {
        if (potentialFatalsObject.length > 0) {
            return true;
        }
    };

    const isWarning = checkIfWarning(filteredByPotentialWarnings);
    const isFatal = checkIfFatal(filteredByPotentialFatals);

    if (isWarning === true){
        return 'statusWarning';
    } else if (isFatal === true) {
        return 'statusFatal';
    } else {
        return 'statusOk';
    }
};