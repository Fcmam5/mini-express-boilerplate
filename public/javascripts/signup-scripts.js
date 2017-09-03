$(document).ready(function(){
  var serverCallForExam;
  var emailRe = /\S+@\S+\.\S+/;
  var csrfToken = $('input[name="_csrf"]').val();
  $('#used-mail-txt').hide();

  $('input[name="email"]').on('keyup', function(){
    var email = $(this).val();
    if (email.length > 3 && emailRe.test(email)) {
      clearTimeout(serverCallForExam);
      serverCallForExam = setTimeout(function(){
        $.ajax({
          url: '/api/users/get-user-by-mail',
          type: 'POST',
          cache: false,
          headers: {"X-CSRF-Token": csrfToken },
          data: { 'email': email},
          success: function(data){
            if (data) {
              $('#email-block')
                .removeClass()
                .addClass("form-group has-error");
              $('#email-block .help-block').text("This email is used !");
            } else {
              $('#email-block')
                .removeClass()
                .addClass("form-group has-success");
              $('#email-block .help-block').text("This email is available");
            }

          },
          error: function(jqXHR, textStatus, err){
            $('#email-block')
            .removeClass()
            .addClass("form-group has-error");
          }
        });
      },2000);
    } else {
      $('#email-block').removeClass().addClass("form-group has-success");
      $('#email-block .help-block').text("Please inster a valid email");

    }
  });
});
