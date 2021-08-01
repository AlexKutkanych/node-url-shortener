const { Router } = require('express')
const config = require('config');
const shortid = require('shortid');
const { Types: { ObjectId } } = require('mongoose');

const Link = require('../models/Link');
const auth = require('../middleware/auth.middleware');

const router = Router();

router.post('/generate', auth, async (req, res) => {
  try {
    const baseUrl = config.get('baseUrl');
    const { from } = req.body;

    const code = shortid.generate();

    const existing = await Link.findOne({ from });

    if (existing) {
      return res.json({ link: existing });
    }

    const to = baseUrl + '/t/' + code;

    const link = new Link({
      code, to, from, owner: req.body.userId
    });

    await link.save();

    res.status(201);  

  } catch(err) {
    res.status(500).json({ message: 'Smth is wrong' })
    console.log(err)
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);

  } catch(err) {
    res.status(500).json({ message: 'Smth is wrong' })
    console.log()
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const links = await Link.findById(new ObjectId(req.params.id));
    res.json(links);
  } catch(err) {
    res.status(500).json({ message: 'Smth is wrong' })
    console.log()
  }
});

module.exports = router;