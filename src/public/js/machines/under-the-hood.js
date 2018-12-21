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

