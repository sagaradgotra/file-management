const express=require('express')
const app=express();
const path=require('path')
const {v4:uuid}=require('uuid')
const mongoose = require('mongoose');
app.use(express.json())
//mongoose.set('bufferCommands', false);
app.use(express.urlencoded({ extended: true }));
const ur= process.env.DB;

// mongoose.connect('ur'),{
//     useNewUrlParser: true,
//     CreateNewParser:true,
//     useUnifiedTopology:true,
//     useFindAndModify:false
// };


// async function mong() {await mongoose.connect('process.env.MONGO_URL')
// .then(()=>console.log('connected'))
// .catch(e=>console.log(e)),{
//     useNewUrlParser: true,
//     CreateNewParser:true,
//     useUnifiedTopology:true,
//     useFindAndModify:false,
//     bufferCommands:false
// }}

try {
    var db = mongoose.connect(process.env.MONGO_URL , {useNewUrlParser: true, dbName: 'swag-shop' });
    console.log('success connection');
}
catch (error) {
    console.log('Error connection: ' + error);
}




const info=new mongoose.Schema({
    //uuid:String,
    filenumber:String,
    CupboradNumber: String,
    ShelfNumber: String,
    status:String

})
const dat=mongoose.model('dat',info);
//const inf=new dat({uuid:uuid(),filenumber:1,CupboradNumber:1,ShelfNumber:1,status:"completed"})
//inf.save();
//console.log()


//const methodOverride = require('method-override');
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))

//console.log(dat.find({filenumber:1}));

//app.use(methodOverride('_method'));
app.get('/',(req,res)=>{
    res.render('home');
    //res.redirect('/');
})
app.get('/data',async   (req,res)=>{
    //console.log(req.query.FILE);
    const file=req.query.FILE;
    try {

        await dat.findOne({filenumber:file}).then(data=>{
            const result=data;
            //console.log(result);
            res.render('information'    , {result})
        })
        // const result= await dat.findOne({filenumber:file});
        // console.log(result);
        // res.render('information',{result});
        
    } catch (err) {
        console.log(err)
        res.status(500).send('er ging iets mis')
    }

    
})
app.get('/update/:id',async (req,res)=>{
    const a=req.params.id;
    //console.log(a)
    //const ans=await dat.findOne({uuid:a});
    res.render('update',{a});

})

app.post('/update/:id/show',async (req,res)=>{
    const uu=req.params.id;
    console.log(uu);
    const f=req.body.FILE;
    const c=req.body.cup;
    console.log(c);
    const s=req.body.shelf;
    const stat=req.body.status;
    try {
        const change={};
        if(f!=""){
            change.filenumber=f;
        }
        if(c!=""){
            change.CupboradNumber=c;
        }
        if(s!=""){
            change.ShelfNumber=s;
        }
        if(stat!=""){
            change.status=stat;
        }
        const doc=await dat.findByIdAndUpdate({_id:uu},change,{new:true})////////not update original
        //console.log(doc);
        res.render('last');

        
    } catch (err) {
        console.log(1);
        console.log(err)
        res.status(500).send('er ging iets')
    }

})

app.get('/add',(req,res)=>{
    res.render('add');
})

app.post('/add/save',async(req,res)=>{
    const fil=req.body.FILE;
    const cp=req.body.cup;
    //console.log(c);
    const shl=req.body.shelf;
    const stats=req.body.status;
    const dat= await mongoose.model('dat',info);
    const inf=await new dat({filenumber:fil,CupboradNumber:cp,ShelfNumber:shl,status:stats})
    await inf.save();
    res.render('saved');
})

app.listen(4000,()=>{
    console.log('Listening')
})
