var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var async = require('async');
var errTxt = "DB_ERROR";

var editColumns = [
      "bookName",
      "bookSubname",
      "author",
      "subAuthor",
      "translator",
      "edition",
      "left",
      "totalBook",
      "publisher",
      "publishedYear",
      "ISBN",
      "dewey",
      "category"
]

function isNum(val){//Expensive
  return /^[0-9]+$/.test(val);
}
function funcWrap(meth,name){
  var args = [];
  for(var i=2;i<arguments.length;i++){
    args.push(arguments[i]);
  }
  return function(callback){
    args.push(callback);
    meth[name].apply(meth,args);
  }
}
function isValidNumInput(txt){
  if(txt==""||!txt)return true;

  return isNum(txt);
}
function getNum(txt){
  var matched = txt.match(/[0-9]/g)
  return matched?matched.join(""):"";
}
function Library(Database,callback){
  var db = Database;
  function checkLibrary(callback){
    async.parallel(
      [
        function(callback){
          db.run(cmd("createBooksTable.sql"),callback);
        }
        ,
        function(callback){
          db.run(cmd("createBorrowListTable.sql"),callback);
        }
      ],function(err){
          if(err)return callback(new Error(errTxt));
          callback();
        }
    )
  }
  function isBookAvailable(id,callback){
    db.all(cmd("getBookLeft.sql"),id,function(err,rows){
      if(err)
        return callback(new Error(errTxt));
      if(rows.length==0)
        return callback(new Error("NOT_EXIST"));
      callback(null,rows[0].left > 0);
    });
  }
  function addBook(bookInfo,callback){
    if(!isValidNumInput(bookInfo.publishedYear))
      return callback(new Error("WRONG_INT"));
    db.run(cmd("addBook.sql"),[
      bookInfo.bookName,
      bookInfo.bookSubname,
      bookInfo.author,
      bookInfo.subAuthor,
      bookInfo.translator,
      bookInfo.edition,
      bookInfo.left,
      bookInfo.totalBook,
      bookInfo.publisher,
      bookInfo.publishedYear,
      bookInfo.ISBN,
      bookInfo.dewey,
      bookInfo.category
    ],function(err){
      if(err)return callback(new Error(errTxt));
      callback();
    });
  }
  function delBook(id,callback){
    db.run(cmd("deleteBook.sql"),id,function(err){
      if(err)return callback(new Error(errTxt));
      callback();
    })
  }
  function increaseMaximumBook(id,amount,callback){
    db.run(cmd("increaseMaximumBook.sql"),[id,amount],function(err){
      if(err)return callback(new Error(errTxt));
      callback();
    });
  }
  function listBook(callback){
    db.all("SELECT * FROM books;",function(err,rows){
      if(rows==undefined)rows=[];
      if(err)return callback(new Error(errTxt));
      callback(null,rows);
    });
  }
  function isBorrowing(id,borrower,callback){
    db.all(cmd("borrowCheck.sql"),[id,borrower],function(err,rows){
      if(err)return callback(new Error(errTxt));
      callback(null,rows.length>0);
    })
  }
  function borrowerList(callback){
    db.all(cmd("borrowerList.sql"),function(err,rows){
      if(rows==undefined)rows=[];
      if(err)return callback(new Error(errTxt));
      return callback(null,rows);
    })
  }
  this.editBook = function(id,data,callback){
    if(!isNum(id))return callback(new Error("WRONG_INT"));
    var newData = editColumns.map(function(col){
      return data[col]==undefined?null:data[col];
    })
    newData.unshift(id);
    db.run(cmd("editBook.sql"),newData,function(err){
      if(err)return callback(new Error(errTxt));
      return callback(null);
    });
  }
  this.borrowBook = function (id,borrower,callback){
    isBorrowing(id,borrower,function(err,isBorrow){
      if(err)return callback(err);
      if(isBorrow)return callback(new Error("ALREADY_BURROW"));
      isBookAvailable(id,function(err){
        if(err)return callback(err);
        async.series([
          funcWrap(db,"run","BEGIN;"),
          funcWrap(db,"run",cmd("borrow.sql"),[id]),
          funcWrap(db,"run",cmd("addBorrowList.sql"),[id,borrower]),
          function(callback){
            db.run("COMMIT;",callback);
          }
        ],function(err){
          if(err)return callback(new Error(errTxt))
          callback();
        });
      });
    })
  }
  this.returnBook = function (id,borrower,callback){
    function doReturn(err,isBorrowed){
      if(err)return callback(new Error(errTxt));
      if(!isBorrowed) return callback(new Error("NOT_BORROW"));
      async.series([
        funcWrap(db,"run","BEGIN;"),
        funcWrap(db,"run",cmd("returnBook.sql"),[id]),
        funcWrap(db,"run",cmd("deleteBorrowRow.sql"),[id,borrower]),
        funcWrap(db,"run","COMMIT;")
      ],function(err){
        if(err)return callback(new Error(errTxt));
        callback();
      });
    }
    isBorrowing(id,borrower,doReturn);
  }
  this.importDatabase = function(fileName,callback){// '\n' seperated row '\t' seperated columns
    var rows = fs.readFileSync(fileName).toString("utf16le").split("\n");
    var colNames = [
      "bookName",
      "bookSubname",
      "author",
      "subAuthor",
      "translator",
      "edition",
      "totalBook",
      "publisher",
      "publishedYear",
      "ISBN",
      "dewey",
      "category"
    ];
    rows.forEach(function(row,rowIdx){
      if(rowIdx==0)return;
      var tRow = {};
      row.split('\t').forEach(function(cell,idx){
        tRow[colNames[idx]] = cell;
      });
      addBook(tRow,function(err){
        if(err){
          console.log(err);
          process.exit();
        };
      })
    })
  }
  checkLibrary(function(){
    callback();
  });
  this.listBorrower = borrowerList;
  this.listBook = listBook;
  this.isBookAvailable = isBookAvailable;
  this.addBook = addBook;
  this.deleteBook = delBook;
}


function cmd(sqlFileName){
  return fs.readFileSync("./sql/" + sqlFileName).toString();
}
exports.Library = function(fileName,callback){
  return new Library(new sqlite3.Database(fileName),callback);
}
