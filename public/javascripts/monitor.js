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
    populateTabs();
    populateContent();
});

function populateTabs() {
    // Empty content string
    var tabsContent = '';
    $.getJSON('/settings/list', function(data) {
        if (data.length) {
            sensorListData = data;
            tabsContent += '<ul role="tablist" class="nav nav-tabs">';
            var i = 0;
            // For each item in our JSON, add a table row and cells to the content string
            $.each(data, function() {
                tabsContent += '<li';
                tabsContent += (i == 0) ? ' class="active">' : '>';
                tabsContent += '<a href="javascript:populateContent(\'' + this._id + '\');" >' + this.description + '</a></li>';
                i++;
            });
            tabsContent += '</ul>';
        } else {
            tabsContent += '<div role="alert" class="alert alert-warning"><span aria-hidden="true" class="glyphicon glyphicon-exclamation-sign"></span>';
            tabsContent += ' <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true"> ×</span></button>No sensor registered';
            tabsContent += '</div>';
        }
        // Inject the whole content string into our existing HTML table
        $('#tablist').html(tabsContent);
    });
}

function getValueFromArduino(id) {
    // Empty content string
    var tabsContent = '';

    var sensor;
    if (id !== undefined) {
        sensor = sensorListData.filter(function(sensor) {
            return sensor._id == id;
        })[0];
    } else {
        sensor = sensorListData[0];
    }

    try {
        $.ajax({
            type: "GET",
            url: "/apiArduino/get",
            data: {
                "host": sensor.ip,
                "port": sensor.port,
                "description": sensor.description,
                "path": '/arduino/' + sensor.mesure.toLowerCase() + '/' + sensor.pin
            },
            async: false,
            success: function(body, status) {
                // logic used to compare search results with the input from user
                tabsContent += '<div class="panel panel-info">';
                tabsContent += '<div class="panel-heading">';
                tabsContent += '<h3 class="panel-title">' + sensor.description + '(' + sensor.ip + ':' + sensor.port + ')' + '</h3>';
                tabsContent += '</div>';
                tabsContent += '<div class="panel-body">';
                tabsContent += '<p>' + body.value + '</p>';
                tabsContent += '</div>';
                tabsContent += '</div>';

            },
            error: function(xhr, status, error) {
                console.log('Error ' + e);
                tabsContent += '<div role="alert" class="alert alert-dismissible alert-danger"><span aria-hidden="true" class="glyphicon glyphicon-remove-sign"></span>';
                tabsContent += ' <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true"> ×</span></button>Error, couldn\'t establish the connection';
                tabsContent += '</div>';
            }
        });
    } catch (e) {
        console.log('Error ' + e);
        tabsContent += '<div role="alert" class="alert alert-dismissible alert-danger"><span aria-hidden="true" class="glyphicon glyphicon-remove-sign"></span>';
        tabsContent += ' <button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true"> ×</span></button>Error, couldn\'t establish the connection to apiArduino';
        tabsContent += '</div>';
    }
    // Inject the whole content string into our existing HTML table
    $('#tabContent').html(tabsContent);
}

function populateContent(id) {
    if (!sensorListData.length) {
        sensorListData = $.getJSON('/settings/list');
        sensorListData.done(function(data) {
            getValueFromArduino(id);
        });
    } else {
        getValueFromArduino(id);
    }
}