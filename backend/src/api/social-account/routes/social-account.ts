export default {
  routes: [
    {
      method: 'POST',
      path: '/social-account/facebook/callback',
      handler: 'social-account.facebookCallback',
      config: {
        scope: ['plugin::users-permissions.user'],
      },
    },
    {
      method: 'GET',
      path: '/social-account/me',
      handler: 'social-account.findForMe',
      config: {
        scope: ['plugin::users-permissions.user'],
      },
    },
    {
      method: 'DELETE',
      path: '/social-account/:id',
      handler: 'social-account.deleteAccount',
      config: {
        scope: ['plugin::users-permissions.user'],
      },
    },
    {
      method: 'GET',
      path: '/social-account/facebook/pages',
      handler: 'social-account.getFacebookPages',
      config: {
        scope: ['plugin::users-permissions.user'],
      },
    },
  ],
};
