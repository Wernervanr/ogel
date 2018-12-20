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

                // Do something with Data.
                console.log(totalScrap);
                console.log(totalProduction);
                console.log(averageCoreTemperature);
            })
            .fail((request, status, error) => {
                console.log('balen');
            });
    });
});