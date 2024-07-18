const express = require('express');
const router = express.Router();
const Tender = require('../models/Tender');
const moment = require('moment')


router.get('/', async (req, res) => {
  try {
    const tenders = await Tender.find();
    console.log({ tenders }); // Corrected console.log statement
    res.json(tenders);
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({ error: 'Internal Server Error' });
  }
  return
});

router.post('/', async (req, res) => {
  try {
    let data = {
      name: req.body.name,
      description: req.body.name,
      startTime: moment().format(),
      endTime: moment().add(72, 'hours').format(),
      bufferTime: 2,
    }
    const tender = await Tender.create(data);
    res.status(201).json({ message: 'Tender created successfully', tender });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }
    res.json(tender);
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    let data = {
      name: req.body.name,
      description: req.body.name,
      startTime: moment().format(),
      endTime: moment().add(72, 'hours').format(),
      bufferTime: 2,
    }
    const tender = await Tender.create(data);
    res.status(201).json({ message: 'Tender created successfully', tender });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tender = await Tender.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }
    res.json({ message: 'Tender updated successfully', tender });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a tender by ID
router.delete('/:id', async (req, res) => {
  try {
    const tender = await Tender.findByIdAndDelete(req.params.id);
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }
    res.json({ message: 'Tender deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;