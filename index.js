'use strict';
 const {
   Carousel, 
   dialogflow, 
   BasicCard, 
   Image,
   Suggestions
 } = require('actions-on-google');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
const menuItemsImg = 'URL-TO-MENU-ITEMS-{ITEMID}.jpg';//{ITEMID} will be substituted for id of items obtained from firestore
const locationURL = 'GOOGLE-MAPS-URL';
const locationImageURL = 'IMAGE-OF-MAP-OF-CAFE-URL';

const app = dialogflow({debug: true});

app.intent('Default Welcome Intent', (conv) => {
    conv.ask('Welcome to CAFE_NAME! I can give you directions, tell you the opening hours and give your our menu. How can I help you today?');
  conv.ask(new Suggestions(['Get Directions', 'Opening hours', 'Menu']));
});

app.intent('Opening Hours', (conv) => {
   conv.ask("We're open everyday from 7 AM to 10 PM");
  conv.ask('Is there anything else I can help you with?');
});

app.intent('Directions', (conv) => {
  conv.ask("Directions to cafe");  
  conv.ask(new BasicCard({
        title: "Coffee Talk's Location",
        text: "Location Text",
        buttonText: "Get Directions",
        buttonUrl: locationURL,
        image: new Image({
            url: locationImageURL,
            alt: "Location of Cafe"
        })
      }));
  conv.ask('Is there anything else I can help you with?');
});

app.intent('Browse Menu', (conv) => {
    if (!conv.screen) {
        conv.ask('Some of our best sellers are latte, matcha latte and iced caramel frappe');
        return;
    }

   return db.collection("menuItems").get()
      .then ( snapshot => {
          console.log("I'm in!");
          if (snapshot.empty) {
          	conv.ask("We're currently updating our menu, please check back later!");
            return;
          }
          let snapArray = snapshot.docs;
          snapArray = snapArray.slice(0,8);
          const carouselItems = {};
          snapArray.forEach(doc => {
          	const data = doc.data();
            carouselItems[(data.id).toString()] = {
              title: data.name,
              image : new Image({
                url: menuItemsImg.replace('{ITEMID}', data.id),
                alt: data.name,
                height: 400,
                width: 400,
              }),
            };
          });
     
	     conv.ask("Here's the menu");
		  conv.ask(new Carousel({
          title: 'Our Menu',
          items: carouselItems
          }));

        }).catch((e) => {
  	console.log('error: ', e);
  	conv.close('Sorry, try asking me something else');
	});
});


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
    
//TODO: context, calendar, conversations