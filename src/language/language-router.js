const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const LinkedListService = require('./linkedList-service');
const jsonBodyParser = express.json();
const linkedList = require('./linkedList');

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
    const headWord = await LanguageService.getHeadWord(
      req.app.get('db'),
      req.language.id,
      req.language.head
    );
    res.status(200).json({
      nextWord: headWord.original,
      //translation makes the test no longer pass
      //translation: headWord.translation,
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
  if(!req.body.guess){
    return res.status(400).json({error: 'Missing \'guess\' in request body'})
  }

  try {
    // const words = await LanguageService.getLanguageWords(
    //   req.app.get('db'),
    //   req.language.id
    // );
//start new attempt LL
    let headWord = await LanguageService.getHeadWord(
      req.app.get('db'),
      req.language.id,
      req.language.head
    );
    let total = req.language.total_score;
    let guess = req.body.guess.toLowerCase();
    let memoryValue = headWord.memory_value;
    let correct_count = headWord.correct_count;
    let incorrect_count = headWord.incorrect_count;
    let result;
    
    //Creating a wordList linked list to iterate over when needing
    //to determine new next values.
    
    let wordList = new linkedList();
    let tempNode = headWord;
    while(tempNode.next !== null){
      wordList.insertLast(tempNode);
      tempNode = await LanguageService.getNextWord(req.app.get('db'), tempNode.next);
    }
    wordList.insertLast(tempNode);


    if(guess === headWord.translation.toLowerCase()) {
      total++;
      memoryValue = memoryValue * 2;
      correct_count++;
      result = 'correct';
    } else {
      memoryValue= 1;
      incorrect_count++;
      result = 'incorrect';
    }  

    let returnResults = {
      result,
      original: headWord.original,
      translation: headWord.translation,
      userGuessed: guess,
      total,
      correct_count,
      incorrect_count
    }

    let updateLang = {
      head: headWord.next,
      total_score: total
    }

    //setting the req.language.head value so we know what the next word is.
    req.language.head = headWord.next

    await LinkedListService.updateLanguageTable(
      req.app.get('db'),
      req.language.id,
      updateLang
    )
    
    let counter = 0;
    let currNode = wordList.head;
    while(counter !== memoryValue && currNode.next !== null){
      currNode = currNode.next;
      counter++;
    }

    temp = currNode
    let temp2 = headWord;
    temp2.next = currNode.next;
    currNode.next = headWord;
    
    let updateHeadWord = {
      memory_value: memoryValue,
      correct_count,
      incorrect_count,
      next: temp2.next ? temp2.next.value.id : null
    }

    let updateNext = {
      next: currNode.next.id
    }

    await LinkedListService.updateWord(
      req.app.get('db'),
      updateHeadWord,
      headWord.id);
    await LinkedListService.updateWord(
      req.app.get('db'),
      updateNext,
      currNode.value.id
      );

      let nextWord = await LanguageService.getHeadWord(
        req.app.get('db'),
        req.language.id,
        req.language.head
      );

      //per tests, this is the goal of what should be returned from the /guess endpoint
      let testResult = 
      {
        nextWord: nextWord.original,
        totalScore: total,
        wordCorrectCount: correct_count,
        wordIncorrectCount: incorrect_count,
        answer: headWord.translation,
        isCorrect: result === 'correct' ? true : false
      }
  
//end new attempt LL

    // let list = await LinkedListService.createList(words);
    // let word = await LanguageService.getTranslation(
    //   req.app.get('db'),
    //   req.body.word_id
    // );

    // if (word.translation === req.body.answer) {
    //   let updatedWord = await LanguageService.correctAnswer(req.app.get('db'), word);
    //   let language = await LanguageService.updateTotalScore(req.app.get('db'), req.language);
    //   LinkedListService.updatePositionRight(list, updatedWord)
    // } else {
    //   let updatedWord = await LanguageService.incorrectAnswer(req.app.get('db'), word);
    //   LinkedListService.updatePositionWrong(list, updatedWord)
    // }
    res.status(200).json(testResult);
  } catch (error) {
    next(error);
  }
});

module.exports = languageRouter;
