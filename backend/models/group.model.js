const mongoose = require('mongoose')
const schema = mongoose.Schema;

const GroupSchema = new schema({
    name:{type: String, required: true},
    
})

module.exports = Group = mongoose.model('groups', GroupSchema);