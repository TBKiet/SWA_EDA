const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = { AuditLog };
