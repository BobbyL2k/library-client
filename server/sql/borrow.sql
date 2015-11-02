UPDATE books
  SET left = left -1
  WHERE id = ?
  AND left > 0;
-- [id to borrow,borrower name]
