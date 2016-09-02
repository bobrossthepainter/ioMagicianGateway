module.exports = {
  service: {
    getConfig: getConfig,

    saveConfig : saveConfig,

    changeLeafInputState : changeLeafInputState
  },
  name: 'BackendService'
};

function getConfig() {

  client = mqtt.connect();

  client.on('connect', connect);

  client.on('message', message);
}

function saveConfig(){

}

function changeLeafInputState(){

}
