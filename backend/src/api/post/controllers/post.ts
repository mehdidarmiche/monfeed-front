export default {
  async generatePostMessage(ctx) {
    const { message } = ctx.request.body;

    try {
      const generated = await strapi.services['api::post.post'].generatePostMessage(message || '');
      ctx.send({ data: generated });
    } catch (err) {
      console.error('❌ Erreur IA:', err);
      ctx.internalServerError('Erreur lors de la génération IA.');
    }
  },
};
