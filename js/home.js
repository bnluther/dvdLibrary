$(document).ready(function () {
    loadDvds();
    searchDvd();
    addDVD();
    updateDvd();
    hideEditForm();
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
                    row += '<td><a href="#" onclick="loadDvdDetail('+ id +')">' + title + '<a></td>';
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

function loadDvdDetail(id)
{
    $('#dvdPage').show();
    $('#dvdTableDiv').hide();
    var dvdInfo = $('#dvdPage');

    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + id,
        success: function(dvd) {
            $('#dvdTitle').text(dvd.title);
            $('#dvdReleaseYear').text('Release Year: '+ dvd.releaseYear);
            $('#dvdDirector').text('Director: ' + dvd.director);
            $('#dvdRating').text('Rating: ' + dvd.rating);
            $('#dvdNotes').text('Notes: ' + dvd.notes);
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

function searchDvd() {
    $("#searchBox").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#contentRows tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });
}

function hideDetails()
{
    $('#dvdPage').hide();
    $('#dvdTableDiv').show();
}

function hideAddDvdForm() {
    $("#errorMessages").empty();
  
    $("#addTitle").val("");
    $("#addReleaseYear").val("");
    $("#addDirector").val("");
    $("#addRating").val("");
    $("#addNotes").val("");
    $('#addDvdButtonDiv').show();
    $("#dvdTableDiv").show();
    $("#addDvdDiv").hide();
  }
  
  function addDVD() {
    $("#addButton").click(function (event) {
    //   var haveValidationErrors = checkAndDisplayValidationErrors(
    //     $("#addForm").find("input")
    //   );
    //   if (haveValidationErrors) {
    //     return false;
    //   }
      showAddDvdForm();
      // Ajax call to POST data to API service
      $.ajax({
        type: "POST",
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd',
  
        // format data in JSON
        data: JSON.stringify({
            title: $('#addTitle').val(),
            releaseYear: $('#addReleaseYear').val(),
            director: $('#addDirector').val(),
            rating: $('#addRating').val(),
            notes: $('#addNotes').val()
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
          hideAddDvdForm();
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
        "http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/" + dvdId,
      success: function (data, status) {
        $('#editId').val(dvdId);
        $("#editTitle").val(data.title);
        $("#editReleaseYear").val(data.releaseYear);
        $("#editDirector").val(data.director);
        $("#editRating").val(data.rating);
        $("#editNotes").val(data.notes);
  
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
    $("#editFormDiv").hide();
    $("#dvdTableDiv").show();
  }
  
  function updateDvd() {
    $("#updateButton").click(function (event) {
      // check for errors and abort if errors are found
    //   var haveValidationErrors = checkAndDisplayValidationErrors(
    //     $("#editForm").find("input")
    //   );
  
    //   if (haveValidationErrors) {
    //     return false;
    //   }
  
      $.ajax({
        type: "PUT",
        url:
          "http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/" + $("#editId").val(),
  
        // format the data in JSON
        data: JSON.stringify({
            id: $('#editId').val(),
          title: $("#editTitle").val(),
          releaseYear: $("#editReleaseYear").val(),
          director: $("#editDirector").val(),
          rating: $("#editRating").val(),
          notes: $("#editNotes").val(),
        }),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        'success': function () {
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
    var answer=confirm('Do you want to delete?');
    if(answer){
        $.ajax({
        type: "DELETE",
        url:
            "http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/" + dvdId,
        success: function () {
            loadDvds();
        },
        });
    }
  }
  
function showAddDvdForm()
{
    $('#addDvdDiv').show();
    $('#addDvdButtonDiv').hide();
    $('#dvdTableDiv').hide();
}