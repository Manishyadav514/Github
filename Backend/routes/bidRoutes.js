const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const moment = require('moment')


router.get('/', async (req, res) => {
  try {
    const bids = await Bid.find();
    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    let data = {
        companyName: req.body.companyName,
        tenderId: req.body.tenderId,
        userId: req.body.userId,
        bidTime: moment().format(),
        cost: req.body.cost
    }
    const bid = await Bid.create(data);
    res.status(201).json({ message: 'Bid placed successfully', bid });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/tender/:tenderId', async (req, res) => {
    try {
      const bids = await Bid.find({ tenderId: req.params.tenderId }).sort({ bidCost: 1 });
      res.json(bids);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Update a bid by ID
  router.put('/:id', async (req, res) => {
    try {
      const bid = await Bid.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!bid) {
        return res.status(404).json({ error: 'Bid not found' });
      }
      res.json({ message: 'Bid updated successfully', bid });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Delete a bid by ID
  router.delete('/:id', async (req, res) => {
    try {
      const bid = await Bid.findByIdAndDelete(req.params.id);
      if (!bid) {
        return res.status(404).json({ error: 'Bid not found' });
      }
      res.json({ message: 'Bid deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;