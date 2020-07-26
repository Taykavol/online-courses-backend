import { Router } from "express";
const simpleOauth = require('simple-oauth2');
const axios = require('axios');

/* Create your lichess OAuth app on https://lichess.org/account/oauth/app/create
 * Homepage URL: http://localhost:8087
 * Callback URL: http://localhost:8087/callback
 */

/* --- Fill in your app config here --- */
const port = 3000;
const clientId = 'IKGglix7XImcYLPc';
const clientSecret = '43nbT0LBFw3UGjUy2eNrPOzWv07Vg0zF';
const redirectUri = `http://localhost:${port}/lichess/callback`;
// uncomment the scopes you need
// list of scopes: https://lichess.org/api#section/Authentication
const scopes = [
    "email:read"
  // 'preference:read',
  // 'challenge:read',
  ];
/* --- End of your app config --- */

/* --- Lichess config --- */
const tokenHost = 'https://oauth.lichess.org';
const authorizePath = '/oauth/authorize';
const tokenPath = '/oauth';
/* --- End of lichess config --- */

const oauth2 = simpleOauth.create({
  client: {
    id: clientId,
    secret: clientSecret,
  },
  auth: {
    tokenHost,
    tokenPath,
    authorizePath,
  },
});

const state = Math.random().toString(36).substring(2);
const authorizationUri = `${tokenHost}${authorizePath}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&state=${state}`;

const app = Router();

// Show the "log in with lichess" button
app.get('/', (req, res) => res.send('Hello<br><a href="auth">Log in with lichess</a>'));

// Initial page redirecting to Lichess
app.get('/auth', (req, res) => {
  console.log(authorizationUri);
  res.redirect(authorizationUri);
});

// Redirect URI: parse the authorization token and ask for the access token
app.get('/callback', async (req, res) => {
  try {
    const result = await oauth2.authorizationCode.getToken({
      code: req.query.code,
      redirect_uri: redirectUri
    });
    console.log(result);
    const token = oauth2.accessToken.create(result);
    const userInfo = await getUserInfo(token.token);
    const userEmail = await getUserEmail(token.token);
    const email = userEmail.data.email
    const title = userInfo.data.title
res.app.set('yoy', 'sdfsdf')
    res.redirect('/?email='+email)
    // res.redirect('/')
    // console.log(email,title)
    // console.log(userEmail.data.email)
    // res.send()
    // const {email} = userInfo.email
    // console.log(userInfo.email)
    // res.send(`<h1>Success!</h1>Your lichess user info: <pre>${JSON.stringify(userInfo.data)}</pre>`);
  } catch(error) {
    console.error('Access Token Error', error.message);
    res.status(500).json('Authentication failed');
  }
});


function getUserInfo(token) {
  return axios.get('/api/account', {
    baseURL: 'https://lichess.org/',
    headers: { 'Authorization': 'Bearer ' + token.access_token }
  });
}
function getUserEmail(token) {
    return axios.get('/api/account/email', {
      baseURL: 'https://lichess.org/',
      headers: { 'Authorization': 'Bearer ' + token.access_token }
    });
  }
export default app