function initfunc( csvay, scroot) {
  window.csv = csvay;
  window.scroot = scroot;
};

function update_values() {
    //$SCRIPT_ROOT = {{request.script_root|tojson|safe}} ;
  $SCRIPT_ROOT = window.scroot ;
    $.getJSON($SCRIPT_ROOT+"/_stuff",
        function(data) {
            window.glob_tabvar = data;
        });
    };

var source = new EventSource('/_logs');

source.onmessage = function(event) {
    var feed = jQuery.parseJSON( event.data );
    create_log_table(feed);
};

function create_log_table(obj_json) {
    tableBody = document.getElementById("tab_body")
    var tr = document.createElement('TR')
    var chan = document.createElement('TD')
    var level = document.createElement('TD')
    var scrpt = document.createElement('TD')
    var src = document.createElement('TD')
    var pdate = document.createElement('TD')
    var nam = document.createElement('TD')
    var msage = document.createElement('TD')

    var chansplit = obj_json.channel.split('.');
    var parsedmess = obj_json.data.split(';');

    if( chansplit[1] == "INFO" ){
        tr.className = "info";
    }
    else if ( chansplit[1] == "WARNING" ){
        tr.className = "warning";
    }

    source_link = document.createElement("A");
    if (parsedmess[1] == "slexy.org"){
        soruce_url = "http://"+parsedmess[1]+"/view/"+parsedmess[3].split(".")[0];
    }
    else{
        source_url = "http://"+parsedmess[1]+"/"+parsedmess[3].split(".")[0];
    }
    source_link.setAttribute("HREF",source_url);
    source_link.setAttribute("TARGET", "_blank")
    source_link.appendChild(document.createTextNode(parsedmess[1]));

    src.appendChild(source_link);

    chan.appendChild(document.createTextNode(chansplit[0]));
    level.appendChild(document.createTextNode(chansplit[1]));

    scrpt.appendChild(document.createTextNode(parsedmess[0]));
    //src.appendChild(document.createTextNode(parsedmess[1]));
    pdate.appendChild(document.createTextNode(parsedmess[2]));
    nam.appendChild(document.createTextNode(parsedmess[3]));
    msage.appendChild(document.createTextNode(parsedmess[4]));

    tr.appendChild(chan);
    tr.appendChild(level);
    tr.appendChild(scrpt);
    tr.appendChild(src);
    tr.appendChild(pdate);
    tr.appendChild(nam);
    tr.appendChild(msage);

    var sel = document.getElementById("log_select")
    tableBody.appendChild(tr);
    if (tableBody.rows.length > sel.options[sel.options.selectedIndex].value){
        while (tableBody.rows.length != sel.options[sel.options.selectedIndex].value){
            tableBody.deleteRow(0);
        }
    }
}

$(document).ready(function () {
    var interval = 1000;   //number of mili seconds between each call
    var refresh = function() {
        $.ajax({
            url: "",
            cache: false,
            success: function(html) {
                $('#server-name').html(html);
                setTimeout(function() {
                    refresh();
                    update_values();
                    create_queue_table();
                }, interval);
            }
        });
    };
    refresh();
});

function create_queue_table() {
    document.getElementById("queueing").innerHTML = "";
    var Tablediv = document.getElementById("queueing")
    var table = document.createElement('TABLE')
    table.className = "table table-bordered table-hover table-striped";
    var tableHead = document.createElement('THEAD')
    var tableBody = document.createElement('TBODY')

    table.appendChild(tableHead);
    table.appendChild(tableBody);
    var heading = new Array();
    heading[0] = "Queue Name"
    heading[1] = "Amount"
    var tr = document.createElement('TR');
    tableHead.appendChild(tr);

    for (i = 0; i < heading.length; i++) {
        var th = document.createElement('TH')
        th.width = '100';
        th.appendChild(document.createTextNode(heading[i]));
        tr.appendChild(th);
    }

    for(i = 0; i < (glob_tabvar.row1).length;i++){
        var tr = document.createElement('TR')
        for(j = 0; j < (glob_tabvar.row1[i]).length; j++){
            var td = document.createElement('TD')
            td.appendChild(document.createTextNode(glob_tabvar.row1[i][j]));
            tr.appendChild(td)
        }
        tableBody.appendChild(tr);
    }
    Tablediv.appendChild(table);
}

$(document).ready(function () {
    var data = [];
    var x = new Date();
    data.push([x, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    var g = new Dygraph(document.getElementById("Graph"), data,
    {
    labels: ["Time", "Duplicate", "CreditCard", "Words", "102", "Mails", "Lines", "Curve", "Onion", "Web", "Tokenize"],
    drawPoints: false,
    showRoller: true,
    rollPeriod: 10,
    labelsKMB: true,
    logscale: true,
    connectSeparatedPoints: true,
    fillGraph: true,
    stepPlot: true,
    includeZero: true,
    });

    // It sucks that these things aren't objects, and we need to store state in window.
    window.intervalId = setInterval(function() {
        var x = new Date(); // current time
        y = glob_tabvar.row1[0][1];
        a = glob_tabvar.row1[1][1];
        b = glob_tabvar.row1[2][1];
        c = glob_tabvar.row1[3][1];
        d = glob_tabvar.row1[4][1];
        e = glob_tabvar.row1[5][1];
        f = glob_tabvar.row1[6][1];
        k = glob_tabvar.row1[7][1];
        h = glob_tabvar.row1[8][1];
        i = glob_tabvar.row1[9][1];

        data.push([x, y, a, b, c, d, e, f, k, h, i]);
        if (data.length > 1800) {
            data.shift();
        }
        g.updateOptions( { 'file': data } );
    }, 1000);
});