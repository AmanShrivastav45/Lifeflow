import multer from "multer";

var storage = multer.diskStorage({
    destination: function(request, file, callback){
        callback(null, 'uploads/')
    },
    filename: function(request, file, callback){
        callback(null, Date.now() + '-' +file.originalname);
    }
})

var upload = multer({
    storage: storage,
    fileFilter: function(request, file, callback){
        if(file.mimetype === 'application/pdf'){
            callback(null, true);
        }else{
            console.log("Wrong extension uploaded!");
            callback(new Error('Wrong file extension, only PDFs are allowed!'), false);
        }
    }
})

export default upload;