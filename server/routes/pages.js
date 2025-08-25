const express = require('express');
const router = express.Router();
const site = require('../data/site');

router.get('/about', (req,res)=> res.render('about', { page:'about', site }));
router.get('/pricing', (req,res)=> res.render('pricing', { page:'pricing', site }));
router.get('/portfolio', (req,res)=> res.render('portfolio', { page:'portfolio', site }));

module.exports = router;
