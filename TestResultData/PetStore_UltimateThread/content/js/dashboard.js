/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.97787610619469, "KoPercent": 0.022123893805309734};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9390957928411903, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.48501628664495117, 500, 1500, "Scn-1_Stp-01_EnterURLandClickOnEnterTheStore"], "isController": true}, {"data": [0.9927200529450695, 500, 1500, "Scn-1_Stp-05_ClickOnProduct"], "isController": true}, {"data": [0.9960681520314548, 500, 1500, "Scn-1_Stp-03_EnterTheCredentialAndClickOnLoginButton"], "isController": true}, {"data": [0.9907038512616202, 500, 1500, "Scn-1_Stp-06_ClickOnAddToCart"], "isController": true}, {"data": [0.9879518072289156, 500, 1500, "Scn-1_Stp-08_EnterPaymentDetailsAndClickPayment"], "isController": true}, {"data": [0.9824915824915825, 500, 1500, "Scn-1_Stp-09_ClickOnConfirm"], "isController": true}, {"data": [0.9914417379855168, 500, 1500, "Scn-1_Stp-04_ClickOnProductCatalog"], "isController": true}, {"data": [0.9914977109221713, 500, 1500, "Scn-1_Stp-02_ClickOnSignIn"], "isController": true}, {"data": [0.9905405405405405, 500, 1500, "Scn-1_Stp-10_ClickOnSignOut-1"], "isController": false}, {"data": [0.9979729729729729, 500, 1500, "Scn-1_Stp-10_ClickOnSignOut-0"], "isController": false}, {"data": [0.9913391072618255, 500, 1500, "Scn-1_Stp-07_ClickOnProceedToCheckOut"], "isController": true}, {"data": [0.9351789331532748, 500, 1500, "Scn-1_Stp-10_ClickOnSignOut"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9040, 2, 0.022123893805309734, 315.3470132743365, 0, 4018, 216.0, 685.0, 867.9499999999989, 1078.5900000000001, 7.605343258418459, 30.021535809262367, 5.694915005924849], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Scn-1_Stp-01_EnterURLandClickOnEnterTheStore", 1535, 0, 0.0, 915.3583061889258, 0, 4018, 867.0, 1088.2000000000003, 1142.0, 1756.119999999999, 1.3115600130557896, 6.391665570139836, 0.7362138541323111], "isController": true}, {"data": ["Scn-1_Stp-05_ClickOnProduct", 1511, 0, 0.0, 237.6280608868301, 0, 1531, 216.0, 229.0, 422.0, 873.0, 1.2913304806125232, 5.282653539386434, 0.8331674836831718], "isController": true}, {"data": ["Scn-1_Stp-03_EnterTheCredentialAndClickOnLoginButton", 1526, 0, 0.0, 217.1638269986896, 0, 742, 213.0, 218.0, 224.0, 257.0, 1.3047184467181543, 0.2926679162381017, 1.2792172955777226], "isController": true}, {"data": ["Scn-1_Stp-06_ClickOnAddToCart", 1506, 0, 0.0, 247.38247011952126, 0, 1157, 217.0, 417.0, 440.0, 873.0, 1.2867373774139141, 6.058246640363738, 0.8336044741464899], "isController": true}, {"data": ["Scn-1_Stp-08_EnterPaymentDetailsAndClickPayment", 1494, 0, 0.0, 248.8922356091033, 0, 3692, 216.0, 415.5, 432.0, 864.0, 1.2804437500374963, 5.860814588595309, 1.5813043749351852], "isController": true}, {"data": ["Scn-1_Stp-09_ClickOnConfirm", 1485, 4, 0.26936026936026936, 254.2680134680132, 0, 901, 218.0, 421.4000000000001, 467.9000000000008, 868.0, 1.30948223865909, 6.922640407800105, 0.7925250636884543], "isController": true}, {"data": ["Scn-1_Stp-04_ClickOnProductCatalog", 1519, 0, 0.0, 234.44634628044767, 0, 1171, 215.0, 226.0, 416.0, 886.0, 1.298622468476987, 5.162934667705678, 0.7963273039434864], "isController": true}, {"data": ["Scn-1_Stp-02_ClickOnSignIn", 1529, 0, 0.0, 235.55657292347948, 0, 1184, 215.0, 223.0, 262.5, 947.0, 1.3072890126163221, 5.224486970287176, 0.8369342918409434], "isController": true}, {"data": ["Scn-1_Stp-10_ClickOnSignOut-1", 740, 0, 0.0, 249.68918918918914, 207, 1073, 214.0, 421.9, 434.8499999999998, 854.0, 0.654695181885823, 3.2274426544527675, 0.39831552569811296], "isController": false}, {"data": ["Scn-1_Stp-10_ClickOnSignOut-0", 740, 0, 0.0, 214.57702702702701, 206, 671, 213.0, 218.0, 221.94999999999993, 247.95000000000016, 0.6546905481263906, 0.147049634833076, 0.4040668226717567], "isController": false}, {"data": ["Scn-1_Stp-07_ClickOnProceedToCheckOut", 1501, 0, 0.0, 251.03530979347101, 0, 1068, 215.0, 419.0, 434.0, 871.0, 1.28225499191009, 6.962646007603832, 0.8048064166568426], "isController": true}, {"data": ["Scn-1_Stp-10_ClickOnSignOut", 1481, 0, 0.0, 466.3747467927077, 0, 3806, 428.0, 634.0, 674.0, 1067.0, 1.3059838043899044, 6.726883050517147, 1.599514632133198], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 2, 100.0, 0.022123893805309734], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9040, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Scn-1_Stp-09_ClickOnConfirm", 744, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
