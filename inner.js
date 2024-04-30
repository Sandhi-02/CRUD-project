const books = [];
const completedBooks = [];

const addForm = document.getElementById("add-form");
const editForm = document.getElementById("edit-form");
const booksContainer = document.getElementById("books-container");
const completedBooksContainer = document.getElementById("completed-books-container");
const editModal = document.getElementById("edit-modal");
const closeBtn = document.getElementById("close-btn");

let editingBookId = null;

// Fungsi untuk merender daftar buku
function renderBooks() {
  booksContainer.innerHTML = "";
  completedBooksContainer.innerHTML = "";

  books.forEach((book) => {
    const bookItem = createBookItem(book);
    if (book.isComplete) {
      completedBooksContainer.appendChild(bookItem);
    } else {
      booksContainer.appendChild(bookItem);
    }
  });
}

// Fungsi untuk membuat elemen buku
function createBookItem(book) {
  const bookItem = document.createElement("div");
  bookItem.classList.add("book-item");

  const bookInfo = document.createElement("div");
  bookInfo.classList.add("inner");
  bookInfo.innerHTML = `
            <h2>${book.title}</h2>
            <p>${book.author}</p>
            <p>${book.year}</p>`;

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("btn-control");

  if (book.isComplete) {
    // tambahakan button kembali
    const buttonBack = document.createElement("button");
    buttonBack.classList.add("btn", "btn-back");
    buttonBack.innerText = "kembali";
    buttonBack.addEventListener("click", () => {
      undoBook(book.id);
      renderBooks();
    });

    // Tombol hapus
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-delete");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () => {
      deleteBook(book.id);
    });

    buttonsContainer.append(buttonBack, deleteButton);
  } else {
    // tambahakan button dibaca
    const buttonBaca = document.createElement("button");
    buttonBaca.classList.add("btn", "btn-baca");
    buttonBaca.innerText = "dibaca";
    buttonBaca.addEventListener("click", () => {
      book.isComplete = buttonBaca;
      renderBooks();
    });

    // Tombol edit
    const editButton = document.createElement("button");
    editButton.classList.add("btn", "btn-edit");
    editButton.innerText = "Edit";
    editButton.addEventListener("click", () => {
      openEditModal(book.id);
    });

    // Tombol hapus
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-delete");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () => {
      deleteBook(book.id);
    });

    buttonsContainer.append(buttonBaca, editButton, deleteButton);
  }

  bookItem.appendChild(bookInfo);
  bookItem.appendChild(buttonsContainer);

  return bookItem;
}

addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addBook();
});

// Fungsi untuk menambahkan buku
function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = Number(document.getElementById("year").value);

  const newBook = {
    id: Date.now(),
    title,
    author,
    year,
    isComplete: false,
  };

  books.push(newBook);
  saveData();
  renderBooks();
  addForm.reset();
}

// funsi pembantu mengembalika buku
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

// fungsi mengembalikan buku
function undoBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  saveData();
  renderBooks();
}

// Fungsi untuk menghapus buku
function deleteBook(bookId) {
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
  }
  saveData();
  renderBooks();
}

// Fungsi untuk membuka modal edit
function openEditModal(bookId) {
  editingBookId = bookId;
  const bookToEdit = books.find((book) => book.id === editingBookId);

  if (bookToEdit) {
    document.getElementById("edit-title").value = bookToEdit.title;
    document.getElementById("edit-author").value = bookToEdit.author;
    document.getElementById("edit-year").value = bookToEdit.year;
  }

  editModal.style.display = "flex";
}

editForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("edit-title").value;
  const author = document.getElementById("edit-author").value;
  const year = Number(document.getElementById("edit-year").value);

  const bookToEdit = books.find((book) => book.id === editingBookId);

  if (bookToEdit) {
    bookToEdit.title = title;
    bookToEdit.author = author;
    bookToEdit.year = year;
  }

  saveData();
  editModal.style.display = "none";
  renderBooks();
});

closeBtn.addEventListener("click", () => {
  editModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === editModal) {
    editModal.style.display = "none";
  }
});

///////
function searchBooks() {
  const searchKeyword = document.getElementById("search-input").value.toLowerCase();
  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchKeyword));
  renderFilteredBooks(filteredBooks);
}

// Fungsi untuk merender daftar buku yang disaring
function renderFilteredBooks(filteredBooks) {
  booksContainer.innerHTML = "";
  completedBooksContainer.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookItem = createBookItem(book);
    if (book.isComplete) {
      completedBooksContainer.appendChild(bookItem);
    } else {
      booksContainer.appendChild(bookItem);
    }
  });
}

//fungsi save data dan penyimpanan lokal

function saveData() {
  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("completedBooks", JSON.stringify(completedBooks));
}

// Fungsi untuk memuat data dari Local Storage
function loadData() {
  const savedBooks = localStorage.getItem("books");
  const savedCompletedBooks = localStorage.getItem("completedBooks");

  if (savedBooks) {
    books.length = 0;
    books.push(...JSON.parse(savedBooks));
  }

  if (savedCompletedBooks) {
    completedBooks.length = 0;
    completedBooks.push(...JSON.parse(savedCompletedBooks));
  }
}

loadData();
renderBooks();
