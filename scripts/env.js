var app = {
    env: '',
    agent: ''
};

if (window && window.process && window.process.type) {
    app.env = 'electron';
} else {
    app.env = 'browser';
}


