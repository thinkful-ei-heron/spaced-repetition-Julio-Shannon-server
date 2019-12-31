/* eslint-disable no-undef */
/* eslint-disable no-console */
class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class linkedList {
  constructor() {
    this.head = null;
  }
  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }
  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }

  insertBefore(item, value) {
    let currNode = this.head;
    let newNode = this.head;
    if (this.head.value === item) {
      this.insertFirst(value);
    } else {
      while (currNode !== null && currNode.value !== item) {
        newNode = currNode;
        currNode = currNode.next;
      }
      newNode.next = new _Node(value, currNode);
    }
  }

  insertAfter(item, value) {
    // let currNode = this.head;
    // let nextNode = this.head;

    // if(this.head.value === item) {
    //   this.insertFirst(value);
    // } else {
    //   while ((currNode !== null) && (currNode.value !== item)) {
    //     nextNode = currNode;
    //     currNode = currNode.next;
    //   }
    // }
    //   // console.log(currNode.next)
    //   // console.log(nextNode)
    //   // console.log(value)
    //   currNode.next = new _Node(value, nextNode);
    let currNode = this.find(item);
    let nextNode = currNode.next;

    currNode.next = new _Node(value, nextNode);
  }

  insertAt(index, value) {
    let currIndex = 0;
    let currNode = this.head;
    while (currIndex !== index - 1) {
      currNode = currNode.next;
      currIndex++;
    }
    currNode.next = new _Node(value, currNode.next.next);
  }

  find(item) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }
  remove(item) {
    if (!this.head) {
      return null;
    }
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }
    let currNode = this.head;
    let previousNode = this.head;
    while (currNode !== null && currNode.value !== item) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log('Item not found');
      return;
    }
    previousNode.next = currNode.next;
  }

  //it prints the content of the list
  printList() {
    let curr = this.head;
    let str = '';
    while (curr) {
      str += curr.value + ' ';
      curr = curr.next;
    }
    console.log(str);
  }

  //it returns the size of the list
  sizeOfList() {
    let currNode = this.head;
    let count = 0;
    while (currNode !== null) {
      count++;
      currNode = currNode.next;
    }
    return count;
  }

  isEmpty() {
    if (this.head === null) {
      return true;
    } else return false;
  }

  //it finds previous item in the list
  findPrevious(item) {
    let currNode = this.head;
    let prevNode = currNode;

    if (currNode === null) {
      return 'Empty List';
    } else {
      while (currNode !== null && currNode.value !== item) {
        prevNode = currNode;
        currNode = currNode.next;
      }
    }
    return prevNode;
  }

  findLast() {
    let currNode = this.head;
    while (currNode.next !== null) {
      currNode = currNode.next;
    }
    return currNode;
  }

  // reverse(list, length = this.sizeOfList()) {
  //   console.log(list)
  //   if(length === 0) {
  //     return list;
  //   }
  //   let lastNode = this.findLast();
  //   let preNode = this.findPrevious(lastNode.value);
  //   preNode.next = null;
  //   lastNode.next = this.head.next;
  //   this.reverse(list, length - 1);
  // }
  reverse(node) {
    if (node.next !== null) {
      this.reverse(node.next);
      node.next.next = node;
      node.next = null;
    } else {
      this.head = node;
    }
  }

  thirdFromTheEnd() {
    let currNode = this.head;
    while (currNode.next.next.next !== null) {
      currNode = currNode.next;
    }
    return currNode;
  }

  middleOfList(list) {
    let currNode = list.head;
    console.log(currNode);
    let middleNode = list.head;
    let cnt = 0;
    if (currNode === null) return null;

    while (currNode.next !== null) {
      currNode = currNode.next;
      if (cnt) {
        middleNode = middleNode.next;
      }
      cnt++;
      cnt = cnt % 2;
    }
    // console.log('middle' + middleNode.value);
    return middleNode;
  }

  isCyle(list) {
    let currNode = list.head;
    let checkList = [];

    while (currNode !== null) {
      if (!currNode.next) return 'Is not a cycle';
      if (checkList.includes(currNode.next)) return 'It is a cycle';
      checkList.push(currNode);
      currNode = currNode.next;
    }
  }
}
module.exports = linkedList;
