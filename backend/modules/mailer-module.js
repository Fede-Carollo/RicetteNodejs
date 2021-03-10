const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const google_cloud = require('../keys/google-cloud');

const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';



module.exports = class MailerModule {
  oauth2client;
  constructor()
  {
    this.oauth2client = new OAuth2(
      google_cloud.clientID,
      google_cloud.clientSecret,
      OAUTH_PLAYGROUND,
    )
  }

  sendEmail = (receiver, title, HTMLcontent) => {
    this.oauth2client.setCredentials({
      refresh_token: GMAIL_KEYS.refreshToken
    });

    this.oauth2client.getAccessToken()
      .then((accessToken) => {
        const smtpTransport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: google_cloud.email,
            clientId: google_cloud.clientID,
            clientSecret: google_cloud.clientSecret,
            refreshToken: google_cloud.refreshToken,
            accessToken: accessToken
          }
        })
        const mailOptions = {
          from: google_cloud.email,
          to: receiver,
          subject: "Soggetto",
          html: content
        }
        smtpTransport.sendMail(mailOptions, (err, info) => {
          if(err) return err;
          return info;
        })
      })
      .catch(err => { 
        console.error(error);
      })
  }
}

