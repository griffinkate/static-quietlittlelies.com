const fs = require('fs'); 
const path = require('path'); 

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

function createSearchDocument() {

}

function parseHtmlFile(filepath) {

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
    const files = getHtmlFileList(__dirname + '/web/' + dir);
    console.log(files);
}