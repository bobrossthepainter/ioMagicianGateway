
function debug(message){
  console.log("DEBUG: " + message);
}

function error(message){
  console.log("ERROR: " + message);
}

function warning(message){
  console.log("WARNINGs: " + message);
}

module.exports = {
  d: debug,
  e: error,
  w: warning
}
