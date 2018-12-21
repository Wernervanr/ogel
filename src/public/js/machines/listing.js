document.addEventListener('DOMContentLoaded', (event) => {

    getAllMachineNames((machineNames) => {
        machineNames.forEach(function(machineName) {

            const machineDataDiv = document.createElement('div');
            machineDataDiv.setAttribute('class', 'col-lg-6 col-xl-4 border pb-3 d-flex flex-column');

            const machinesContainer = document.querySelector('.machineContainer');
            machinesContainer.appendChild(machineDataDiv);

            getMachine(machineName)
                .done((data, text) => {
                    const machineData = data;

                    // Filter data
                    const totalScrap = totalScrapInLastDay(machineData);
                    const totalProduction = totalProductionInLastDay(machineData);
                    const temperatureStatus = determineMachineStatus(machineData);

                    // Calculate data
                    const netProduction = calculateNetProduction(totalProduction, totalScrap);
                    const scrapPercentage = calculateScrapPercentage(totalProduction, totalScrap);

                    // Create nodes
                    const machineDivHeader = document.createElement('h4');
                    machineDivHeader.setAttribute('class', 'm-3 order-1 ' + temperatureStatus);
                    machineDivHeader.textContent = machineName;
                    machineDataDiv.appendChild(machineDivHeader);

                    const netProductionDiv = document.createElement('div');
                    netProductionDiv.setAttribute('class', 'order-2');
                    netProductionDiv.textContent = `Net production in last 24 hours: ${netProduction}`;
                    machineDataDiv.appendChild(netProductionDiv);

                    const scrapPercentageDiv = document.createElement('div');
                    scrapPercentageDiv.setAttribute('class', 'order-3');
                    scrapPercentageDiv.textContent = `Scrap percentage in last 24 hours: ${scrapPercentage}%`;
                    machineDataDiv.appendChild(scrapPercentageDiv);
                })
                .fail((request, status, error) => {
                    console.log('balen');
                });

            getMachineRuntime(machineName)
                .done((data, text) => {
                    const totalDownTimeInSeconds = data;

                    // Calculate data
                    const downtimePercentage = calculateDowntimePercentage(totalDownTimeInSeconds);

                    // Create nodes
                    const downtimePercentageDiv = document.createElement('div');
                    downtimePercentageDiv.setAttribute('class', 'order-4');
                    downtimePercentageDiv.textContent = `Downtime percentage in last 24 hours: ${downtimePercentage}%`;
                    machineDataDiv.appendChild(downtimePercentageDiv);
                })
                .fail((request, status, error) => {
                    console.log('balen');
                });

            getProducePerHour(machineName)
                .done((data, text) => {
                    console.log(data);
                })
                .fail((request, status, error) => {
                    console.log('balen joh');
                });
        });
    });
});