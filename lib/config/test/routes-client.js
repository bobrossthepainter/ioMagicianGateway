module.exports.routes = {

    /*******************************************************************************
     * * Custom routes here... * * If a request to a URL doesn't match any of the
     * custom routes above, it * is matched against Sails route blueprints. See
     * `config/blueprints.js` * for configuration options and examples. * *
     ******************************************************************************/

    'GET /controlableunit': 'ControlableUnitController.getAll',
    'PUT /controlableunit/:id': 'ControlableUnitController.put',
    'GET /controlableunit/:id': 'ControlableUnitController.get',
    'POST /controlableunit': 'ControlableUnitController.post',
    'POST /controlableunit/register': 'ControlableUnitController.register',

    'GET /action': 'ActionController.get'

    //'GET /action/commands': 'ActionController.getActionsWithCommands',
    //
    //'GET /port/execute/:id': 'PortController.execute',
    //
    //'GET /portaggregation/getAll': 'PortAggregation.getAll',
    //
    //'GET /portaggregation/get/:id': 'PortAggregation.get'

};
