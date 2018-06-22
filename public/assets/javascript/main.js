$.get("/scrape", function (req, res) {})
  .then(function (res) {

  })

$(".leavecomment").click('click', function (event) {
  var modal = $("#modal1") //.modal('show')
  $("#postcomment").attr('data_id', $(this).attr('data_id'))
  modal.show()
})


$(".closemodal").click('click', function (event) {
  var modal = $("#modal1") //.modal('show')
  modal.hide()
})


$("#postcomment").click('click', function (event) {
  console.log("postcomment ran with " + $(this).attr('data_id'))
  var queryString = '/articles/' + $(this).attr('data_id')
  var noteData = {
    title: $("#notetitle").val().trim(),
    body: $("#notebody").val().trim()
  }
  $.post(queryString, noteData)
    .then(function (response) {
    })
    var modal = $("#modal1") //.modal('show')
    modal.hide()
    location.reload(true);
})