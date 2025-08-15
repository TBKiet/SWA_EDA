const tap = require('tap');
const auditService = require('../../src/services/auditService');

tap.test('logAudit should log an audit', async (t) => {
  await auditService.logAudit({ eventType: 'test', data: {} });
  t.pass('Audit logged');
  t.end();
});
