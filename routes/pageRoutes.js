const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

// View Routes
router.get('/', pageController.getMainPage);
router.get('/phrase/:id', pageController.getOnePhrase);
//
// Action Routes
router.post('/contact/new', pageController.createContact);

module.exports = router;