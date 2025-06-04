export default {
  routes: [
    {
      method: 'POST',
      path: '/post/generate-post-message',
      handler: 'post.generatePostMessage',
      config: {
        auth: false, // ou true si tu veux protéger l'accès
      },
    },
  ],
};
