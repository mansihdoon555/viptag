var express = require('express');
var router = express.Router();
var auth = require('basic-auth');
var compare = require('tsscmp');
/* GET users listing. */
var Zendesk = require('zendesk-node-api');
 var request = require('request');
const { json } = require('express');
var zendesk = new Zendesk({
  url: "https://privyreviews.zendesk.com", // https://example.zendesk.com
  email: "hello@privy.reviews", // me@example.com
  token: "fRZQIMIWJ0ixMEAwUjL1qcMvIawyGycc1x8Araz3" // hfkUny3vgHCcV3UfuqMFZWDrLKms4z3W2f6ftjPT
});
router.get('/data', async function(req, res, next) {
 
 res.render('index', { title: "API Call Successfully"});
});

router.post('/users',async function(req, res, next) {
  console.log(req.path);

//   if (req.path === '/users/users') {
//     return next();
// }

// check for basic auth header
if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    return res.status(401).json({ message: 'Missing Authorization Header' });
}

// verify auth credentials
const base64Credentials =  req.headers.authorization.split(' ')[1];
console.log(base64Credentials);
const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
console.log(credentials);
const [username, password] = credentials.split(':');

const user = await check(username, password);

if (!user) {
    return res.status(401).json({ message: 'Invalid Authentication Credentials' });
}
console.log(req.body.name);
zendesk.requests.create({
  status:'open',
  subject: 'Flagged reviews',
  requester: {
    name:req.body.email,
    email:req.body.email
  },
  comment: {
    body: req.body.desc
  }
}).then(function(result){
  console.log(result);
});
return res.status(201).json({ message: 'ok' });
//res.send("data");
// attach user to request object
//req.user = user

//next();


   //var user = auth({ name: 'john', pass: 'secret' });
 //var credentials = auth(req.headers);

    // Check credentials
  //The "check" function will typically be against your user store
  // if (!credentials || !check(credentials.name, credentials.pass)) {
  //   res.statusCode = 401
  //   res.setHeader('WWW-Authenticate', 'Basic realm="example"')
  //   res.end('Access denied')
  // } else {
  //   res.end('Access granted')
  // }
 // var user = auth({ name: 'john', pass: 'secret' });
 

 // res.send(user);
 res.send("data");
});

// Basic function to validate credentials for example
async function check (name, pass) {
  var valid = true
 
  // Simple method to prevent short-circut and use timing-safe compare
  valid = compare(name, 'john') && valid
  valid = compare(pass, 'secret') && valid
 
  return valid
}

module.exports = router;
