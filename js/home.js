$(document).ready(function () {
    loadDvds();
});

function loadDvds() {
    clearDvdTable();
    var contentRows = $('#contentRows');
    
    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds',
        success: function(dvdArray) {
            $.each(dvdArray, function(index, dvd){
                var title = dvd.title;
                var releaseYear = dvd.releaseYear;
                var director = dvd.director;
                var rating = dvd.rating;
                var notes = dvd.notes;
                var id = dvd.id;
                
                var row = '<tr>';
                    row += '<td><a href="#">' + title + '<a></td>';
                    row += '<td>' + releaseYear + '</td>';
                    row += '<td>' + director + '</td>';
                    row += '<td>' + rating + '</td>';
                    row += '<td><button type="button" class="btn btn-info" onclick="showEditForm(' + id + ')">Edit</button></td>';
                    row += '<td><button type="button" class="btn btn-danger" onclick="deleteDvd(' + id + ')">Delete</button></td>';
                    row += '</tr>';
                
                contentRows.append(row);
            })
        
        },
        error: function() {
            $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.'));
        }
    }); 
}

function clearDvdTable() {
    $('#contentRows').empty();
}

function addDVD() {
  $("#addDvdButton").click(function (event) {
    var haveValidationErrors = checkAndDisplayValidationErrors(
      $("#addForm").find("input")
    );
    if (haveValidationErrors) {
      return false;
    }

    // Ajax call to POST data to API service
    $.ajax({
      type: "POST",
      url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds',

      // format data in JSON
      data: JSON.stringify({
        firstName: $("#addTitle").val(),
        lastName: $("#addReleaseYear").val(),
        company: $("#addDirector").val(),
        phone: $("#addRating").val(),
        email: $("#addNotes").val(),
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      dataType: "json",
      success: function () {
        $("#errorMessages").empty();
        $("#addTitle").val("");
        $("#addReleaseYear").val("");
        $("#addDirector").val("");
        $("#addRating").val("");
        $("#addNotes").val("");
        loadDvds();
      },
      error: function () {
        $("#errorMessages").append(
          $("<li>")
            .attr({ class: "list-group-item list-group-item-danger" })
            .text("Error calling web service. Please try again later.")
        );
      },
    });
  });
}