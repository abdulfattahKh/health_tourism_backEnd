const fs = require('fs');

const path = require('path');

exports.createFolders = () => {
    console.log('folders');

    let p = path.dirname(__dirname);

    p = path.join(p + '/upload');

    if (!fs.existsSync(p)) {
        console.log('scs');
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


};