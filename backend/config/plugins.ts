module.exports = ({ env }) => ({
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            user: 'monfeed.hk@gmail.com',
            pass: 'iznf enjz gwjx xxhj'
          },
          secure: false
        },
        settings: {
          defaultFrom: 'monfeed.hk@gmail.com',
          defaultReplyTo: 'monfeed.hk@gmail.com'
        }
      }
    }
  })
  