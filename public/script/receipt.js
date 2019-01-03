// alert("connected")
// $(document).ready(()=>{
//     $('#receiptentry').click(()=>{
//         console.log("clicked")
//         $.ajax({
//             type: "post",
//             url: "orgget/",
//             data: "data",
//             dataType: "json",
//             success: (data)=>{
//                 console.log(data)
//                 for(i=0;i<data.bloodBankid.length;i++){
//                     // console.log(data.bloodBankid[i],"    ",data.bloodBankname[i],"<br>")
//                     $('#orglistdiv').html(data.bloodBankid[i] +"    "+data.bloodBankname[i])    
//                 }
                
//                 $('#orglistdiv').html(data.bloodBankid[1])
                
//                 $('#orglistdiv').html(data.bloodBankname[0])
//             }
//         });
//     })
// })