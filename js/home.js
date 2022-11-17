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

function hideAddForm() {
  $("#errorMessages").empty();

  $("#addTitle").val("");
  $("#addReleaseYear").val("");
  $("#addDirector").val("");
  $("#addRating").val("");
  $("#addNotes").val("");

  $("dvdTableDiv").show();
  $("#addDvdDiv").hide();
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

function showEditForm(dvdId) {
  $("#errorMessages").empty();

  $.ajax({
    type: "GET",
    url:
      "http://dvd-library.us-east-1.elasticbeanstalk.com/dvds" + dvdId,
    success: function (data, status) {
      $("#editTitle").val(data.title);
      $("#editReleaseYear").val(data.releaseYear);
      $("#editDirector").val(data.director);
      $("#editRating").val(data.rating);
      $("#editNotes").val(data.notes);
      $("#editDvdId").val(data.dvdId);
        
    },
    error: function () {
      $("#errorMessages").append(
        $("<li>")
          .attr({ class: "list-group-item list-group-item-danger" })
          .text("Error calling web service. Please try again later.")
      );
    },
  });

  // hide the table when the form is opened
  $("#dvdTableDiv").hide();
  $("#editFormDiv").show();
}

function hideEditForm() {
  $("#errorMessages").empty();

  $("#editTitle").val("");
  $("#editReleaseYear").val("");
  $("#editDirector").val("");
  $("#editRating").val("");
  $("#editNotes").val("");

  $("dvdTableDiv").show();
  $("#editFormDiv").hide();
}

function updateDvd(dvdId) {
  $("#updateButton").click(function (event) {
    // check for errors and abort if errors are found
    var haveValidationErrors = checkAndDisplayValidationErrors(
      $("#editForm").find("input")
    );

    if (haveValidationErrors) {
      return false;
    }

    $.ajax({
      type: "PUT",
      url:
        "http://dvd-library.us-east-1.elasticbeanstalk.com/dvds" +
        $("#editDvdId").val(),

      // format the data in JSON
      data: JSON.stringify({
        title: $("#editTitle").val(),
        releaseYear: $("#editReleaseYear").val(),
        director: $("#editDirector").val(),
        rating: $("#editRating").val(),
        notes: $("#editNotes").val()
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      dataType: "json",
      success: function () {
        $("#errorMessage").empty();
        hideEditForm();
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

function deleteDvd(dvdId) {
  $.ajax({
    type: "DELETE",
    url:
      "http://dvd-library.us-east-1.elasticbeanstalk.com/dvds" + dvdId,
    success: function () {
      loadDvds();
    },
  });
}

// Need to test if this works
function confirmDelete() {
    $("#deleteButton").click(function (event) {
      let text = "Are you sure you want to delete this DVD from your collection?";
      if (confirm(text) == true) {
        deleteDvd(dvdId);
      }
    }
}