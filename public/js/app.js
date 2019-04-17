$(document).ready(function() {

    $(".favorite").on("click", function (event) {

        console.log("Does this work???")

        event.preventDefault();
        console.log($(this).prop("value"));
        buttonvalue = $(this).prop("value")
        console.log(buttonvalue)
        var newInfo = {
            favorite: true,
            _id: buttonvalue
        };
        console.log(newInfo);
        updatePost(newInfo);
    }); 
    
    function updatePost(data) {
        console.log(data._id);
        $.ajax({
            method: "POST",
            url: "/api/favorite/" + data._id,
            data: data
        }).then(function() {
            window.location.reload();
        });
    };

    $(".remove").on("click", function (event) {

        console.log("Does this work???")

        event.preventDefault();
        console.log($(this).prop("id"));
        buttonvalue = $(this).prop("id")
        console.log(buttonvalue)
        var newInfo = {
            favorite: false,
            _id: buttonvalue
        };
        console.log(newInfo);
        updatePost2(newInfo);
    }); 
    
    function updatePost2(data) {
        console.log(data._id);
        $.ajax({
            method: "POST",
            url: "/api/remove/" + data._id,
            data: data
        }).then(function() {
            window.location.reload();
        });
    };

});
