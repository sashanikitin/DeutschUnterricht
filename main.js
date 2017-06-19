var http = require('http');
var url = require('url');
var static = require('node-static');
var file = new static.Server('.');
var fs = require("fs");
var greatList = [];




function accept(req, res) {
    // если URL запроса /vote, то...
    // console.log(greatList.length);
    greatList = [];
    if (req.url == '/submit') {
        if (req.method == 'POST') {
            var post_data = '';
            req.on('data', function (data) {
                post_data += data;
            });
            req.on('end', function () {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                console.log(post_data);
                
                listClosures(post_data);
                setTimeout(function () {
                    var mes="";
                    greatList.forEach(function (item, i, arr) {
                        mes += i + ": " + item.name + "  " + item.path + "<br>";
                    });
                    res.end(mes);
                }, 2000);
            });
        }

    } else {
        // иначе считаем это запросом к обычному файлу и выводим его
        file.serve(req, res); // (если он есть)
    }

}


// ------ этот код запускает веб-сервер -------

if (!module.parent) {
    http.createServer(accept).listen(8080);
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
