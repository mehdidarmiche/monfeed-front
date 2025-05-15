export default {
  routes: [
    {
      method: 'GET',
      path: '/events',
      handler: 'api::event.event.find',
      config: {
        auth: { scope: [] }, // accessible aux utilisateurs connectés
      },
    },
    {
      method: 'POST',
      path: '/events',
      handler: 'api::event.event.create',
      config: {
        auth: { scope: [] },
      },
    },
    {
      method: 'PUT',
      path: '/events/:id',
      handler: 'api::event.event.update',
      config: {
        auth: { scope: [] },
      },
    },
    {
      method: 'DELETE',
      path: '/events/:id',
      handler: 'api::event.event.delete',
      config: {
        auth: { scope: [] },
      },
    },
    {
      method: 'POST',
      path: '/events/generate-description',
      handler: 'api::event.event.generateDescription',
      config: {
        auth: false, // publique
      },
    },
  ],
};
