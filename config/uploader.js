const multer = require('multer');
const fs = require('fs');
const path = require('path');

module.exports = {
    uploader: (directory, filePrefix) => {
        // Define lokasi default directory
        let defaultDir = './public';

        // konfigurasi multer
        const storageUploader = multer.diskStorage({
            destination: (req, file, cb) => {
                // menentukan lokasi penyimpanan gambar
                const pathDir = directory ? defaultDir + directory : defaultDir;

                // memeriksaan lokasi penyimpanan gambar ada atau tidak
                if (fs.accessSync(pathDir)) {
                    // jika directory ada, maka akan dijalankan 'cb' untuk menyimpan data
                    console.log('Directory', pathDir);
                    cb(null, pathDir);
                } else {
                    fs.mkdir(pathDir, { recursive: true }, (err) => {
                        if (err) {
                            console.log('Directory Error :', err)
                        } else {
                            return cb(err, pathDir)
                        }
                    });
                }
            },
            filename: (req, file, cb) => {
                // membaca tipe data file
                let ext = file.originalname.split('.');
                let newName = filePrefix + Date.now() + '.' + ext[ext.length - 1];
                console.log('new file name :', newName)
                cb(null, newName)
            }
        })

        const fileFilter = (req, file, cb) => {
            const extFilter = /\.(jpg|png|webp|jpeg|svg)/;

            if (file.originalname.toLowerCase().match(extFilter)) {
                cb(null, true)
            } else {
                cb(new Error('Not valid'), false)
            }
        }

        return multer({ storage: storageUploader, fileFilter })
    }
}