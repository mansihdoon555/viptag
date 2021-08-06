var express = require('express');
var router = express.Router();
var Zendesk = require('zendesk-node-api');
 var request = require('request');
const { json } = require('express');
var zendesk = new Zendesk({
  url: "https://privyreviews.zendesk.com", // https://example.zendesk.com
  email: "hello@privy.reviews", // me@example.com
  token: "fRZQIMIWJ0ixMEAwUjL1qcMvIawyGycc1x8Araz3" // hfkUny3vgHCcV3UfuqMFZWDrLKms4z3W2f6ftjPT
});
var RequesterID="";
var UserEmail="";
var TicketID="";
/* GET home page. */
router.get('/:id', async function(req, res, next) {
  var ticid = req.params.id;
  TicketID=ticid;
  console.log(TicketID);
await getTicketRequesterId(ticid,res);
//res.end( JSON.stringify("Ok"));
//res.render('index', { title: "API Call Successfully"});
});

async function getTicketRequesterId(ticketID,res)
{
  zendesk.tickets.show(ticketID).then(async function(result){
    //console.log(result);
    RequesterID=result.requester_id;
await getUserEmailByUserID(RequesterID,ticketID,res);
});
}

async function getUserEmailByUserID(userID,ticketID,res)
{
  zendesk.users.show(userID).then(async function(result){
   // console.log(result);
   UserEmail=result.email;
   if(UserEmail!=null || UserEmail!='')
   {
     await updateTicketVipTags(UserEmail,ticketID,res);
   }
   else
   {
    res.end( JSON.stringify("Ok"));
   }
//await getUserEmailByUserID(RequesterID);
});
}

async function updateTicketVipTags(useremail,ticketID,res)
{
 
  request('http://staging.privy.reviews/api/zendesk/verify-subscriber/'+useremail,async function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var data=JSON.parse(body);
      console.log(ticketID);
        if(data.subscribed==true)
        {
          zendesk.tickets.update_many(ticketID, {
            additional_tags:['vip_cust','cust_checked']
          }).then(function(result){
            console.log(result);
            res.end( JSON.stringify("Ok"));
          });
        }
        else
        {
          zendesk.tickets.update_many(ticketID, {
            additional_tags:['cust_checked']
          }).then(function(result){
            console.log(result);
            res.end( JSON.stringify("Ok"));
          });

        }
     }
})
}
module.exports = router;
