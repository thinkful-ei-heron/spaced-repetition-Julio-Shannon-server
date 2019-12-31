const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const LinkedListService = require('./linkedList-service');
const jsonBodyParser = express.json();

const languageRouter = express.Router();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );

    res.json({
      language: req.language,
      words,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/head', async (req, res, next) => {
  try {
    console.log(req.language);
    const headWord = await LanguageService.getHeadWord(
      req.app.get('db'),
      req.language.id,
      req.language.head
    );
    console.log(headWord);
    res.status(200).json({
      nextWord: headWord.original,
      translation: headWord.translation,
      totalScore: req.language.total_score,
      wordCorrectCount: headWord.correct_count,
      wordIncorrectCount: headWord.incorrect_count,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.post( '/guess', jsonBodyParser, async (req, res, next) => {
  if(!req.body.answer || !req.body.word_id){
    res.status(400).json({error: 'missing required field'})
  }

  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );
    let list = await LinkedListService.createList(words);
    console.log(list);
    let word = await LanguageService.getTranslation(
      req.app.get('db'),
      req.body.word_id
    );
    if (word.translation === req.body.answer) {
      let updatedWord = await LanguageService.correctAnswer(req.app.get('db'), word);
      let language = await LanguageService.updateTotalScore(req.app.get('db'), req.language);
      LinkedListService.updatePositionRight(list, updatedWord)
    } else {
      let updatedWord = await LanguageService.incorrectAnswer(req.app.get('db'), word);
      LinkedListService.updatePositionWrong(list, updatedWord)
    }
    res.status(200).json({ list });
  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter;
