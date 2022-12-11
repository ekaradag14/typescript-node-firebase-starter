import * as functions from 'firebase-functions';
import express from 'express';
import routes from './routes/routes';

const app = express();
app.use('/', routes); // requests are handled here
exports.app = functions.https.onRequest(app);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
