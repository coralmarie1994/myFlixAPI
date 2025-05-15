// HTTP Module
const http = require('http');//node require for webserver
const port = 8080; // server port assignment number

// FS Module
const fs = require('fs'); // helps to handle files for read/write in node

// URL Module
const url = require('url'); //helps breakdown URL
//CREATING SERVER WIT H REQUEST/RESPONSE 
const server = http.createServer((request, response) => { //when visiting site, rquest/response
  const parsedUrl= url.parse(request.url,true); //determines pathnames
  const pathname=parsedUrl.pathname; 

  let filePath;

  if (pathname.includes('documentation')){
    filePath='documentation.html'; //if name has documentation go /there
    } else {
    filePath='index.html' //otherwise take to index page
    }
//READING FILE
  fs.readFile(filePath, function (error, data) {
    if (error) {
      response.writeHead(404, {'Content-Type':'text/plain'}); //if error, show the erorr
      response.write('Error: File Not Found');
    } else {
      response.writeHead(200, {'Content-Type':'text/html'}); //if works 200- OK send file to browser for view
      response.write(data);
    }
    response.end();
  });
});
//ON SERVER PORT
server.listen(port, function (error) {
  if (error) {
    console.log('Something went wrong', error);
  } else {
    console.log(`Server listening on port ${port}`);
  }
});
