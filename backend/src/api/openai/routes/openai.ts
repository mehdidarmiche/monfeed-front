export default {
  routes: [
    {
      method: 'POST',
      path: '/openai/generate',
      handler: 'openai.generate',
      config: {
        auth: false,
      },
    },
  ],
};
