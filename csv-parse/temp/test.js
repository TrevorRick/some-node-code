// var XMLWriter = require('xml-writer');
// xw = new XMLWriter;
// xw.startDocument().startElement('root').writeElement('transcode', 'T0001');

// console.log(xw.toString());

var XMLWriter = require('xml-writer'),
               fs = require('fs');
    var ws = fs.createWriteStream('./foo.xml');
    ws.on('close', function() {
            console.log(fs.readFileSync('./foo.xml', 'UTF-8'));
    });
    xw = new XMLWriter(false, function(string, encoding) {
            ws.write(string, encoding);
    });
    xw.startDocument('1.0', 'UTF-8').startElement(function() {
        return 'root';
    });
    ws.end();