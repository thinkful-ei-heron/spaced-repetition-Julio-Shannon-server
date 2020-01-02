const linkedList = require('./linkedList');
const LanguageService = require('./language-service');

const LinkedListService = {
  updateLanguageTable(db, language_id, changes){
    return db
      .from('language')
      .update(
        changes
      )
      .where({id: language_id})
      .returning('*')
      .then(([language]) => language);
  },

  updateWord(db, changes, word_id){
    return db
    .from('word')
    .update(changes)
    .where({id: word_id})
    .returning('*')
    .then(([word]) => word);
  }
};

module.exports = LinkedListService;
