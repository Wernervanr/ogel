document.addEventListener('DOMContentLoaded', (event) => {

    getAllMachineNames((machineNames) => {
        machineNames.forEach(function(machineName) {

            getMachine(machineName)
                .done((data, text) => {
                    const machineData = data;

                    // Filter data
                    const totalScrap = totalScrapInLastDay(machineData);
                    const totalProduction = totalProductionInLastDay(machineData);
                    const averageCoreTemperature = averageCoreTemperatureInLastDay(machineData);

                    const netProduction = calculateNetProduction(totalProduction, totalScrap);
                    const scrapPercentage = calculateScrapPercentage(totalProduction, totalScrap);

                    // Create nodes
                    const machineDivHeader = document.createElement('h4');
                    machineDivHeader.setAttribute('class', 'm-3');
                    machineDivHeader.textContent = machineName;

                    const netProductionDiv = document.createElement('div');
                    netProductionDiv.textContent = `Net production in last 24 hours: ${netProduction}`;

                    const scrapPercentageDiv = document.createElement('div');
                    scrapPercentageDiv.textContent = `Percentage of scrap in last 24 hours: ${scrapPercentage}%`;

                    const machineDataDiv = document.createElement('div');
                    machineDataDiv.setAttribute('class', 'col-lg-6 col-xl-4 border pb-3');
                    machineDataDiv.appendChild(machineDivHeader);
                    machineDataDiv.appendChild(netProductionDiv);
                    machineDataDiv.appendChild(scrapPercentageDiv);

                    // Append to .machineContainer
                    const machinesContainer = document.querySelector('.machineContainer');
                    machinesContainer.appendChild(machineDataDiv);
                })
                .fail((request, status, error) => {
                    console.log('balen');
                });

            getMachineRuntime(machineName)
                .done((data, text) => {
                    const downTimesData = data;

                    console.log(downTimesData[0].datetime);

                    for (i = 0; i < downTimesData.length; i++) {
                        if (  ){

                        }



                        if ( i === (monthNumber - 1) ){
                            return months[i];
                        }
                    }

                    console.log(data);
                })
                .fail((request, status, error) => {
                    console.log('balen');
                });
        });
    });
});