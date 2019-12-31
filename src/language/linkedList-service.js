const linkedList = require('./linkedList');
const LanguageService = require('./language-service');

const LinkedListService = {
  createList(words) {
    console.log('here');
    console.log(words);
    let wordList = new linkedList();
    words.forEach(word => wordList.insertLast(word));
    wordList.printList();
    return wordList;
  },

  updatePositionRight(list, word){
    let index = list.getIndex(word.id);
    let newIndex = word.memory_value + index;
    let head = list.head;
    if(head.value === word){
      let prevHead = head;
      head = head.next;
      LanguageService.updateHeadOfList(head);
      LanguageService.updateNextValue(prevHead);
    }
    list.remove(word);
    list.insertAt(newIndex, word);
    let listHead = list.getHeadOfList();
    console.log(listHead);

  },

  updatePositionWrong(list, word){
    list.remove(word);
    list.insertFirst(word);
  }
};

module.exports = LinkedListService;
