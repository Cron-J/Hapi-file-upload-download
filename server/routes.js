// Load modules

var	UD = require('./controller/uploadDownload');

// API Server Endpoints
exports.endpoints = [

    { method: 'GET', path: '/', config: UD.display_form},
    { method: 'POST', path: '/uploadFile', config: UD.uploadFile},
    { method: 'GET', path: '/getFile/{file}', config: UD.getFile},
    { method: 'GET', path: '/fileList', config: UD.fileList}
];