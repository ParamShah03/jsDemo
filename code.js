const fs = require('fs');
const path = require('path');

const results = fs.readdirSync(path.resolve(__dirname, "upload/images/chairs"));


//console.log(results);

for (let i=0;i<results.length;i++)
{
    console.log(results[i]);
}