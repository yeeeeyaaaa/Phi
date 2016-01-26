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
    populateContent();
});

function populateContent() {
    sensorListData = $.getJSON('/settings/list');
    sensorListData.done(function(data) {
        if (data.length) {
            var tableContent = '';
            sensorListData = data;
            // For each item in our JSON, add a table row and cells to the content string
            $.each(data, function() {
                tableContent += '<tr>';
                tableContent += '<td>' + this.name + '</td>';
                //tableContent += '<td> <button type="button" class="btn btn-default" data-toggle="state"></button></td>';
                tableContent += '<td> <!-- Warning / Default --> <input type="checkbox" checked data-toggle="switch" name="info-square-switch" data-on-color="warning" id="switch-06" /></td>';
                tableContent += '</tr>';

            });
        } else {
            tableContent += '<p class="lead">No sensor registered</p>';
        }

        // Inject the whole content string into our existing HTML table
        //$('#tabContent').html(tabsContent);
        $('#sensorList table tbody').html(tableContent);
    });

}