import { AbstractPersistenceModel, ModelTypes, TypeAttributes } from "../../../core/model/abstract-persistence-model"


// define model
export class ControlableUnit extends AbstractPersistenceModel {
    constructor(attributes, options) {
        super(attributes, options, ControlableUnit.keys);
    }

    static keys() {
        return unit;
    }
}

const port = {
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
    actions: {
        type: ModelTypes.ARRAY,
        arrayType: ModelTypes.OBJECT,
        attributes: [TypeAttributes.PERSISTED],
        modelClass: Action
    }
};

const unit = {
    name: {
        type: ModelTypes.STRING,
        attributes: [TypeAttributes.REQUIRED]
    },
    description: {
        type: ModelTypes.STRING
    },
    address: {
        type: ModelTypes.STRING,
        attributes: [TypeAttributes.REQUIRED]
    },
    login: {
        type: ModelTypes.STRING
    },
    credentials: {
        type: ModelTypes.STRING
    },
    ports: {
        type: ModelTypes.ARRAY,
        arrayType: ModelTypes.OBJECT,
        content: port,
    }
}



module.exports = {
    modelName: 'ControlableUnit',
    model: ControlableUnit
}
