const mongoose = require('mongoose')
const schema = mongoose.Schema

const UserSchema = new schema({
    email:{type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    groups: {type:[mongoose.Types.ObjectId], required: true, default:[], ref:'groups'},
    cout_login: {type: Number, required: true, default: 0},
    date_login: {type: Date, required: true, default: () => Date.now() - 86400000}
})

module.exports = User = mongoose.model('users', UserSchema)