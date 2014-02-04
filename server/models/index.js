var mongoose = require('mongoose');
Schema = mongoose.Schema;

var ParamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Schema.Types.Mixed,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    sensor: {
        type: Schema.Types.ObjectId,
        ref: 'Sensor'
    }
});
module.exports.ParamSchema = ParamSchema;
module.exports.Param = mongoose.model('Param', ParamSchema);

var SensorSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    params: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Param'
        }
    ]
});
module.exports.SensorSchema = SensorSchema;
module.exports.Sensor = mongoose.model('Sensor', SensorSchema);
console.log(1);
//
//var Data = new Schema({
//    sensor: [Sensor],
//    date: {
//        type: Date,
//        default: Date.now
//    }
//});
//module.exports.Data = Data;
