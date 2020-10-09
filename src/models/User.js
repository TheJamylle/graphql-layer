const mongoose, { Schema } = require('mongoose')
const timestamps = require('mongoose-timestamp')
const { composeWithMongoose } = require('graphql-compose-mongoose')

export const UserSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            unique: true,
            required: true,
        },
    },
    {
        collection: 'users',
    }
);

UserSchema.plugin(timestamps);

UserSchema.index({ createdAt: 1, updatedAt: 1 });

export const User = mongoose.model('User', UserSchema);
export const UserTC = composeWithMongoose(User);