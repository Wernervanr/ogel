document.addEventListener('DOMContentLoaded', (event) => {

    const machinesContainer = document.querySelector('.machineContainer');

    getAllMachineNames((machineNames) => {
        machineNames.forEach(function(machineName) {

            const machineDataDiv = document.createElement('div');
            machineDataDiv.setAttribute('class', 'col-12 col-md-6 col-lg-4 pb-3 flex-column d-flex');

            machinesContainer.appendChild(machineDataDiv);

            getMachine(machineName)
                .done((data, text) => {
                    // Filter data
                    const totalScrap = determineScrapInLastDay(data);
                    const totalProduction = determineProductionInLastDay(data);
                    const temperatureStatus = determineMachineStatus(data);

                    // Calculate data
                    const netProduction = calculateNetProduction(totalProduction, totalScrap);
                    const scrapPercentage = calculateScrapPercentage(totalProduction, totalScrap);

                    // const performancePercentage = calculatePerformancePercentage(netProduction);
                    // const qualityPercentage = calculateQualityPercentage(netProduction, totalProduction);

                    // Create nodes
                    const machineDivHeader = document.createElement('h4');
                    machineDivHeader.setAttribute('class', 'w-100 p-2 mb-3 bg-dark text-center ' + temperatureStatus);
                    machineDivHeader.textContent = machineName;

                    const netProductionDiv = document.createElement('div');
                    netProductionDiv.setAttribute('class', 'w-50 order-2 mb-2 p-1 pl-2 border-left');
                    netProductionDiv.innerHTML = `<small>Production</small> 
                                                  <h5 class="text-primary">${netProduction}</h5>`;

                    const scrapPercentageDiv = document.createElement('div');
                    scrapPercentageDiv.setAttribute('class', 'w-50 order-3 mb-2 p-1 pl-2 border-left');
                    scrapPercentageDiv.innerHTML = `<small>Scrap percentage</small> 
                                                    <h5 class="text-primary">${scrapPercentage}%</h5>`;

                    machineDataDiv.appendChild(machineDivHeader);
                    machineDataDiv.appendChild(netProductionDiv);
                    machineDataDiv.appendChild(scrapPercentageDiv);
                })
                .fail((request, status, error) => {
                    console.log('balen');
                });

            getMachineRuntime(machineName)
                .done((data, text) => {
                    const downtimePercentage = calculateDowntimePercentage(data);
                    // const availabilityPercentage = calculateAvailabilityPercentage(downtimePercentage);

                    // Create nodes
                    const downtimePercentageDiv = document.createElement('div');
                    downtimePercentageDiv.setAttribute('class', 'w-100 order-4 mb-2 p-1 pl-2 border-left');
                    downtimePercentageDiv.innerHTML = `<small>Downtime percentage</small> 
                                                       <h5 class="text-primary">${downtimePercentage}%</h5>`;

                    machineDataDiv.appendChild(downtimePercentageDiv);
                })
                .fail((request, status, error) => {
                    console.log('balen');
                });

            getProducePerHour(machineName)
                .done((data, text) => {
                    const chartDiv = document.createElement('div');
                    chartDiv.setAttribute('class', 'machineData order-5 mb-2 border-bottom');
                    machineDataDiv.appendChild(chartDiv);

                    constructChart(data, chartDiv);
                })
                .fail((request, status, error) => {
                    console.log('balen joh');
                });
        });
    });
});