module.exports = async (request, reply, done) => {
  // Mock authentication
  const token = request.headers['authorization'];
  if (!token) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
  done();
};
