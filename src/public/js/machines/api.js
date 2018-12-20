const getMachineNames = () => {
    return $.ajax({
        url: '/machines',
        type: 'GET',
        contentType:"application/json; charset=utf-8",
        dataType:"json"
    });
};

const getMachine = (machineName) => {
    return $.ajax({
        url: '/machines/' + machineName,
        type: 'GET',
        contentType:"application/json; charset=utf-8",
        dataType:"json"
    });
};