const http = require('http');
const fs = require('fs');
var requests = require("requests");
const { json } = require('stream/consumers');

const homefile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal , orgVal) =>{
 let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
 temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
 temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
 temperature = temperature.replace("{%location%}",orgVal.name);
 temperature = temperature.replace("{%country%}",orgVal.sys.country);
 temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
 return temperature;
};

const server = http.createServer((req,res) => {
 if(req.url =="/"){
  requests("https://api.openweathermap.org/data/2.5/weather?q=chennai&appid=97ae68435dc74b17cd6ee1382ec50515")
.on('data', (chunk) => {
  const objData = JSON.parse(chunk);
  const arrData = [objData]
  // console.log(arrData[0].main.temp);
  const realTimeData = arrData.map((val) =>  replaceVal(homefile,val)).join("");
  // console.log(realTimeData);
  res.write(realTimeData);
})
.on('end', (err) => {
  if (err) return console.log('connection closed due to errors', err);
  // console.log('end');
  res.end();
});
 }
});

server.listen(3000,"127.0.0.1");