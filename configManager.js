const fileIO = require('./fileIO');
const CONFIG_FILE_NAME = "conf.json";

const config = fileIO.getFileAsJSON(CONFIG_FILE_NAME);

module.exports=
    {
        getConfiguration: function()
        {
            return config;
        },

        syncToDisk: function()
        {
            fileIO.writeJSONToFile(CONFIG_FILE_NAME, config);
        },

        getPort: function()
        {
            return config.port;
        },

        getClientID: function()
        {
            return config.clientID;
        },

        getClientSecret: function()
        {
            return config.clientSecret;
        },

        getSessionSecret: function()
        {
            return config.sessionSecret;
        }

    };