const router = require("express").Router();

const conn = require("../DB/dbconnections");
const authorized = require("../middleware/authorize");
const admin = require("../middleware/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/uploadimages");
const util = require("util"); // helper
const fs = require("fs"); // file system
const { Console } = require("console");


// admin
// crreate movie 
  router.post("",
  authorized,
  upload.single("image"),
  body("Title")
  
  .isString()
  .withMessage("please enter a valid Title !")
  .isLength({min:5})
  .withMessage("Book title should be at least 5 characters"),
  )

  router.post("",authorized,body("Subject")
  .isString()
  .withMessage("please enter a valid subject !")
  .isLength({min:2})
  .withMessage("Book subject should be at least 2 characters"),
  )
  router.post("",authorized,body("Author")
  .isString()
  .withMessage("please enter a valid Author !")
  .isLength({min:2})
  .withMessage("Author name  should be at least 2 characters"),

  router.post("",authorized,body("Rack_number")
  .isString()
  .withMessage("please enter a valid Rack_number !")
  .isLength({min:1})
  .withMessage("Rack_number  should be at least 1 characters"),
  
  
  async(req,res)=>{ 
    try{
    // Validation Request[manual,express validation]
const errors = validationResult(req);
if (!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
}

// validate image 
// if(!req.file){

//   return res.status(400).json( {

//     errors: [{
//         "msg":"image is required",
//     },
// ],
// })
// }
// prepare movie object

const Book = {
  Title: req.body.Title,
  Author	: req.body.Author	,
  Subject: req.body.Subject,
  // Photo: req.file.originalname,
  Rack_number: req.body.Rack_number
};


// insert into database

const query = util.promisify(conn.query).bind(conn);
await query("insert into books set ? ", Book);
res.status(200).json({
  msg: "Book added successfully !",
});
} catch (err) {
  console.log(err);
res.status(500).json(err);


    res.status(200).json({
      
    
      msg:req.body,
    })
  }
  }),


  router.put(
    "/:ISBN", // params
    authorized,
    upload.single("image"),
    body("Title")
      .isString()
      .withMessage("please enter a valid book name")
      .isLength({ min: 10 })
      .withMessage("book title should be at lease 10 characters"),
  
    body("Subject")
      .isString()
      .withMessage("please enter a valid Subject ")
      .isLength({ min: 2 })
      .withMessage("Subject name should be at lease 2 characters"),

      body("Author")
      .isString()
      .withMessage("please enter a valid Author ")
      .isLength({ min: 2 })
      .withMessage("Author name should be at lease 2 characters"),


      ("",body("Rack_number")
      .isString()
      .withMessage("please enter a valid Rack_number !")
      .isLength({min:1})
      .withMessage("Author name  should be at least 1 characters"),



    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const query = util.promisify(conn.query).bind(conn);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // 2- CHECK IF MOVIE EXISTS OR NOT
        const Book = await query("select * from books where ISBN = ?", [
          req.params.ISBN,
        ]);
        if (!Book[0]) {
          res.status(404).json({ ms: "movie not found !" });
        }
  
        // 3- PREPARE Book OBJECT
        const BookObj = {
          Title: req.body.Title,
          Author	: req.body.Author	,
          Subject: req.body.Subject,
          // Photo: req.file.originalname,
          Rack_number: req.body.Rack_number
        };
  
        if (req.file) {
          BookObj.image_url = req.file.filename;
          fs.unlinkSync("../upload/" + book[0].image_url); // delete old image
        }

        

        await query("insert into books set ? ", Book);

        res.status(200).json({
 
          msg: "Book added successfully !",
});
  
        // 4- UPDATE Book
        await query("update books set ? where ISBN = ?", [BookObj, book[0].id]);
  
        res.status(200).json({
          msg: "Book updated successfully",
        });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  )));
  
 
  router.delete(

    "/:ISBN",
    async (req,res)=>{
      try{
        // check if book exist
        const query = util.promisify(conn.query).bind(conn);
        const Book = await query ("select * from books where ISBN = ?",[
          req.params.ISBN,
        ]);
        if (!Book[0]){
          res.status(404).json({msg: "book not found !"});
        }
        // remove movie image 
        fs.unlinkSync("../upload/"+ Book[0].image_url);
        await query("delete from books where ISBN = ?", [Book[0].ISBN]);
        res.status(200).json({
          msg: "book deleted successfully",
        });
      }catch(err){
      console.log(err);
        res.status(500).json(err);
      }
    }
  )
  

  
    
  

      
    
        
  // user [list]

  router.get("",(req,res)=>{

    res.status(200).json({
      library: [],
    })
  }),


  module.exports = router