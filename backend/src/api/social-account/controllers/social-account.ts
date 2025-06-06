export default () => ({
  async facebookCallback(ctx) {
    return strapi.service('api::social-account.social-account').handleFacebookCallback(ctx);
  },

  async handleLinkedinCallback(ctx) {
    return strapi.service('api::social-account.social-account').handleLinkedinCallback(ctx);
  },

  async handleThreadsLink(ctx) {
    return strapi.service('api::social-account.social-account').handleThreadsLink(ctx);
  },

  async findForMe(ctx) {
    return strapi.service('api::social-account.social-account').findForMe(ctx);
  },

  async deleteAccount(ctx) {
    return strapi.service('api::social-account.social-account').deleteAccount(ctx);
  },

  async getFacebookPages(ctx) {
    return strapi.service('api::social-account.social-account').getFacebookPages(ctx);
  },
  async getThreadsProfile(ctx) {
    return strapi.service('api::social-account.social-account').getThreadsProfile(ctx);
  },
});
