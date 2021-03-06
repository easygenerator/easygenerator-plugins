class FileReader {
    static readJSON(filename, cacheBuster){
        return new Promise((resolve, reject) => {
            let client = new XMLHttpRequest();
            client.open('GET', filename + '?_=' + cacheBuster);
            client.onload = function() {
                if(client.status == 200 && client.responseText.length > 0) {
                    try{
                        let object = JSON.parse(client.responseText);
                        resolve(object);
                    } catch(e) {
                        console.error('File \'' + filename + '\' is\'t parsed to object: ' + e);
                        resolve({});
                    }
                } else {
                    resolve({});
                }
            }
            client.send();
        });
    }
}

export default FileReader;