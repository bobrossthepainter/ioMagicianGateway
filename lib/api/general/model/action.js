import {AbstractPersfistenceModel, ModelTypes, TypeAttributes} from "../../../core/model/abstract-persistence-model"

export const PortType = {
  GPIO: "GPIO"
};

export const PortState = {
  INPUT: "INPUT",
  OUTPUT: "OUTPUT"
};

// define model
export class Action extends AbstractPersfistenceModel {
  constructor(attributes, options) {
    super(attributes, options, Action.keys);
  }

  static keys() {
    return {
      name: {
        type: ModelTypes.STRING,
        attributes: [TypeAttributes.REQUIRED]
      },
      description: {
        type: ModelTypes.STRING
      },
      conditions: {
        type: ModelTypes.ARRAY,
        arrayType: ModelTypes.OBJECT
      },
      command: {
        type: ModelTypes.STRING,
        attributes: [TypeAttributes.REQUIRED]
      },
      port: {
        type: ModelTypes.OBJECT,
        attributes: [TypeAttributes.REQUIRED, TypeAttributes.PERSISTED],
        modelClass: Port
      }
    };
  }
}


module.exports.modelName = 'Action';
module.exports.model = Action;
