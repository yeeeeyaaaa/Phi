var sensorListData = [];

$(document).ready(function() {
    //*******************************
    // Loading div animation
    $(document).ajaxStart(function() {
        $("#progressBar").css("display", "block");
    });
    $(document).ajaxComplete(function() {
        $("#progressBar").css("display", "none");
    });
    populateTable();
    window.setInterval(function() {
        document.location.reload(true);
    }, 300000);
});

function populateTable() {
    // Empty content string
    var tableContent = '';

    $.getJSON('/settings/list', function(data) {
        if (data.length) {
            sensorListData = data;
            // For each item in our JSON, add a table row and cells to the content string
            $.each(data, function() {
                tableContent += '<tr>';
                //var url = 'http://' + this.ip + ':' + this.port + '/arduino/' + this.mesure.toLowerCase() + '/' + this.pin;
                //console.log("trying to connect to " + url);
                // try {
                //     $.ajax({
                //         type: "GET",
                //         url: url,
                //         async: false,
                //         //crossDomain: true,
                //         dataType: "jsonp",
                //         //jsonpCallback: 'temperature',
                //         jsonp: 'callback',
                //         success: function(body, status) {
                //             console.log("body" + body);
                //             //body = JSON.parse(body);
                //             // logic used to compare search results with the input from user
                //             if (status !== 200) {
                //                 tableContent += '<td><span class="glyphicon text-danger glyphicon-alert"</span></td>';
                //             } else {
                //                 tableContent += '<td><span class="glyphicon text-info glyphicon-transfer"</span></td>';
                //             }
                //         },
                //         error: function(xhr, status, error) {
                //             tableContent += '<td><span class="glyphicon text-danger glyphicon-alert"</span></td>';
                //         }
                //     });
                // } catch (e) {
                //     console.log('Error ' + e);
                //     tableContent += '<td><span class="glyphicon text-danger glyphicon-alert"</span></td>';
                // }
                tableContent += '<td>' + this.ip + '</td>';
                tableContent += '<td>' + this.port + '</td>';
                tableContent += '<td>' + this.description + '</td>';
                tableContent += '<td>' + this.pin + '</td>';
                tableContent += '<td>' + this.mesure + '</td>';
                tableContent += '<td> <a class="btn btn-danger glyphicon glyphicon-trash" href="/settings/delete/' + this._id +
                    '") </a>  <a class="btn btn-info glyphicon glyphicon-cog" data-toggle="modal" id="editButton" name="' + this._id + '") </a></td>';
                tableContent += '</tr>';

            });
        } else {
            tableContent += 'p.lead No sensor registered';
        }

        // Inject the whole content string into our existing HTML table
        $('#sensorList table tbody').html(tableContent);
        $('#editButton').click(function(event) {
            populateForm(this.name);
            //$('.modal-body').load('/render/62805', function(result) {
            $('#myModal').modal({
                show: true
            });
            //});
        });
        $('#AddSensorButton').click(function(event) {
            clearForm();
            $('#myModal').modal({
                show: true
            });
        });
    });
};

function populateForm(id) {
    var thisSensorObject = sensorListData.filter(function(item) {
        return item._id == id;
    })[0];
    $('#ip').val(thisSensorObject.ip);
    $('#port').val(thisSensorObject.port);
    $('#pin').val(thisSensorObject.pin);
    $('#mesure').val(thisSensorObject.mesure);
    $('#description').val(thisSensorObject.description);
};

function clearForm() {
    $('#ip').val("");
    $('#port').val("");
    $('#pin').val("");
    $('#mesure').val("");
    $('#description').val("");
};
