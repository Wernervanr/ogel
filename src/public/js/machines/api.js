const getMachineNames = () => {
    return $.ajax({
        url: '/machines',
        type: 'GET',
        contentType:"application/json; charset=utf-8",
        dataType:"json"
    });
};

const getProducePerHour = (machineName) => {
    return $.ajax({
        url: '/machines/produceperhour/' + machineName,
        type: 'GET',
        contentType:"application/json; charset=utf-8",
        dataType:"json"
    });
};

const getMachineRuntime = (machineName) => {
    return $.ajax({
        url: '/machines/runtime/' + machineName,
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