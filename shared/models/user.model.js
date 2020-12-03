const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            index: true,
            required: false,
        },
        email: {
            type: String,
            require: true,
            unique: true,
            trim: true,
        },
        phones: [
            {
                type: String,
                index: true,
                trim: true,
            }
        ],
        emails: [
            {
                type: String,
                index: true,
                required: true,
                trim: true,
            }
        ]
    },
    {
        timestamps: true
    }
)

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};


/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema) 