var fs = require('fs'),
    multiparty = require('multiparty'),
    walk    = require('walk'),
    Config = require('../config/config');
    // config = requestuire('./config/config'); 
/*
 * Display upload form
 */
exports.display_form = {
   handler: function (requestuest, reply) {
    reply(
        '<form action="/uploadFile" method="post" enctype="multipart/form-data">'+
        '<input type="file" name="file">'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
  }
}

/*
 * upload file
 */

exports.uploadFile = {
  payload:{
                maxBytes:209715200,
                output:'stream',
                parse: false
          },
    handler: function(requset,reply){
         var form = new multiparty.Form();
            form.parse(requset.payload, function(err, fields, files) {
                fs.readFile(files.file[0].path,function(err,data){
                     fs.exists(Config.publicFolder, function (exists) {
                            if(exists === false){
                              fs.mkdirSync(Config.publicFolder);
                            }
                              fs.exists(Config.publicFolder+Config.uploadFolder, function (exists) {
                                if(exists === false){
                                  fs.mkdirSync(Config.publicFolder+Config.uploadFolder);
                                }
                                 var target_path = Config.publicFolder+Config.uploadFolder+'/' + files.file[0].originalFilename ;
                                 fs.writeFile(target_path,data,function(err){
                                    if(err) console.log(err);
                                    else reply('File uploaded to: ' + target_path);
                                })
                              });
                    })
                })
            });
    }
}

/**
* get file
*/
exports.getFile = {
  handler: function (request, reply) {
    var file = request.params.file
      , path = Config.publicFolder+Config.uploadFolder+"/" + file
      , ext = file.substr(file.lastIndexOf('.') + 1);
     if(ext === "pdf" || ext ==="ppt" || ext ==="pptx" || ext === "xls" || ext === "xlsx" || ext === "doc" || ext === "docx" || ext === "csv"){
        fs.readFile(path, function(error, content) {
          if (error) {
            reply("file not found");
          }
          else {
             if(ext === "pdf") reply(content).header('Content-Type', 'application/pdf')
             if(ext === "ppt") reply(content).header('Content-Type', 'application/vnd.ms-powerpoint')
             if(ext === "pptx") reply(content).header('Content-Type', 'application/vnd.openxmlformats-officedocument.preplyentationml.preplyentation')
             if(ext === "xls") reply(content).header('Content-Type', 'application/vnd.ms-excel')
             if(ext === "xlsx") reply(content).header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
             if(ext === "doc") reply(content).header('Content-Type', 'application/msword')
             if(ext === "docx") reply(content).header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
             if(ext === "csv") reply(content).header('Content-Type', 'application/octet-stream')
             .header("Content-Disposition", "attachment; filename=" + file);
          }
        });
      }
    else reply.file(path);
  }
};

/**
*get fileList
*/
exports.fileList = {
   handler: function (request, reply) {
      var files   = [];
      // Walker options
      var path_dir = Config.publicFolder+Config.uploadFolder;
      var walker  = walk.walk(path_dir, { followLinks: false });

      walker.on('file', function(root, stat, next) {
          // Add this file to the list of files
          files.push(stat.name);
          next();
      });

      walker.on('end', function() {
            return reply(files);
      }); 
  } 
}
