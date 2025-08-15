module.exports = async (error, request, reply) => {
  reply.code(500).send({ error: error.message });
};
