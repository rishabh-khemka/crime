var express= require("express"),
    router=express.Router();
    

 var connection = require("./database");
 
 
 
//TO sign up
router.post("/signup", function(req, res, next){
    req.check('password', 'Invalid password').isLength({min: 4});
    var errors= req.validationErrors();
    if(errors){
        req.session.errors=errors;
        req.session.success = false;
    }
    var user=req.body.user_name;
    var password=req.body.password;
    var cpassword=req.body.cpassword;
    if(password===cpassword)
    {
        var sql="INSERT INTO login (username, password) VALUES (?, ?)";
        connection.query(sql,[user, password], function (err, rest) {
            if (err)  {
                req.flash("error", "Username already exists");
                res.redirect("/signup");
            }
            else{
                req.flash("success","Successfully Signed up");
                req.flash("error", "Log in to continue..");
                res.redirect("/");
                console.log("1 record inserted");
                 }
            });
    }
    else{
         req.flash("error", "Password mismatch");
                res.redirect("/signup");
    }
});

//Sign up form
router.get("/signup", function(req, res, next){
 res.render("index/signup", {title: 'form validation', success: req.session.success, errors:req.session.errors});
 req.session.errors=null;
});

//landing page
router.get("/", function(req, res){
    res.render("index/landing");
});


//Login page
router.post("/", function(req, res){
    var user=req.body.username;
    var password=req.body.password;
      connection.query('SELECT * FROM login WHERE username = ?',[user], function (error, results, fields) {
                 if (error) {
                         console.log("error ocurred",error);
                           
                   }
                   else
                   {
                       if(results.length >0)
                       {
                             if(results[0].password == password)
                             {
                                 res.render("index/home");
                             }
                              else
                              {
                                    req.flash("error", "Username and password do not match");
                                    res.redirect("/");
                        }
                    }
                    else
                    {
                        req.flash("error", "Username doesnot exist");
                                    res.redirect("/");
                    }
                }
 });

});

router.get("/home", function(req, res){
    res.render("index/home");
});

// logout route
 router.get("/logout", function(req, res){
    req.flash("success", "Logged you out!");
   res.redirect("/");
});

module.exports=router;
