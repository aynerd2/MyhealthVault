const fetch = require('node-fetch'); // npm install node-fetch@2
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Auth0 config
const AUTH0_DOMAIN = 'dev-3v7v1p2eitnky481.us.auth0.com';
const AUTH0_AUDIENCE = 'https://healthvault-api';
const CLIENT_ID = 'cmwa0nATJMuqzGzZwKoQUnBZznrLvgKq';
const CLIENT_SECRET = 'Sxd2eZUXcDegYt2Wz4_6NACq5AYDCE17qYboekNa7YxEGUDMFVwhLPTs8Wo1YUqG';

// Setup JWKS client
const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
});

// Helper to get signing key
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// Step 1: Fetch a token from Auth0
async function fetchToken() {
  const response = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      audience: AUTH0_AUDIENCE,
      grant_type: 'client_credentials'
    })
  });

  const data = await response.json();
  if (!data.access_token) throw new Error('Failed to fetch token');
  return data.access_token;
}

// Step 2: Verify token
async function verifyToken() {
  try {
    const token = await fetchToken();
    console.log('Access token:', token);

    jwt.verify(token, getKey, {
      audience: AUTH0_AUDIENCE,
      issuer: `https://${AUTH0_DOMAIN}/`,
      algorithms: ['RS256']
    }, (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err.message);
      } else {
        console.log('Token is valid! Decoded payload:', decoded);
      }
    });
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Run
verifyToken();


// const { getAccessTokenSilently } = useAuth0();
// const token = await getAccessTokenSilently();

// // Test profile endpoint
// const response = await fetch('http://localhost:8000/api/users/me', {
//   headers: {
//     'Authorization': `Bearer ${token}`
//   }
// });

// const data = await response.json();
// console.log("NEW TOKEN DATA: ",data);