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
    // 🚀 AJOUT : route simple pour tester avec token Threads
    {
      method: 'POST',
      path: '/social-account/threads/link',
      handler: 'social-account.handleThreadsLink',
      config: {
        scope: ['plugin::users-permissions.user'],
      },
    },
    {
      method: 'POST',
      path: '/social-account/linkedin/callback',
      handler: 'social-account.handleLinkedinCallback',
      config: {
        scope: ['plugin::users-permissions.user'],
      },
    },
    {
  method: 'GET',
  path: '/social-account/threads/profile',
  handler: 'social-account.getThreadsProfile',
  config: {
    scope: ['plugin::users-permissions.user'],
  },
},

{
  method: 'GET',
  path: '/social-account/threads/account',
  handler: 'social-account.getThreadsAccount',
  config: {
    scope: ['plugin::users-permissions.user'],
  },
},

{
  method: 'POST',
  path: '/social-account/threads/post',
  handler: 'social-account.postThreadsPost',
  config: {
    scope: ['plugin::users-permissions.user'],
  },
}


  ],
};
