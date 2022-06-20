// update 2022.03.20
const stream = require('stream')
const util = require('util')
const pipeline = util.promisify(stream.pipeline)
const fsPromises =  require('fs/promises');
var fs = require('fs');
var got = require('got');

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

const args = process.argv.splice(2);


(async function() {
    try {
        let urlListList = (await fsPromises.readFile("list.txt","utf8")).split("\n");
        console.log(urlListList);
        let i=0;
        let mdFileContent = "";
        for(let url of urlListList){
            await pipeline(got.stream(url, {
                headers: {
                    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36"
                }
            }), fs.createWriteStream(i+'.png'));
            console.log(i);
            mdFileContent = mdFileContent+"![](./" + i + ".png)\n";
            i++;
        }
        await fsPromises.writeFile("./out.md", mdFileContent);
    } catch (error) {
        console.error(error.message);
    }
})();
