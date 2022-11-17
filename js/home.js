$(document).ready(function () {
    loadDvds();
    searchDvd();
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