var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

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
        type: Date
    },
    sensor: {
        type: Schema.Types.ObjectId,
        ref: 'Sensor'
    }
});
module.exports.ParamSchema = ParamSchema;
module.exports.Param = mongoose.model('Param', ParamSchema);
module.exports.ParamHistory = mongoose.model('ParamHistory', ParamSchema);

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

module.exports.UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports.UserSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            return next();
        });
    });
});

// Password verification
module.exports.UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }

        return cb(null, isMatch);
    });
};

module.exports.User = mongoose.model('User', module.exports.UserSchema);