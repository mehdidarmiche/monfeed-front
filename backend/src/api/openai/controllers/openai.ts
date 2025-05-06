import { Context } from 'koa';

export default {
  async generate(ctx: Context) {
    const { prompt } = ctx.request.body;

    try {
      const response = await strapi.service('api::openai.openai').generateResponse(prompt);
      ctx.send({ result: response });
    } catch (err) {
      console.error(err);
      ctx.internalServerError('Erreur OpenAI.');
    }
  },
};
