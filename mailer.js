window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('mailer').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        var name = document.getElementById('name').value;
        var subject = document.getElementById('subject').value;
        var message = document.getElementById('message').value;

        var mailSubject = 'Mail from ' + name + ', Subject: ' + subject;
        var body = 'Sender Name: ' + name + '%0D%0A' +
                   'Message: ' + message;

        // Open the user's email client
        window.location.href = 'mailto:contact@anthonyjsilvia.com?subject=' + encodeURIComponent(mailSubject) + '&body=' + encodeURIComponent(body);
    });
});