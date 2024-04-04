const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const exhbs = require('express-handlebars');
const dbo = require('./db')
const ObjectID = dbo.ObjectId
app.engine('hbs',exhbs.engine({layoutsDir: 'views/',defaultLayout:'main',extname:'.hbs'}));
app.set('view engine','.hbs')
app.set('views','views')

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', async(req, res) => {
    let database = await dbo.connectToDatabase()
    const collection = database.collection('products')
    const cursor =  collection.find({})
    let products = await cursor.toArray()
    let text = ''
    let edit_id, edit_product;
    if (req.query.edit_id) {
        edit_id = req.query.edit_id
        edit_product = await collection.findOne({_id:new ObjectID(edit_id)})
    }

    if (req.query.delete_id) {
         await collection.deleteOne({_id:new ObjectID(req.query.delete_id)})
         return res.redirect("/?status=3")
    }

    switch (req.query.status) {
        case '1':
            text = 'Product Added Successfully!'
            break;
        case '2':
            text = 'Product Updated Successfully!'
            break;    
        case '3':
            text = "Product Deleted!"
            break;  
        default:
            break;
    }
    res.render('main',{text,products,edit_id,edit_product})
})

app.post('/addProduct',async (req,res)=>{
   try {
        console.log(req.body)
        let database = await dbo.connectToDatabase()
        let collection = database.collection('products')
        await collection.insertOne(req.body)
        res.redirect('/?status=1')
   } catch (error) {
       console.log(`Error ${error}`)
   }
})

app.post('/updateProduct/:edit_id',async (req,res)=>{
    try {
         console.log(req.body)
         let database = await dbo.connectToDatabase()
         let collection = database.collection('products')
         let edit_id = req.params.edit_id
         await collection.updateOne(
             {_id : new ObjectID(edit_id)},
             {$set:req.body},
         )
         res.redirect('/?status=2')
    } catch (error) {
        console.log(`Error ${error}`)
    }
 })


app.listen(5000, ()=> console.log('Server is running on port 5000'))