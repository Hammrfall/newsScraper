$.get("/scrape", function(req,res){
})
    .then(function(res){ 
        console.log(res)  
})

$(".leavecomment").click('click',function(event){
      var modal = $("#modal1")//.modal('show')
    modal.show()
})


$(".closemodal").click('click',function(event){
    var modal = $("#modal1")//.modal('show')
  modal.hide()
})


$("#postcomment").click('click',function(event){
    var modal = $("#modal1")//.modal('show')
  modal.hide()
})