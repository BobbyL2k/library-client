var express = require('express');
var bl = require('bl');
var async = require('async');
var router = express.Router();
var db;
var bookCol = [
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
    ];
function errResponse(res,err){
  res.end(JSON.stringify({status:"error",error:err.toString()}));
}
function success(res,data){
  data.status = "success";
  res.end(typeof data === "string"?data:JSON.stringify(data));
}
router.get('/dump',function(req,res,next){
  var dumpData = {};
  function listBook(callback){
    db.listBook(function(err,rows){
      if(err)return callback(err);
      dumpData.visibleIndex = [
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
      dumpData.searchableIndex = [
        "bookName",
        "bookSubname",
        "author",
        "subAuthor",
        "translator",
        "edition",
        "publish",
        "publishedYear",
        "ISBN",
        "dewey",
        "category"
      ]
      callback(null,rows);
    });
  }
  function listBorrower(callback){
    db.listBorrower(function(err,rows){
      if(err)return callback(err);
      callback(null,rows);
    })
  }
  async.parallel([
    listBook,
    listBorrower,
    ],function(err,ret){
      dumpData.book = ret[0];
      dumpData.borrowerList = ret[1];
        success(res,JSON.stringify(dumpData,null," "));
    });

});
router.post('/return',function(req,res){
  req.pipe(bl(function(err,data){
    if(err)return errResponse(res,new Error("Data error"));
    try{
      data = JSON.parse(data);
      data = data.data;
      if(data.bookId==undefined || data.borrower == undefined)
        return errResponse(res,"bookID or borrower is null");
      db.returnBook(data.bookId,data.borrower,function(err){
        if(err)return errResponse(res,err);
        success(res,{});
      });
    }catch(e){
      return errResponse(res,new Error("Parse JSON failed.Bad format."));
    }
  }));
});
router.post('/borrow',function(req,res){
  req.pipe(bl(function(err,data){
    if(err)
      errResponse(res,new Error("Data error"));
    try{
      data = JSON.parse(data);
      data = data.data;
      if(data.bookId==undefined || data.borrower == undefined)
        return errResponse(res,"bookID or borrower is null");
      db.borrowBook(data.bookId,data.borrower,function(err){
        if(err)return errResponse(res,err);
        success(res,{});
      })
    }catch(e){
      return errResponse(res,new Error("Parse JSON failed.Bad format."));
    }
  }));
});

router.post('/add',function(req,res){
  req.pipe(bl(function(err,data){
    if(err)
      errResponse(res,new Error("Data error"));
    try{
    data = JSON.parse(data);
    db.addBook(data,function(err){
      if(err)return errResponse(res,err);
      success(res,{});
    });
    }catch(e){
      console.log(e);
      return errResponse(res,new Error("Parse JSON failed.Bad format."));
    }

  }));
});
router.post('/delete',function(req,res){
  req.pipe(bl(function(err,data){
    if(err)
      errResponse(res,new Error("Data error"));
    try{
      data = JSON.parse(data);
      db.deleteBook(data.id,function(err){
        if(err)errResponse(err);
        success(res,{});
    });
    }catch(e){
      console.log(e);
      return errResponse(res,new Error("Parse JSON failed.Bad format."));
    }
    if(err)
      errResponse(res,new Error("Data error"));
  }));
})
router.post('/edit',function(req,res){
  req.pipe(bl(function(err,data){
    if(err)
      errResponse(res,new Error("Data error"));
    try{
      data = JSON.parse(data);
      db.editBook(data.id,data,function(err){
        if(err)errResponse(err);
        success(res,{});
      });
    }catch(e){
      console.log(e);
      return errResponse(res,new Error("Parse JSON failed.Bad format."));
    }
  }));
})
router.get('/bookColumns',function(req,res){
  res.end(JSON.stringify(bookCol));
});
module.exports = function(Database){
  db = Database;
  return router;
};
// module.exports = function(Database){
//   db = Database;
//   return router;
// }
