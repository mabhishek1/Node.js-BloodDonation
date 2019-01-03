const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql')
const path = require('path')
const nodemailer = require("nodemailer");
const credentials =  require("./private/tokens");
const password = credentials.password;
const username = credentials.emailid;
const app = express();
const portNo = 500



//@@CREATING DATABASE CONNECTION
var connection = mysql.createConnection({
    multipleStatements:true,
  host     : 'localhost',
  user     : 'root',
  password : '5614',
  database : 'blooddonation'
});
 
connection.connect(err=>{
    if (err)
        throw err
})


//MIDDLEWARES
app.use(express.static("public"));
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use("/",(req,res,next)=>{
    // console.log(req)
    next()
})





//TEST ROUTE
app.get("/",(req,res)=>{
    filepath = path.join(__dirname,"/Frontend/index.html")
    res.sendFile(filepath)
})



//ORGANISATION PAGE ROUTE
app.get("/organisation",(req,res)=>{
    filepath = path.join(__dirname,"/Frontend/organistionlogin.html")
    res.sendFile(filepath)
})


//DONOR PAGE ROUTE
app.get("/donor",(req,res)=>{

    filepath = path.join(__dirname,"/Frontend/donorentry.html")
    res.sendFile(filepath)
    

})



//AJAX GETTING ORAGNISATION LIST ROUTE
app.get("/orgget",(req,res)=>{

    sql = "select idbloodbank,name from bloodbank"
    connection.query(sql,(err,result)=>{
        if(err)
            throw err
        // console.log(result)
        // console.log(result[1])
        // console.log(result.length)
        bloodBankid = []
        bloodBankname = []
        
        for(i=0;i<result.length;i++){
            bloodBankid[i] = result[i].idbloodbank
            bloodBankname[i] = result[i].name 
        }
        jsonObj = {
            bloodBankid,
            bloodBankname
        }
        
        res.send(jsonObj)

    })
})




//ORGANISATION REGISTRATION ROUTE

app.post("/registerorg",urlencodedParser,(req,res)=>{
    // console.log("meow")
    let name = req.body.name
    let address = req.body.address
    let phonenumber = req.body.phonenumber
    let emailid = req.body.emailid
    // console.log(name,address,phonenumber,emailid)
    
    const sql =`INSERT INTO bloodbank (name, address ,phoneno ,emailid) VALUES ('${name}','${address}','${phonenumber}','${emailid}')`
    connection.query(sql,(err,res)=>{
        if(err)
            throw err
            //console.log("here is the error")
    })

    filepath = path.join(__dirname,"/Frontend/organistionlogin.html")
    res.sendFile(filepath)
})



//DONOR REG ROUTE
app.post("/donreg",urlencodedParser,(req,res)=>{
    let name = req.body.name
    let address = req.body.address
    let phoneNumber = req.body.phoneno
    let emailid = req.body.emailid
    let bloodgroup = req.body.bloodgroup
    let dob = req.body.dob
    let orgid =  req.body.orgid
    const sql =`INSERT INTO donor (donname ,phoneno ,address ,emailid ,bloodgroup ,dateofbirth ,bbid) VALUES ('${name}','${phoneNumber}','${address}','${emailid}','${bloodgroup}','${dob}','${orgid}')`
    // console.log(`INSERT INTO donor (name ,phoneno ,address ,emailid ,bloodgroup ,dateofbirth ,bbid) VALUES ('${name}','${phoneNumber}','${address}','${emailid}','${bloodgroup}','${dob}','${orgid}`)
    connection.query(sql,(err,result)=>{
        if(err)
            throw err
        console.log(result)
    })
    filepath = path.join(__dirname,"/Frontend/donorentry.html")
    res.sendFile(filepath)
   
})

// RECEIPIANT BLOCK PAGE ROUTE
app.get("/receipiant",(req,res)=>{
    filepath = path.join(__dirname,"/Frontend/receiptentry.html")
    res.sendFile(filepath)
})


//RECEIPIANT PAGE REGISTRATION AND NODEMAILER ROUTE
app.post("/receiptreg",urlencodedParser,(req,res)=>{
    let name = req.body.name
    let address = req.body.address
    let emailid = req.body.emailid
    let phonenumber = req.body.phonenumber
    let bloodgroup = req.body.Bloodgroup
    
    // console.log(req.body)
    
    
    function getData(callback){
        const sql =`INSERT INTO receipiant (name, address ,bloodgroup,emailid ,phonenumber ) VALUES ('${name}','${address}','${bloodgroup}','${emailid}','${phonenumber}');SELECT bloodbank.name, donor.donname,donor.phoneno,donor.address,donor.emailid,donor.dateofbirth FROM bloodbank INNER JOIN donor ON donor.bbid=bloodbank.idbloodbank WHERE donor.bloodgroup = '${bloodgroup}'`
        connection.query(sql,(err,result)=>{
            if(err)
                callback(err,null)
            else
                callback(null,result)
                
            
        })
    }



// let msgres="hhh"
//call Fn for db query with callback

getData(function(err,data){
    var myMsg = "<strong>     Don.name          </strong>"+"<strong>      Org.name        </strong>"+"<strong>       Phone.no    </strong>"+"<strong>    Emailid     </strong>"+"<br>"+"<hr>"
        if (err) {
            // error handling code goes here
            console.log("ERROR : ",err);            
        } else {            
            // code to execute on data retrieval
            // console.log("result from db is : ",data); 
            let msgres = Object.assign({},data) 
            // console.log(msgres[1][0])
            
            for(i=0;i<msgres[1].length;i++){
                // console.log(msgres[1][i].name)
                myMsg = myMsg+msgres[1][i].donname+msgres[1][i].name+msgres[1][i].phoneno+msgres[1][i].emailid+"<br>"+"<hr>"
            }
            
        }    
        console.log(myMsg)
        //NODEMAILER 
        //transporter mail
        const mailContent = `Hi ${name} here is a list of all those who matches your blood group<br>`+myMsg

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, 
            auth: {
                
                user: `${username}`, 
                pass: `${password}`
            },
            tls:{
                rejectUnauthorized:false
            }
        });

        let mailOptions = {
            from: '"mabhishek',
            to: emailid, 
            subject: 'BLOOD DONOR LIST', 
            text: "some random text", 
            html: mailContent, 
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("err here")
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            
        });


});




    filepath = path.join(__dirname,"/Frontend/receiptentry.html")
    res.sendFile(filepath)
   
})



app.listen(portNo,()=>{
    console.log("Server is active at port "+portNo)
})

