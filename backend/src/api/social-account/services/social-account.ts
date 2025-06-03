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
      if (err.response) {
        strapi.log.error('❌ Facebook callback error:', JSON.stringify(err.response.data, null, 2));
      } else {
        strapi.log.error('❌ Facebook callback error:', err.message);
      }

      return ctx.internalServerError('Facebook callback failed');
    }
  },

async handleLinkedinCallback(ctx) {
  const { code } = ctx.request.body;

  if (!code) {
    return ctx.badRequest('Missing code');
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:5173/dashboard/social-accounts';

  try {
    strapi.log.info('🔁 Exchange LinkedIn code for access token');

    const tokenRes = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      },
    });

    const accessToken = tokenRes.data.access_token;
    strapi.log.info(`✅ LinkedIn access token: ${accessToken}`);

    // Utiliser /v2/userinfo avec le scope "profile"
    const userRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    strapi.log.info('📦 LinkedIn user data:');
    strapi.log.info(JSON.stringify(userRes.data, null, 2));

    // Sécurisation du parsing
    const { sub: accountId, name } = userRes.data;

    if (!accountId) {
      throw new Error('LinkedIn userinfo response missing sub (accountId)');
    }

    if (!name) {
      strapi.log.warn(`⚠️ LinkedIn userinfo response missing name → fallback to LinkedInUser-${accountId}`);
    }

    const username = name || `LinkedInUser-${accountId}`;

    const user = ctx.state.user;

    const existing = await strapi.entityService.findMany('api::social-account.social-account', {
      filters: {
        provider: 'linkedin',
        account_id: accountId,
        user: user.id,
      },
    });

    if (existing.length === 0) {
      await strapi.entityService.create('api::social-account.social-account', {
        data: {
          provider: 'linkedin',
          account_id: accountId,
          access_token: accessToken,
          username,
          user: user.id,
        },
      });
      strapi.log.info(`✅ LinkedIn account linked: ${username} (accountId: ${accountId})`);
    } else {
      strapi.log.info(`ℹ️ LinkedIn account already linked: ${username} (accountId: ${accountId})`);
    }

    return { success: true };
  } catch (err) {
    if (err.response) {
      strapi.log.error('❌ LinkedIn callback error:', JSON.stringify(err.response.data, null, 2));
    } else {
      strapi.log.error('❌ LinkedIn callback error:', err.message);
    }

    return ctx.internalServerError('LinkedIn callback failed');
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

  async deleteAccount(ctx) {
    const user = ctx.state.user;
    const id = ctx.params.id;

    const entry = await strapi.entityService.findOne('api::social-account.social-account', id, {
      populate: ['user'],
    }) as { user?: { id: number } };

    if (!entry?.user || entry.user.id !== user.id) {
      return ctx.unauthorized('Vous ne pouvez pas supprimer ce compte');
    }

    await strapi.entityService.delete('api::social-account.social-account', id);
    return ctx.send({ success: true });
  },

  // 🚀 Nouvelle méthode : récupérer les pages Facebook du user
  async getFacebookPages(ctx) {
  const user = ctx.state.user;

  // Récupérer le compte FB lié
  const accounts = await strapi.entityService.findMany('api::social-account.social-account', {
    filters: {
      provider: 'facebook',
      user: user.id,
    },
  });

  if (accounts.length === 0) {
    return ctx.badRequest('Aucun compte Facebook lié.');
  }

  const accessToken = accounts[0].access_token;

  try {
    // Appel à /me/accounts
    const pagesRes = await axios.get('https://graph.facebook.com/v22.0/me/accounts', {
      params: {
        access_token: accessToken,
        fields: 'id,name,access_token',
      },
    });

    strapi.log.info('📄 Facebook Pages récupérées :');
    strapi.log.info(JSON.stringify(pagesRes.data?.data || [], null, 2));

    return { data: pagesRes.data?.data || [] };
  } catch (err: any) {
    if (err.response) {
      strapi.log.error('❌ Facebook pages error:', JSON.stringify(err.response.data, null, 2));
    } else {
      strapi.log.error('❌ Facebook pages error:', err.message);
    }

    return ctx.internalServerError('Facebook pages fetch failed');
  }
},


});
