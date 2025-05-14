import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::event.event', ({ strapi }) => ({
  // 🔄 CRÉER un événement
  async create(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('Vous devez être connecté pour créer un événement.');
    }

    const { title, start, end } = ctx.request.body.data;

    const entity = await strapi.entityService.create('api::event.event', {
      data: {
        title,
        start,
        end,
        user: user.id,
      },
    });

    return { data: entity };
  },

  // 📥 LISTER les événements du user connecté
  async find(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('Non autorisé.');
    }

    const entities = await strapi.entityService.findMany('api::event.event', {
      filters: {
        user: user.id,
      },
      sort: { start: 'asc' },
      populate: [],
    });

    return { data: entities };
  },

  // ✏️ MODIFIER un événement (si propriétaire)
  async update(ctx) {
    const user = ctx.state.user;
    const eventId = ctx.params.id;

    // 🛠️ Cast pour informer TypeScript de la structure attendue
    const existing = await strapi.entityService.findOne('api::event.event', eventId, {
      populate: ['user'],
    }) as { user?: { id: number } };

    if (!existing || existing.user?.id !== user.id) {
      return ctx.unauthorized('Vous ne pouvez pas modifier cet événement.');
    }

    const updated = await strapi.entityService.update('api::event.event', eventId, {
      data: ctx.request.body.data,
    });

    return { data: updated };
  },

  // 🗑️ SUPPRIMER un événement (si propriétaire)
  async delete(ctx) {
    const user = ctx.state.user;
    const eventId = ctx.params.id;

    const existing = await strapi.entityService.findOne('api::event.event', eventId, {
      populate: ['user'],
    }) as { user?: { id: number } };

    if (!existing || existing.user?.id !== user.id) {
      return ctx.unauthorized('Vous ne pouvez pas supprimer cet événement.');
    }

    const deleted = await strapi.entityService.delete('api::event.event', eventId);
    return { data: deleted };
  }
}));
