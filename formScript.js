function toggleCustomInput() {
    var select = document.getElementById('occupationSelect');
    var customInput = document.getElementById('customOccupation');

    if (select.value === 'other') {
        customInput.style.display = 'block'; 
    } else {
        customInput.style.display = 'none'; 
    }
}

$(document).ready(function() {
    $('input').focus(function() {
        $(this).css('background', '#999999');
    });

    $('input').blur(function() {
        $(this).css('background', 'white');
    });

    function handleFormSubmit() {
        var select = document.getElementById('occupationSelect');
        var customInput = document.getElementById('customOccupation');
        var occupation = select.value !== 'other' ? select.options[select.selectedIndex].text : customInput.value;
        return occupation;
    }

    $('#contactForm').submit(function(e) {
        e.preventDefault();
        var name = $('#formName').val();
        var email = $('#formEmail').val();
        var occupation = handleFormSubmit();
        console.log("Name: " + name);
        console.log("Email: " + email);
        console.log("Occupation: " + occupation);

        this.reset();
        document.getElementById('customOccupation').style.display = 'none';
    });
});

