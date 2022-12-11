import * as entry from '../controllers/entry';
import { Router as expressRouter } from 'express';

const router = expressRouter();

router.post('/entries', entry.addEntry);
router.get('/', (req, res) => res.status(200).send('Hey there!'));

export default router;
