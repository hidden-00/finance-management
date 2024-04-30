const mongoose = require('mongoose')
const schema = mongoose.Schema;

const InviteSchema = new schema({
    inviter: { type: mongoose.Types.ObjectId, ref: 'users' },
    user_invited: { type: mongoose.Types.ObjectId },
    email_invited: { type: String },
    code_invite: { type: String },
    expires_in: { type: Date, required: true, default: () => (Date.now() + 86400000) },
    status: { type: String, enum: ['done', 'accept', 'reject', 'waiting', 'expires'] },
    group: { type: mongoose.Types.ObjectId, ref: 'groups' },
})

module.exports = Invite = mongoose.model('invites', InviteSchema);