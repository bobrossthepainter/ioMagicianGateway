module.exports = {
  service: {
    getConfig: getConfig
  },
  name: 'BackendService'
};

function getConfig() {

  client = mqtt.connect();

  client.on('connect', connect);

  client.on('message', message);
}
