const linkedList = require('./linkedList');
const LanguageService = require('./language-service');

const LinkedListService = {
  // createList(words) {
  //   let wordList = new linkedList();
  //   words.forEach(word => wordList.insertLast(word));
  //   //wordList.printList();
  //   return wordList;
  // },

  //attempt 2 at linked list
  createLinkedList(headWord, db){
    let wordList = new linkedList();
    while(headWord.next !== null){
      wordList.insertLast(headWord);
      headWord = LanguageService.getNextWord(db, headWord.next);
    }
    wordList.printList();
    return wordList;
  },

  // updatePositionRight(list, word){
  //   let index = list.getIndex(word.id);
  //   let newIndex = word.memory_value + index;
    // let head = list.head;
    // if(head.value === word){
    //   let prevHead = head;
    //   head = head.next;
    //   LanguageService.updateHeadOfList(head);
    //   LanguageService.updateNextValue(prevHead);
    // }
    // list.remove(word);
    // list.insertAt(newIndex, word);
    // let listHead = list.getHeadOfList();
    // console.log(listHead);
  // },

  // updatePositionWrong(list, word){
  //   list.remove(word);
  //   list.insertFirst(word);
  // },

  ///attempting something new

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
