CREATE TABLE IF NOT EXISTS books(
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT ,
  bookName TEXT,
  bookSubname TEXT,
  author TEXT,
  subAuthor TEXT,
  translator TEXT,
  edition TEXT,
  left INTEGER DEFAULT 1,
  totalBook INTEGER DEFAULT 1,
  publisher TEXT,
  publishedYear INTEGER(4),
  ISBN TEXT,
  dewey TEXT,
  category TEXT
);
