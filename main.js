var http = require('http');
var url = require('url');
var static = require('node-static');
var file = new static.Server('.');

var greatList = [];





function accept(req, res) {
   
   
        file.serve(req, res); // (если он есть)
   

}


// ------ этот код запускает веб-сервер -------

if (!module.parent) {
    http.createServer(accept).listen(process.env.PORT || 4040);
} else {
    exports.accept = accept;
}









function listClosures(way) {
   
    fs.readdir(way, function (err, items) {
        for (var i = 0; i < items.length; i++) {
            var file = way + '/' + items[i];
            var mas = {
                path: file,
                name: items[i]
            }
            var st = fs.statSync(file);
            if (st.isFile()) {
                greatList.push(mas);
            }
            if (st.isDirectory()) {
                listClosures(file);
            }
        }
    })
}
