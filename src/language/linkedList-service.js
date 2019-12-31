const linkedList = require('./linkedList');

const LinkedListService = {
  createList(words) {
    let wordList = new linkedList();
    words.forEach(word => wordList.insertLast(word));
    wordList.printList();
    return wordList;
  },
};

module.exports = LinkedListService;
