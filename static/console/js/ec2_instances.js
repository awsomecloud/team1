function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

function getSelectedInstanceIds() {
    let instance_ids = [];
    $.each($('table tbody tr.selected'), function (key, value) {
        instance_ids.push($(value).find('td').eq(1).text());
    });

    return instance_ids;
}

function stop_ec2_instance() {
    let instance_ids = getSelectedInstanceIds();

    $.post({
        url: "/console/ec2/stop-instances",
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify({
            "instance_ids": instance_ids
        }),
        success: function (result) {
            $('table').DataTable().ajax.reload();
        }
    });
}

function start_ec2_instance() {
    let instance_ids = getSelectedInstanceIds();

    $.post({
        url: "/console/ec2/start-instances",
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify({
            "instance_ids": instance_ids
        }),
        success: function (result) {
            $('table').DataTable().ajax.reload();
        }
    });
}


function reboot_ec2_instance() {
    let instance_ids = getSelectedInstanceIds();

    $.post({
        url: "/console/ec2/reboot-instances",
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify({
            "instance_ids": instance_ids
        }),
        success: function (result) {
            $('table').DataTable().ajax.reload();
        }
    });
}

$(document).ready(function () {

    $('table').on( 'processing.dt', function ( e, settings, processing ) {
        $('#overlay').css( 'display', processing ? 'block' : 'none' );
    } ).DataTable({
        "ajax": "/console/ec2/describe_instances",
        "columns": [
            {
                "data": null, render: function () {
                    return "";
                }
            },
            {"data": "id"},
            {"data": "name"},
            {"data": "instance_type"},
            {"data": "state"},
            {"data": "launch_time"}
        ],
        pageLength: 50,
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0
        }],
        select: {
            style: 'multi',
            selector: 'td:first-child'
        },
        order: [[1, 'asc']]
        ,
        // dom: 'lBfrtip',
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'collection',
                text: 'Actions',
                autoClose: true,
                buttons: [
                    {
                        text: 'Start', action: start_ec2_instance
                    },
                    {
                        text: 'Stop', action: stop_ec2_instance
                    },
                    {
                        text: 'Reboot', action: reboot_ec2_instance
                    }
                ],
                fade: true
            },
            {
                text: 'Reload',
                action: function (e, dt, node, config) {
                    dt.ajax.reload();
                }
            }
        ]
    });

    // $.get({
    //     url: "ec2/instances",
    //     success: function (result) {
    //         console.log(result.items);
    //         $.each(result.items, function (key, value) {
    //             instance = value;
    //             console.log(instance.id + ', ' + instance.name + instance.instance_type);
    //
    //             let row = '<tr>';
    //             row += '<td>' + instance.id + '</td>';
    //             row += '<td>' + instance.name + '</td>';
    //             row += '<td>' + instance.instance_type + '</td>';
    //             row += '<td>' + instance.public_ip_address + '</td>';
    //             row += '<td>' + instance.launch_time + '</td>';
    //             row += '</tr>';
    //             $('table tbody').append(row);
    //         });
    //
    //         // $("#resultMessage").text(result.resultMessage);
    //         $('table').DataTable();
    //     }
    // });
});