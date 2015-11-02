UPDATE books
  SET 
  bookName = ?2,
  bookSubname = ?3,
  author = ?4,
  subAuthor = ?5,
  translator = ?6,
  edition = ?7,
  left = ?8,
  totalBook = ?9,
  publisher = ?10,
  publishedYear =?11,
  ISBN = ?12,
  dewey = ?13,
  category =?14
  WHERE id = ?1;