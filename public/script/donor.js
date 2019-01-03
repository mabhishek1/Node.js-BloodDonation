

// let orglist = document.getElementById("showorginfo")
// orglist.addEventListener("click",(event)=>{

// })
// function showCustomer(str) {
//     var xhttp;
//     xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//       if (this.readyState == 4 && this.status == 200) {
//       document.getElementById("orglistdiv").innerHTML = this.responseText;
//       }
//     };
//     xhttp.open("GET", "getcustomer.asp?q="+str, true);
//     xhttp.send();
//   }

$(document).ready(()=>{
    $('#showorginfo').click(()=>{
        // console.log("clicked")
        $.ajax({
            type: "get",
            url: "orgget/",
            data: "data",
            dataType: "json",
            success: (data)=>{
                myobj={
                    t:"fesfe",
                    d:"afa",
                    dd:"sfdesf"
                }
                console.log(data)
                let ajaxres = "ORGANISATION LIST<br>"
                for(i=0;i<data.bloodBankid.length;i++){
                    // console.log(data.bloodBankid[i],"    ",data.bloodBankname[i],"<br>")
                     ajaxres = ajaxres+ data.bloodBankid[i] +"    "+data.bloodBankname[i]+"<br>"    
                }
                // console.log(ajaxres)
                
                $('#orglistdiv').html(ajaxres)
            }
        });
    })
})