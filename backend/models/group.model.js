const mongoose = require('mongoose')
const schema = mongoose.Schema;

const GroupSchema = new schema({
    name:{type: String, required: true},
    members:{type:[mongoose.Types.ObjectId], required: true, default:[], ref:'users'},
    finances: {type:[mongoose.Types.ObjectId], required: true, default:[], ref: 'finances'},
    leader: {type: mongoose.Types.ObjectId, required: true, ref: 'users'},
    description:{type: String}
})

module.exports = Group = mongoose.model('groups', GroupSchema);