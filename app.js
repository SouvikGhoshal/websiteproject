//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose=require("mongoose");
const { pullAll } = require("lodash");
//  const request = require('request-promise');
const Request = require('request');
const { json } = require("body-parser");
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const posts=[];
const titles=[];
const app = express();
productsList=[]
app.set('view engine', 'ejs');
value=null;
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const newDoc=[];
var counter=0;
mongoose.connect("mongodb+srv://souvik:test123@cluster0.oupql.mongodb.net/SHOPDATABASE",{useNewUrlParser:true});
// mongoose.connect("mongodb://localhost:27017/shopDatabase",{useNewUrlParser:true});
var positive=0;
const productSchema={
  productId:String,
  productName:String,
  productType:String,
  productBatch:String,
  productManufacturingDate:String,
  productExpDate:String,
  productPrice:Number,
  productTitle:String,
  productDescription:String,
  productImage:String,
  sellerId:String,
  sellerName:String,
  comments:[],
  
}


const userSchema={
  email: String,
  password: String,
  address1:String,
  address2:String,
  city:String,
  inputstate:String,
  zip:Number,
  purchasedItems:[],
  cartItems:[],
  loginStatus:Boolean,
  loggedOutStatus:Boolean,
                          
  username:String

}

const sellerSchema={email: String,
  password: String,
  address1:String,
  address2:String,
  city:String,
  inputstate:String,
  zip:Number,
  sellingItems:[],
  loginStatus:Boolean,
  loggedOutStatus:Boolean,
  username:String,
  sellerId:String
}
const User= mongoose.model("user",userSchema);
const Product= mongoose.model("product",productSchema);
const Seller=mongoose.model("seller",sellerSchema);

//route satisfied has to be made

app.route("/:userId/:productId/satisfied").post(function(req,res){


Product.findOne({productId:productId},function(err,Proddoc){
  if(!err){ 
  User.findOne({_id:userId,},function(err,newDoc){
    if(!err){
            if(req.body.yes=="true"){
                   
                      Product.update(
                        {"comments.useremail":newDoc.email},
                        {$set:
                         {"satisfied":1}});
                         res.render("productdetails",{userDoc:newDoc,product:Proddoc,purchasedele:false})
                 
                        }
            else{
                   
                      Product.update(
                        {"comments.useremail":newDoc.email},
                        {$set:
                         {"satisfied":0}});
                         res.render("productdetails",{userDoc:newDoc,product:Proddoc,purchasedele:false})
                  }
             }
          })
      }
  
  })
})

app.route("/notsatisfied").post(function(req,res){
  
  Product.findOne({productId:productId},function(err,Proddoc){
    if(!err){
    User.findOne({_id:userId,},function(err,newDoc){
      if(!err){
      if(req.body.yes=="true"){
        res.render("productdetails",{userDoc:newDoc,product:Proddoc,purchasedele:false})
        }
      else{
        res.render("productdetails",{userDoc:newDoc,product:Proddoc,purchasedele:false})
      }}
    })}
    
  })
  console.log(req.body);
})

app.route("/slogin").get(function(req,res){
  res.render("sellerlogin");
}).post(function(req,res){

         Seller.findOne({email:req.body.email,password:req.body.password},function(err,sellerDoc){
        if(!err){
                if(sellerDoc){ 
                              Product.find({sellerId:sellerDoc.sellerId},function(err,prods){
                               if(!err){     
                                prods.forEach(function(prod){
                                 
                                      prod.comments.forEach(function(comment){
                                       counter=counter+1;
                                       if(comment.sentimentAsociate.predictions[0]===1){
                                        console.log("the predicted value"+comment.sentimentAsociate.predictions[0])   
                                        positive++
                                         console.log("the number of positives are new"+positive)  
                                         console.log("comment array size"+counter)
                                         
                                      }
                                      
                                      })
                                    
                    })
                    
                    positivepercent=(positive/counter)*100
                    console.log( "positive percent"+positivepercent)
                    res.render("selleradd",{sellerDoc:sellerDoc,prods:prods,positivepercent:positivepercent})            
                            }
 
                      }) }


                else{
                          res.render("sellerlogin")
                    }
              }

          })
  })






app.route("/:user_id/:productid/comment").post(function(req,res){
 
  console.log(req.params.user_id+"products"+req.params.productid)
  
  console.log(req.params.productid);
  console.log(req.body);
 User.findOne({_id:req.params.user_id},function(err,newDoc){
   if(!err){
     
     var today = new Date();
     var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
     var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
     var dateTime = date+' '+time;


var sentiment=[];
Request.post({
  "headers": { "content-type": "application/json" },
  "url": "  https://my-api-nlp.herokuapp.com/souvikNLP",
  "body": JSON.stringify({
  "comment":req.body.newcomment,
      
  })
}, (error, response, body) => {
  if(error) {
      return console.dir(error);
  }
   
  //  console.log("the sentiment"+JSON.stringify(sentiment))
  console.dir(JSON.parse(body));
  var obj={
    "Ratings" : req.body.rating,
    "comment" : req.body.newcomment,
    "date" : dateTime,
    "username" :newDoc.username,
    "useremail" : newDoc.email,
    "satisfied" :null,
    "comentdone":true,
    "sentimentAsociate":JSON.parse(JSON.stringify(JSON.parse(body)))
  }

  Product.update({productId:req.params.productid},{$push:{comments:obj}},function(err){
    if(!err) {
      Product.findOne({productId:req.params.productid},function(err,Proddoc){
        if(!err){
           res.render("productdetails",{userDoc:newDoc,product:Proddoc,purchasedele:false})
      
                  }
             })
          }
        })
 });

     console.log("the sentiment value before posting"+sentiment)
    
  }
 })

})





