const fs = require('fs'); 
const path = require('path'); 
const cheerio = require('cheerio');

const dirPaths = [
    'article',
    'author',
    'blog',
    'bookauthor',
    'category',
    'exercise',
    'news',
    'page',
    'publication',
    'review',
];

let lunrDocuments = [];

function parseHtmlFile(filepath, relativeFilePath) {
    let docStruct = {};
    
    const $ = cheerio.load(fs.readFileSync(filepath, {encoding:'utf8', flag:'r'}));
    docStruct.title = $('#main-info h1').text();
    docStruct.body = $('#content-content .content').text();    
    docStruct.href = relativeFilePath;

    return docStruct;
}

function getHtmlFileList(dir) {
    let files = [];

    fs.readdirSync(dir).forEach(file => { 
        if (path.extname(file) == ".html") {
            files.push(file); 
        }
    });

    return files;
} 

for (const dir of dirPaths) {
    const path = __dirname + '/web/' + dir;
    const files = getHtmlFileList(path);
    
    for (const file of files) {
        const docStruct = parseHtmlFile(path + '/' + file, dir + '/' + file);
        lunrDocuments.push(docStruct);
    }
}

console.log('Writing ' + lunrDocuments.length + ' documents to Lunrjs index file...\n');
fs.writeFileSync(__dirname + '/web/index.json', JSON.stringify(lunrDocuments));
console.log("File written successfully!\n"); 