class PropertyChecker {
    static isPropertyDefined(obj, path) {
        if(path.trim() === '') {
            throw 'Path can\'t be empty!';
        }

        let properties = path.trim().split('.'),
            property;

        while(property = properties.shift()) {
            if(!obj.hasOwnProperty(property) || obj[property] === null) {
                return false;
            }

            obj = obj[property];            
        }

        return typeof obj !== 'string' || obj.trim() !== '';
    }

    static isPropertiesDefined(obj, path) {
        let stack = [{obj: obj, path: path}],
            data;

        while(data = stack.shift()) {
            if(Array.isArray(data.path)) {
                if(data.path.length === 0) {
                    throw 'Path array can\'t be empty';
                }

                for(let i = 0; i < data.path.length; i++) {
                    stack.push({obj: data.obj, path: data.path[i]});
                }
            } else if(typeof data.path === 'object') {
                if(Object.keys(data.path).length === 0) {
                    throw 'Path object can\'t be empty';
                }

                for(let prop in data.path) {
                    if(!data.obj.hasOwnProperty(prop)) {
                        return false;
                    }
                    
                    stack.push({obj: data.obj[prop], path: data.path[prop]});
                }
            } else if(typeof data.path === 'string') {
                if(!this.isPropertyDefined(data.obj, data.path)) {
                    return false;
                }
            } else {
                throw 'Invalid path argument!';
            }
        }

        return true;    
    }
}

export default PropertyChecker;