app.route("/info/:productId/:check").post(function(req,res){
  // console.log(req.params.productId+"userid is"+user_id);
  Product.findOne({productId:req.params.productId},function(err,product){
   if(!err){
   
    if(req.params.check=="not_in"){
      res.render("productdetails",{userDoc:null,product:product,purchasedele:false})
     }
    else{
          User.findOne({_id:req.params.check},function(err,userDoc){
          if(!err){
               
          res.render("productdetails",{userDoc:userDoc,product:product,purchasedele:userDoc.purchasedItems.includes(req.params.productId)})
     }
    })
    }
   
    }


  });
  
  console.log(req.params.check);
});

app.route("/home/:userid").post(function(req,res){
  console.log(req.params.userid);
  User.findOne({_id:req.params.userid},function(err,doc){
    Product.find(function(err,docs){
        res.render("home",{value:doc,productsList:docs})
    })
  })


})


app.route("/cart/:productId/:userId/:value")
.post(function(req,res){
  console.log(req.params.userId+"prod"+req.params.productId+"operations"+req.params.value);
  if(req.params.value==="purchase")
  {User.update({_id:req.params.userId},{$push:{purchasedItems:req.params.productId}},function(err,doc){
    if(!err){

      User.findOne({_id:req.params.userId},function(err,doc){
        if(!err){
          console.log("new value"+doc);
         
          doc.purchasedItems.push(req.params.productId);
          console.log("New value"+doc)
          res.render("purchase",{userDoc:doc ,userId:req.params.userId,productId:req.params.productId})
         
          
          
        }
      })
   
    }
  })
   
  
  }

  else if(req.params.value==="delete") { 
  
    User.update({cartItems:req.params.productId},{$pull:{cartItems:req.params.productId}},function(err){
      if(!err){
        User.findOne({_id:req.params.userId},function(err,doc){
          if(!err){
          Product.find().where('productId').in(doc.cartItems).exec((err, records) => {
            if(!err){
                      console.log("main"+records+doc)
                      res.render("cart",{userDoc:doc,records:records});
                }
            });
          }
        })
      }
    });

  }
})
// app.get("/cart",function(req,res){
// app.render(cart)

// })

// app.get("/cart",function(req,res){
//   console.log(req.params.productId) 
//   console.log(req.body.em)
//   console.log(req.body.un)
//   console.log("loading cart")
 
//   //app.render("cart",{productId:req.params.productId,email:req.body.em,username:req.body.un});
// })

app.route("/cart/:_id").get(function(req,res){
  console.log(req.params._id)
}).post(function(req,res){
    User.findOne({_id:req.params._id},function(err,doc){
    if(err){
            console.log(err)
          }
 else{

      Product.find().where('productId').in(doc.cartItems).exec((err, records) => {
      if(!err){
                console.log("sucessfull"+records)
                res.render("cart",{userDoc:doc,records:records});
          }
    });
   
  
  };
  })
 
  
})


app.post("/login/:productId",function(req,res){
  console.log(req.params.productId) 
  console.log(req.body.em)
  console.log(req.body.un)
  console.log("loading cart")
 User.update({email:req.body.em},{$push:{cartItems:req.params.productId}},function(err){
             if(!err){
               User.findOne({email:req.body.em},function(err,doc){
                 if(!err){
                   console.log(doc);
                res.render("home",{value:doc,productsList:productsList});
              }
               })
             }
           })
           
  })
  
  

app.get("/",function(req,res){

//console.log(posts);
Product.find(function(err,products){
  if(!err){
    
productsList=products.slice();
console.log("the product list is"+productsList);
res.render("home",{value:value,productsList:productsList});

  }
})



    })
app.get("/about",function(req,res){
  res.render("about",{value:contactContent});
    })



  app.get("/signup",function(req,res){
    res.render("signup",{value:contactContent});
    
        })
    app.post("/signup",function(req,res){
     console.log(req.body)
      const user=new User({email:req.body.email,
                          password:req.body.password,
                          address1:req.body.address1,
                          address2:req.body.address2,
                          city:req.body.city,
                          inputstate:req.body.inputstate,
                          zip:req.body.zip,
                          username:req.body.userName,
                          loginStatus:true,
                          
                          

        })  
      user.save(function(err){
        if(err){
          console.log(err)
        }

        else
        {
          console.log("Saved sucessfully")
        }
      });

res.redirect("/");
    });


app.post("/loggedout",function(req,res){
  
  res.redirect("/")
})

app.route("/login").get(function(req,res){
  res.render("login",{value:contactContent});
}).post(function(req,res){
console.log(req.body);
User.findOne({email:req.body.email,
password:req.body.password},function(err,doc){
if(err){
  console.log("Erroroccured"+err)
  res.redirect("/login");
}
else{
  if(doc){
console.log("login success"+doc);
User.updateOne({email:doc.email,
                password:doc.password},{loginStatus:true},function(err){
                  if(err){
                    console.log(err)
                  }
                  else{
                    console.log("logged in")
                    res.render("home",{value:doc ,productsList:productsList});
                    // res.render("partials/header",{value:doc});

                  }
                })

}
  else{
  console.log("incorrect data")
  res.redirect("/login");
      }
  }
})
})

app.get("/contact",function(req,res){
  res.render("contact",{value:aboutContent});
    })
    



app.get("/posts/:title",function(req,res){
posts.forEach(function(post){
  if(_.lowerCase(req.params.title)==_.lowerCase(post.title)){
res.render("post",{value:post});
  }
else{
  console.log(_.lowerCase(req.params.title)==_.lowerCase(post.title))
}
});


})
  
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server started sucessfully");
});
