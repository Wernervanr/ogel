document.addEventListener('DOMContentLoaded', (event) => {

    // Grab the divs that are to display contain the machines data.
    const machineDataDivs = document.querySelectorAll('.machineContainer div');

    // For each Div, determine the machine name and get the machine data from the last 24 hours.
    machineDataDivs.forEach(function(machineDataDiv) {

        // Determine the machine name.
        const machineName = machineDataDiv.dataset.machinename;

        // Get data from said machine name from the last 24 hours.
        getMachine(machineName)
            .done((data, text) => {
                const machineData = data;

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

                // Append to machineDataDiv
                machineDataDiv.appendChild(machineDivHeader);
                machineDataDiv.appendChild(netProductionDiv);
                machineDataDiv.appendChild(scrapPercentageDiv);
            })
            .fail((request, status, error) => {
                console.log('balen');
            });
    });
});