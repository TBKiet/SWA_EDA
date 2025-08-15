module.exports = async (request, reply, done) => {
  // Shared auth middleware
  const token = request.headers['authorization'];
  if (!token) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
  done();
};
