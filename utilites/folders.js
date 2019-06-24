const fs = require('fs');

const path = require('path');

exports.createFolders = () => {
    
    let p = path.dirname(__dirname);

    p = path.join(p + '/upload');

    if (!fs.existsSync(p)) {

        fs.mkdirSync(p);
    }
    p = path.join(p + '/images');

    if (!fs.existsSync(p)){
        fs.mkdirSync(p);
    }

    if (!fs.existsSync(path.join(p + '/clinics'))) {
        fs.mkdirSync(path.join(p + '/clinics'));
    }

    if (!fs.existsSync(path.join(p + '/procedures'))) {
        fs.mkdirSync(path.join(p + '/procedures'));
    }

    if (!fs.existsSync(path.join(p + '/travelAgencies'))) {
        fs.mkdirSync(path.join(p + '/travelAgencies'));
    }

    if (!fs.existsSync(path.join(p + '/trips'))) {
        fs.mkdirSync(path.join(p + '/trips'));
    }

    if (!fs.existsSync(path.join(p + '/doctors'))) {
        fs.mkdirSync(path.join(p + '/doctors'));
    }

    if (!fs.existsSync(path.join(p + '/shared'))) {
        fs.mkdirSync(path.join(p + '/shared'));
    }



};