import axios from 'axios';

export default () => ({
  async handleFacebookCallback(ctx) {
    const { code } = ctx.request.body;

    if (!code) {
      return ctx.badRequest('Missing code');
    }

    const clientId = process.env.FACEBOOK_APP_ID!;
    const clientSecret = process.env.FACEBOOK_APP_SECRET!;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:5173/dashboard/social-accounts';

    try {
      // 👉 Log pour debug
      strapi.log.info('🔁 Exchange code for access token');
      strapi.log.info(`client_id=${clientId}`);
      strapi.log.info(`redirect_uri=${redirectUri}`);
      strapi.log.info(`code=${code}`);

      const tokenRes = await axios.get('https://graph.facebook.com/v22.0/oauth/access_token', {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code,
        },
      });

      const accessToken = tokenRes.data.access_token;
console.log('✅ Access token:', accessToken);

const userRes = await axios.get('https://graph.facebook.com/me', {
  params: {
    access_token: accessToken,
    fields: 'id,name',
  },
});

console.log('📦 Facebook user data:', userRes.data);

const { id: accountId, name: username } = userRes.data;

      const user = ctx.state.user;

      const existing = await strapi.entityService.findMany('api::social-account.social-account', {
        filters: {
          provider: 'facebook',
          account_id: accountId,
          user: user.id,
        },
      });

      if (existing.length === 0) {
        await strapi.entityService.create('api::social-account.social-account', {
          data: {
            provider: 'facebook',
            account_id: accountId,
            access_token: accessToken,
            username,
            user: user.id,
          },
        });
      }

      return { success: true };
    } catch (err: any) {
      strapi.log.error('❌ Facebook callback error:');
      strapi.log.error(err.response?.data || err.message);
      return ctx.internalServerError('Facebook callback failed');
    }
  },

  async findForMe(ctx) {
    const user = ctx.state.user;

    const accounts = await strapi.entityService.findMany('api::social-account.social-account', {
      filters: {
        user: user.id,
      },
    });

    return { data: accounts };
  },
});
