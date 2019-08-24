#Dialogflow + Cloud firestore example

This is an example of a fulfillment webhook for Dialogflow, where Cloud Firestore is queried and results are returned in form of a carousel.

This example is based off a coffee shop, with the user asking for the menu of the shop.

This is just a sample, to use it, you must:

1. Login in via dialogflow
2. Create agent and intent
3. Create appropriate training phrases "Directions", "Opening Hours", "Browse Menu"
4. For all intent, remove all responses and enable fulfillment by webhook
5. Paste the index.js and package.json file in fulfillment, and deploy the Cloud Function