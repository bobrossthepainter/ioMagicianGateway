import { AbstractPersistenceModel, ModelTypes, TypeAttributes } from "../../../core/model/abstract-persistence-model"

export const PortType = {
    GPIO: "GPIO"
};

export const PortState = {
    INPUT: "INPUT",
    OUTPUT: "OUTPUT"
};

// define model
export class Port extends AbstractPersistenceModel {
    constructor(attributes, options) {
        super(attributes, options, Port.keys);
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
            type: {
                type: ModelTypes.STRING,
                attributes: [TypeAttributes.REQUIRED]
            },
            state: {
                type: ModelTypes.STRING,
                attributes: [TypeAttributes.REQUIRED]
            },
            address: {
                type: ModelTypes.STRING,
                attributes: [TypeAttributes.REQUIRED]
            },
            controlableUnit: {
                type: ModelTypes.OBJECT,
                attributes: [TypeAttributes.PERSISTED],
                modelClass: ControlableUnit
            },
            actions: {
                type: ModelTypes.ARRAY,
                arrayType: ModelTypes.OBJECT,
                attributes: [TypeAttributes.PERSISTED],
                modelClass: Action
            }
        };
    }
}


module.exports = {
    modelName: 'Port',
    model: Port
}
