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
      // Log pour debug
      strapi.log.info('Exchange code for access token');
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
      console.log('Access token:', accessToken);

      const userRes = await axios.get('https://graph.facebook.com/me', {
        params: {
          access_token: accessToken,
          fields: 'id,name',
        },
      });

      console.log('Facebook user data:', userRes.data);

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
        strapi.log.error('Facebook callback error:', JSON.stringify(err.response.data, null, 2));
      } else {
        strapi.log.error('Facebook callback error:', err.message);
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
async handleThreadsLink(ctx) {
  const { access_token } = ctx.request.body;

  if (!access_token) {
    return ctx.badRequest('Missing access_token');
  }

  try {
    strapi.log.info('🔁 Using provided Threads access token');

    const userRes = await axios.get('https://graph.threads.net/v1.0/me?fields=id,username', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    strapi.log.info('📦 Threads user data:');
    strapi.log.info(JSON.stringify(userRes.data, null, 2));

    const { id: accountId, username } = userRes.data;
    const user = ctx.state.user;

    const existing = await strapi.entityService.findMany('api::social-account.social-account', {
      filters: {
        provider: 'threads',
        account_id: accountId,
        user: user.id,
      },
    });

    if (existing.length === 0) {
      await strapi.entityService.create('api::social-account.social-account', {
        data: {
          provider: 'threads',
          account_id: accountId,
          access_token,
          username,
          user: user.id,
        },
      });
      strapi.log.info(`✅ Threads account linked: ${username} (accountId: ${accountId})`);
    } else {
      strapi.log.info(`ℹ️ Threads account already linked: ${username} (accountId: ${accountId})`);
    }

    return { success: true };
  } catch (err) {
    if (err.response) {
      strapi.log.error('❌ Threads link error:', JSON.stringify(err.response.data, null, 2));
    } else {
      strapi.log.error('❌ Threads link error:', err.message);
    }

    return ctx.internalServerError('Threads link failed');
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
async getThreadsProfile(ctx) {
  const user = ctx.state.user;

  try {
    const accounts = await strapi.entityService.findMany('api::social-account.social-account', {
      filters: {
        provider: 'threads',
        user: user.id,
      },
    });

    if (accounts.length === 0) {
      return ctx.badRequest('Aucun compte Threads lié.');
    }

    const accessToken = accounts[0].access_token;

    const res = await axios.get('https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = res.data;

    return {
      username: data.username,
      threads_profile_picture_url: data.threads_profile_picture_url,
    };

  } catch (err) {
    if (err.response) {
      strapi.log.error('❌ Threads profile error:', JSON.stringify(err.response.data, null, 2));
    } else {
      strapi.log.error('❌ Threads profile error:', err.message);
    }

    return ctx.internalServerError('Threads profile fetch failed');
  }
},

async getThreadsAccount(ctx) {
  const user = ctx.state.user;

  try {
    // Étape 1 → récupérer le compte Threads en BDD
    const accounts = await strapi.entityService.findMany('api::social-account.social-account', {
      filters: {
        provider: 'threads',
        user: user.id,
      },
    });

    if (accounts.length === 0) {
      return ctx.badRequest('Aucun compte Threads lié.');
    }

    const account = accounts[0];

    // Étape 2 → récupérer le profil Threads
    const profileRes = await axios.get('https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url', {
      headers: {
        Authorization: `Bearer ${account.access_token}`,
      },
    });

    const profileData = profileRes.data;

    // On renvoie tout d’un coup
    return {
      provider: 'threads',
      account_id: account.account_id,
      access_token: account.access_token,
      username: profileData.username,
      profile_picture_url: profileData.threads_profile_picture_url,
    };

  } catch (err) {
    if (err.response) {
      strapi.log.error('❌ Threads account error:', JSON.stringify(err.response.data, null, 2));
    } else {
      strapi.log.error('❌ Threads account error:', err.message);
    }

    return ctx.internalServerError('Threads account fetch failed');
  }
},


async postThreadsPost(ctx) {
  const user = ctx.state.user;
  const { message } = ctx.request.body;

  if (!message || message.trim() === '') {
    return ctx.badRequest('Le message est requis.');
  }

  try {
    // Récupérer le compte Threads
    const accounts = await strapi.entityService.findMany('api::social-account.social-account', {
      filters: {
        provider: 'threads',
        user: user.id,
      },
    });

    if (accounts.length === 0) {
      return ctx.badRequest('Aucun compte Threads lié.');
    }

    const account = accounts[0];
    const accessToken = account.access_token;
    const accountId = account.account_id;

    // Étape 1 → Créer le container
    strapi.log.info(`🚀 Création container Threads pour user ${user.id}`);

    const containerRes = await axios.post(
      `https://graph.threads.net/v1.0/${accountId}/threads`,
      null,
      {
        params: {
          media_type: 'TEXT',
          text: message,
          access_token: accessToken,
        },
      }
    );

    const creationId = containerRes.data.id;
    strapi.log.info(`✅ Container créé : ${creationId}`);

    // IMPORTANT : Threads recommande d'attendre ~30s, mais on peut tester sans attendre pour dev
    // En prod, tu peux mettre un setTimeout ou queue de job.

    // Étape 2 → Publier le container
    const publishRes = await axios.post(
      `https://graph.threads.net/v1.0/${accountId}/threads_publish`,
      null,
      {
        params: {
          creation_id: creationId,
          access_token: accessToken,
        },
      }
    );

    const postId = publishRes.data.id;
    strapi.log.info(`✅ Post Threads publié : ${postId}`);

    return { success: true, postId };

  } catch (err) {
    if (err.response) {
      strapi.log.error('❌ Threads post error:', JSON.stringify(err.response.data, null, 2));
    } else {
      strapi.log.error('❌ Threads post error:', err.message);
    }

    return ctx.internalServerError('Threads post failed');
  }
}



});
