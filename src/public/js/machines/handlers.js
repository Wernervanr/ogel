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

// const calculatePerformancePercentage = (netProduction) => {
//     const rawPerformancePercentage = (netProduction / (24 * 30000)) * 100;
//     const roundedUpPerformancePercentage = Math.ceil(rawPerformancePercentage * 100) / 100;
//
//     return roundedUpPerformancePercentage;
// };
//
// const calculateQualityPercentage = (netProduction, totalProduction) => {
//     const rawQualityPercentage = (netProduction / totalProduction) * 100;
//     const roundedUpQualityPercentage = Math.ceil(rawQualityPercentage * 100) / 100;
//
//     return roundedUpQualityPercentage;
// };
//
// const calculateAvailabilityPercentage = (downtimePercentage) => {
//     const uptimePercentage = 100 - downtimePercentage;
//     const rawAvailabilityPercentage = (uptimePercentage / 75) * 100;
//     const roundedUpAvailabilityPercentage = Math.ceil(rawAvailabilityPercentage * 100) / 100;
//
//
//     return roundedUpAvailabilityPercentage;
// };


// DETERMINERS
const determineScrapInLastDay = (machineData) => {
    const filteredByScrap = machineData.filter((machine) => {
        if(machine.variable_name === 'SCRAP' ) {
            return true;
        }
    });

    const totalScrap = filteredByScrap.reduce((total, scrap) => {
        const scrapValue = parseInt(scrap.value);
        return total + scrapValue;
    }, 0);

    return totalScrap;
};

const determineProductionInLastDay = (machineData) => {
    const filteredByProduction = machineData.filter((machine) => {
        if(machine.variable_name === 'PRODUCTION' ) {
            return true;
        }
    });

    const totalProduction = filteredByProduction.reduce((total, production) => {
        const productionValue = parseInt(production.value);
        return total + productionValue;
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

            if (d.datetime_to === c.datetime_from && c.datetime_to === b.datetime_from && b.datetime_to === a.datetime_from) {
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

// CHART CONSTUCTOR
const constructChart = (hourlyProduceArray, parentDiv) => {
    Highcharts.chart(parentDiv, {
        title: {
            text: 'NET Production per hour'
        },

        yAxis: {
            title: {
                text: 'NET production'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 1
            }
        },

        series: [{
            name: 'NET produce',
            data: hourlyProduceArray
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });
};