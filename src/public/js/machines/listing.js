document.addEventListener('DOMContentLoaded', (event) => {

    const machineDataDivs = document.querySelectorAll('.machineContainer div');

    machineDataDivs.forEach(function(machineDataDiv) {
        const machineName = machineDataDiv.dataset.machinename;

        getMachine(machineName)
        // RETURNS OBJECT OF ITEMS FROM ONE MACHINE IN THE LAST 24 HOURS, ARRANGED IN SEQUENCE OF DATE AND TIME IN LAST 24 HOURS

            .done((data, text) => {
                const machineData = data;

                // Filter the items in the object based on variable_name SCRAP
                const sortedByScrap = machineData.filter((machine) => {
                    if(machine.variable_name === 'SCRAP' ) {
                        return true;
                    }
                });
                    // Count the total amount of scrap in last 24 hours. ///////////// OPLETTEN, bij de return is een overbodige rekensom nodig. Waarom?
                const totalScrap = sortedByScrap.reduce((total, scrap) => {
                    return total + (scrap.value - 0);
                }, 0);

                // Filter the items in the object based on variable_name PRODUCTION
                const sortedByProduction = machineData.filter((machine) => {
                    if(machine.variable_name === 'PRODUCTION' ) {
                        return true;
                    }
                });
                    // Count the total amount of production in last 24 hours. ///////////// OPLETTEN, bij de return is een overbodige rekensom nodig. Waarom?
                const totalProduction = sortedByProduction.reduce((total, production) => {
                    return total + (production.value - 0);
                }, 0);



                // Unused so far:

                const sortedByTemperature = machineData.filter((machine) => {
                    if(machine.variable_name === 'CORE TEMPERATURE' ) {
                        return true;
                    }
                });

                // Do something with Data

                console.log(totalProduction - totalScrap);



            })
            .fail((request, status, error) => {
                console.log('balen');
            });
    });
});