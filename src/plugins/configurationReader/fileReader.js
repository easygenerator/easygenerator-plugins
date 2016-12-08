let ticks = new Date().getTime();

class FileReader {
    static readJSON(filename){
        return new Promise((resolve, reject) => {
            let client = new XMLHttpRequest();
            client.open('GET', filename + '?_=' + ticks);
            client.onload = function() {
                if(client.status == 200 && client.responseText.length > 0) {
                    resolve(JSON.parse(client.responseText));
                } else {
                    resolve({});
                }
            }
            client.send();
        });
    }
}

export default FileReader;