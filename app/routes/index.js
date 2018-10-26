import express from 'express';

const router = express.Router();

/* Redirect all to app page. */
router.get('*', (req, res) => {
    res.render('index');
});

export default router;
