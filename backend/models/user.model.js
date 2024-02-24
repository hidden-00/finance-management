const mongoose = require('mongoose')
const schema = mongoose.Schema

const UserSchema = new schema({
    email:{type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    groups: {type:[mongoose.Types.ObjectId], required: true, default:[], ref:'groups'}
})

module.exports = User = mongoose.model('users', UserSchema)