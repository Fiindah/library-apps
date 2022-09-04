/**
 * [
 *    {
 *      id: <string> | <number>,
 *      title: <string>,
 *      author: <string>,
 *      year: <number>,
 *      isCompleted: <boolean>
 *    }
 * ]
 */

const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'BOOK_APPS';

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isCompleted = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, title, author, year, isCompleted);
    books.push(bookObject);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
    return +new Date();
  }
   
function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id: +new Date(),
      title,
      author,
      year,
      isCompleted
    }
  }

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function makeBook(bookObject) {
  const {id, title, author, year, isCompleted} = bookObject;
  
  const textTitle = document.createElement("h3");
  textTitle.innerText = title;
  
  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis: " + author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun: " + year;
    
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");
        
  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear);
  container.append(buttonContainer);
  container.setAttribute("id", `book-${id}`);
  
  if (isCompleted) {
    
    const undoButton = document.createElement("button");
    undoButton.innerText = "Belum selesai dibaca";
    undoButton.classList.add("green");
    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.innerText = "Hapus buku";
    trashButton.classList.add("red");
    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(id);
    });
    
    buttonContainer.append(undoButton, trashButton);
  } else {

    const finishButton = document.createElement("button");
    finishButton.innerText = "Selesai dibaca"
    finishButton.classList.add("green");
    finishButton.addEventListener("click", function () {
      addBookToCompleted(id);
    });
    
    const trashButton = document.createElement("button");
    trashButton.innerText = "Hapus buku";
    trashButton.classList.add("red");
    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(id);
    });
    
    buttonContainer.append(finishButton, trashButton);
    }

    return container;
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

/**
* Fungsi ini digunakan untuk menyimpan data ke localStorage
* berdasarkan KEY yang sudah ditetapkan sebelumnya.
*/  
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
  
/**
* Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
*
* @returns boolean
*/
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see todos}
 */
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
  
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function() {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
  const completedBOOKList = document.getElementById("completeBookshelfList");
  
  uncompletedBOOKList.innerHTML = '';
  completedBOOKList.innerHTML = '';
    
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      completedBOOKList.append(bookElement);
    } else { 
      uncompletedBOOKList.append(bookElement);
    }
  }
});

document.addEventListener(SAVED_EVENT, function () {
  console.log('Data berhasil di simpan.');
});