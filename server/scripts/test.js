// require("dotenv").config();

// const { google } = require("googleapis");

// const oauth2Client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   "https://developers.google.com/oauthplayground"
// );

// oauth2Client.setCredentials({
//   refresh_token: process.env.REFRESH_TOKEN,
// });

// (async () => {
//   try {
//     const token = await oauth2Client.getAccessToken();

//     console.log("Access Token Generated");
//     console.log(token.token);

//     console.log("EMAIL_USER:", process.env.EMAIL_USER);
//   } catch (err) {
//     console.error(err);
//   }
// })();   