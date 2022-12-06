import * as functions from 'firebase-functions';
import express from 'express';
import { addEntry } from './entryController';

const app = express();
app.get('/', (req, res) => res.status(200).send('Hey there!'));
app.post('/entries', addEntry);
exports.app = functions.https.onRequest(app);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
