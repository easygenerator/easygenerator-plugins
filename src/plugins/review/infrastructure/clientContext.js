class ClientContext {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        return value;
    }

    get(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    remove(key) {
        localStorage.removeItem(key);
    }
}

var clientContext = new ClientContext();
module.exports = clientContext;