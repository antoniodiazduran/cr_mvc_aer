// controllers/pageController.js
const Page = require('../models/pageModel');


exports.getMainPage = async (req, res) => {
    try {
        const mainPhrase = await Page.findOnePhrase();
        res.render('page/index', { 
            mainPhrase,         
            title: 'ArmandoEReyes',
            navs: 'yes',
            search: 'no',
        });
    } catch (error) {
        res.status(500).send('Error loading page: ' + error.message);
    }
};
exports.getOnePhrase = async (req, res) => {
    try {
        const onePhrase = await Page.findByRow(req.params.id*1);
        res.render('page/phrase', { 
            onePhrase,         
            title: 'ArmandoEReyes',
        });
    } catch (error) {
        res.status(500).send('Error loading phrase: ' + error.message);
    }
};
// HANDLE CREATE (Create)
exports.createContact = async (req, res) => {
    try {
        const { rid, transactionDate, Phrase, Tag   } = req.body;
        await Page.create({ 
            // name, 
            // price: parseFloat(price), 
            // stock: parseInt(stock) || 0, 
            rid: parseInt(rid) || 0,
            transactionDate,
            Phrase,
            Tag
        });
        res.redirect('/page');
    } catch (error) {
        res.status(500).send('Error creating contact: ' + error.message);
    }
};

