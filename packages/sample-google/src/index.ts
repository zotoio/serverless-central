'use strict';

exports['sample-gcf'] = (request: any, response: any) => {
    response.status(200).send(request.headers);
};

exports.event = (event: any, callback: any) => {
    callback();
};
