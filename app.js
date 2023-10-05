import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import contactsRouter from './routes/api/contacts-router.js';
import dotenv from 'dotenv/config';
import authRouter from './routes/api/auth-router.js';

//import ElasticEmail from '@elasticemail/elasticemail-client';

// const {ELASTIC_MAIL_API_KEY, ELASTIC_MAIL_FROM} = process.env;
 
// let defaultClient = ElasticEmail.ApiClient.instance;
 
// let {apikey} = defaultClient.authentications;
// apikey.apiKey = ELASTIC_MAIL_API_KEY
 
// let api = new ElasticEmail.EmailsApi()
 
// let email = ElasticEmail.EmailMessageData.constructFromObject({
//   Recipients: [
//     new ElasticEmail.EmailRecipient("riwiy94211@gronasu.com")
//   ],
//   Content: {
//     Body: [
//       ElasticEmail.BodyPart.constructFromObject({
//         ContentType: "HTML",
//         Content: "My test email content ;)"
//       })
//     ],
//     Subject: "test",
//     From: ELASTIC_MAIL_FROM
//   }
// });
 
// const callback = function(error, data, response) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log('API called successfully.');
//   }
// };
// api.emailsPost(email, callback);

dotenv.config();

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);
app.use(express.static("public"));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
});

export default app;


