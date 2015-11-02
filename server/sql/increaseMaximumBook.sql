UPDATE books
  SET totalBook = totalBook + ?2,left = left + ?2
  WHERE id = ?1;
