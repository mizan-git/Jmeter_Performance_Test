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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9379562043795621, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Scn-5_Stp-09_ClickOnConfirm"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-3_Stp-05_ClickOnProduct"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-4_Stp-02_ClickOnSignIn"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-1_Stp-04_ClickOnProductCatalog"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-1_Stp-10_ClickOnSignOut-1"], "isController": false}, {"data": [1.0, 500, 1500, "Scn-7_Stp-04_ClickOnSignOut-0"], "isController": false}, {"data": [1.0, 500, 1500, "Scn-1_Stp-10_ClickOnSignOut-0"], "isController": false}, {"data": [1.0, 500, 1500, "Scn-7_Stp-04_ClickOnSignOut-1"], "isController": false}, {"data": [1.0, 500, 1500, "Scn-4_Stp-03_EnterTheCredentialAndClickOnLoginButton"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-2_Stp-05_ClickOnProduct"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-5_Stp-03_EnterTheCredentialAndClickOnLoginButton"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-5_Stp-06_ClickOnAddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-2_Stp-07_ClickOnProceedToCheckOut"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-3_Stp-02_ClickOnSignIn"], "isController": true}, {"data": [0.5, 500, 1500, "Scn-1_Stp-01_EnterURLandClickOnEnterTheStore"], "isController": true}, {"data": [0.5, 500, 1500, "Scn-2_Stp-01_EnterURLandClickOnEnterTheStore"], "isController": true}, {"data": [0.5, 500, 1500, "Scn-4_Stp-01_EnterURLandClickOnEnterTheStore"], "isController": true}, {"data": [0.5, 500, 1500, "Scn-3_Stp-01_EnterURLandClickOnEnterTheStore"], "isController": false}, {"data": [1.0, 500, 1500, "Scn-5_Stp-05_ClickOnProduct"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-6_Stp-06_ClickOnAddToCart"], "isController": true}, {"data": [0.5, 500, 1500, "Scn-7_Stp-01_EnterURLandClickOnEnterTheStore"], "isController": true}, {"data": [0.5, 500, 1500, "Scn-5_Stp-01_EnterURLandClickOnEnterTheStore"], "isController": true}, {"data": [0.5, 500, 1500, "Scn-6_Stp-01_EnterURLandClickOnEnterTheStore"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-1_Stp-10_ClickOnSignOut"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-5_Stp-07_ClickOnProceedToCheckOut"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-7_Stp-02_ClickOnSignIn"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-4_Stp-04_ClickOnProductCatalog"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-2_Stp-04_ClickOnProductCatalog"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-3_Stp-08_EnterPaymentDetailsAndClickPayment"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-3_Stp-06_ClickOnAddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-1_Stp-08_EnterPaymentDetailsAndClickPayment"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-4_Stp-05_ClickOnProduct"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-2_Stp-08_EnterPaymentDetailsAndClickPayment"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-4_Stp-10_ClickOnSignOut-1"], "isController": false}, {"data": [1.0, 500, 1500, "Scn-4_Stp-10_ClickOnSignOut-0"], "isController": false}, {"data": [0.5, 500, 1500, "Scn-6_Stp-07_ClickOnSignOut"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-1_Stp-03_EnterTheCredentialAndClickOnLoginButton"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-7_Stp-03_EnterTheCredentialAndClickOnLoginButton"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-2_Stp-10_ClickOnSignOut"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-5_Stp-04_ClickOnProductCatalog"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-1_Stp-09_ClickOnConfirm"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-4_Stp-06_ClickOnAddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-4_Stp-07_ClickOnProceedToCheckOut"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-4_Stp-08_EnterPaymentDetailsAndClickPayment"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-5_Stp-08_EnterPaymentDetailsAndClickPayment"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-5_Stp-10_ClickOnSignOut-1"], "isController": false}, {"data": [1.0, 500, 1500, "Scn-1_Stp-07_ClickOnProceedToCheckOut"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-5_Stp-10_ClickOnSignOut-0"], "isController": false}, {"data": [1.0, 500, 1500, "Scn-6_Stp-02_ClickOnSignIn"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-6_Stp-05_ClickOnProduct"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-1_Stp-06_ClickOnAddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-3_Stp-10_ClickOnSignOut"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-2_Stp-09_ClickOnConfirm"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-1_Stp-02_ClickOnSignIn"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-2_Stp-10_ClickOnSignOut-0"], "isController": false}, {"data": [1.0, 500, 1500, "Scn-6_Stp-04_ClickOnProductCatalog"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-2_Stp-03_EnterTheCredentialAndClickOnLoginButton"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-2_Stp-10_ClickOnSignOut-1"], "isController": false}, {"data": [1.0, 500, 1500, "Scn-1_Stp-05_ClickOnProduct"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-3_Stp-09_ClickOnConfirm"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-5_Stp-02_ClickOnSignIn"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-2_Stp-06_ClickOnAddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-4_Stp-10_ClickOnSignOut"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-6_Stp-07_ClickOnSignOut-1"], "isController": false}, {"data": [1.0, 500, 1500, "Scn-3_Stp-10_ClickOnSignOut-0"], "isController": false}, {"data": [1.0, 500, 1500, "Scn-3_Stp-10_ClickOnSignOut-1"], "isController": false}, {"data": [1.0, 500, 1500, "Scn-2_Stp-02_ClickOnSignIn"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-3_Stp-07_ClickOnProceedToCheckOut"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-6_Stp-07_ClickOnSignOut-0"], "isController": false}, {"data": [1.0, 500, 1500, "Scn-4_Stp-09_ClickOnConfirm"], "isController": true}, {"data": [0.5, 500, 1500, "Scn-8_Stp-1_Search_Product"], "isController": false}, {"data": [1.0, 500, 1500, "Scn-3_Stp-03_EnterTheCredentialAndClickOnLoginButton"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-6_Stp-03_EnterTheCredentialAndClickOnLoginButton"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-7_Stp-04_ClickOnSignOut"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-5_Stp-10_ClickOnSignOut"], "isController": true}, {"data": [1.0, 500, 1500, "Scn-3_Stp-04_ClickOnProductCatalog"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 76, 0, 0.0, 318.6578947368421, 208, 884, 221.0, 857.1999999999999, 873.4499999999999, 884.0, 2.117168565618297, 8.284880178009304, 1.563011445942558], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Scn-5_Stp-09_ClickOnConfirm", 2, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 0.5963029218843172, 3.1300080128205128, 0.36162511180679785], "isController": true}, {"data": ["Scn-3_Stp-05_ClickOnProduct", 2, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 0.5768676088837611, 2.267472779059706, 0.3729358955869628], "isController": true}, {"data": ["Scn-4_Stp-02_ClickOnSignIn", 2, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 0.5691519635742743, 2.2760520418326693, 0.3646129766647695], "isController": true}, {"data": ["Scn-1_Stp-04_ClickOnProductCatalog", 2, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 0.544069640914037, 2.159807705386289, 0.334730345484222], "isController": true}, {"data": ["Scn-1_Stp-10_ClickOnSignOut-1", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 22.822627314814817, 2.8166594328703702], "isController": false}, {"data": ["Scn-7_Stp-04_ClickOnSignOut-0", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1.0746860047846891, 2.9530502392344498], "isController": false}, {"data": ["Scn-1_Stp-10_ClickOnSignOut-0", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.9938467920353982, 2.7309181415929205], "isController": false}, {"data": ["Scn-7_Stp-04_ClickOnSignOut-1", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 23.144072769953052, 2.856330692488263], "isController": false}, {"data": ["Scn-4_Stp-03_EnterTheCredentialAndClickOnLoginButton", 2, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 0.5911912503694946, 0.1327870972509607, 0.5756031998226426], "isController": true}, {"data": ["Scn-2_Stp-05_ClickOnProduct", 2, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 0.5688282138794084, 2.360303789817975, 0.36773855233219566], "isController": true}, {"data": ["Scn-5_Stp-03_EnterTheCredentialAndClickOnLoginButton", 2, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 0.5425935973955507, 0.12187160879001628, 0.5293466833966359], "isController": true}, {"data": ["Scn-5_Stp-06_ClickOnAddToCart", 2, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 0.5638567803777841, 2.6551927685367915, 0.366176522413307], "isController": true}, {"data": ["Scn-2_Stp-07_ClickOnProceedToCheckOut", 2, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 0.6025911419102139, 3.2583468288641155, 0.3789733353419705], "isController": true}, {"data": ["Scn-3_Stp-02_ClickOnSignIn", 2, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 0.5477951246233909, 2.1895756299643936, 0.3509312517118598], "isController": true}, {"data": ["Scn-1_Stp-01_EnterURLandClickOnEnterTheStore", 2, 0, 0.0, 876.0, 876, 876, 876.0, 876.0, 876.0, 876.0, 0.502008032128514, 2.7767319277108435, 0.2573771649096386], "isController": true}, {"data": ["Scn-2_Stp-01_EnterURLandClickOnEnterTheStore", 2, 0, 0.0, 873.0, 873, 873, 873.0, 873.0, 873.0, 873.0, 0.48123195380173245, 2.6618142444658326, 0.24672536693936478], "isController": true}, {"data": ["Scn-4_Stp-01_EnterURLandClickOnEnterTheStore", 1, 0, 0.0, 872.0, 872, 872, 872.0, 872.0, 872.0, 872.0, 1.146788990825688, 6.3431766055045875, 0.5879533400229358], "isController": true}, {"data": ["Scn-3_Stp-01_EnterURLandClickOnEnterTheStore", 3, 0, 0.0, 868.6666666666666, 867, 872, 867.0, 872.0, 872.0, 872.0, 0.7327796775769418, 4.053187591597459, 0.3756927057889594], "isController": false}, {"data": ["Scn-5_Stp-05_ClickOnProduct", 2, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 0.5439216752787598, 2.1108835327712807, 0.351636864291542], "isController": true}, {"data": ["Scn-6_Stp-06_ClickOnAddToCart", 2, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 0.6045949214026601, 2.881863097037485, 0.3926324440749698], "isController": true}, {"data": ["Scn-7_Stp-01_EnterURLandClickOnEnterTheStore", 2, 0, 0.0, 853.0, 853, 853, 853.0, 853.0, 853.0, 853.0, 0.4628558204119417, 2.5601712566535526, 0.23730400948854433], "isController": true}, {"data": ["Scn-5_Stp-01_EnterURLandClickOnEnterTheStore", 2, 0, 0.0, 870.0, 870, 870, 870.0, 870.0, 870.0, 870.0, 0.5, 2.765625, 0.25634765625], "isController": true}, {"data": ["Scn-6_Stp-01_EnterURLandClickOnEnterTheStore", 2, 0, 0.0, 876.0, 876, 876, 876.0, 876.0, 876.0, 876.0, 0.5070993914807302, 2.804893509127789, 0.25998748098377283], "isController": true}, {"data": ["Scn-1_Stp-10_ClickOnSignOut", 2, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 0.5685048322910744, 2.9302426805002844, 0.6967515278567368], "isController": true}, {"data": ["Scn-5_Stp-07_ClickOnProceedToCheckOut", 2, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 0.6056935190793459, 3.275122085099939, 0.3809244397334948], "isController": true}, {"data": ["Scn-7_Stp-02_ClickOnSignIn", 2, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 0.5656108597285069, 2.2607863758484164, 0.36234445701357465], "isController": true}, {"data": ["Scn-4_Stp-04_ClickOnProductCatalog", 2, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 0.5732301519059902, 2.126661471768415, 0.35267089423903697], "isController": true}, {"data": ["Scn-2_Stp-04_ClickOnProductCatalog", 2, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 0.6062443164595333, 2.5747622385571387, 0.37298234313428313], "isController": true}, {"data": ["Scn-3_Stp-08_EnterPaymentDetailsAndClickPayment", 2, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 0.541858574911948, 2.5108583378488216, 0.6709733134651856], "isController": true}, {"data": ["Scn-3_Stp-06_ClickOnAddToCart", 2, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 0.549299642955232, 2.6134647074979402, 0.35672291266135675], "isController": true}, {"data": ["Scn-1_Stp-08_EnterPaymentDetailsAndClickPayment", 2, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 0.5688282138794084, 2.604722162969283, 0.7043693117178612], "isController": true}, {"data": ["Scn-4_Stp-05_ClickOnProduct", 2, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 0.609942055504727, 2.5356673147301008, 0.3949136550777676], "isController": true}, {"data": ["Scn-2_Stp-08_EnterPaymentDetailsAndClickPayment", 2, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 0.5380683346785041, 2.451258575464084, 0.6662799300511165], "isController": true}, {"data": ["Scn-4_Stp-10_ClickOnSignOut-1", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 22.007533482142858, 2.716064453125], "isController": false}, {"data": ["Scn-4_Stp-10_ClickOnSignOut-0", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.0446947674418605, 2.870639534883721], "isController": false}, {"data": ["Scn-6_Stp-07_ClickOnSignOut", 2, 0, 0.0, 705.0, 705, 705, 705.0, 705.0, 705.0, 705.0, 0.4912797838368951, 2.532201854581184, 0.6021055944485385], "isController": true}, {"data": ["Scn-1_Stp-03_EnterTheCredentialAndClickOnLoginButton", 2, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 0.5698005698005698, 0.12798254985754987, 0.5547765313390314], "isController": true}, {"data": ["Scn-7_Stp-03_EnterTheCredentialAndClickOnLoginButton", 2, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 0.5851375073142189, 0.13142736980690461, 0.5697090769455821], "isController": true}, {"data": ["Scn-2_Stp-10_ClickOnSignOut", 2, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 0.5337603416066187, 2.751159260741927, 0.654169168668268], "isController": true}, {"data": ["Scn-5_Stp-04_ClickOnProductCatalog", 2, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 0.561955605507165, 2.087028484124754, 0.34628319050295026], "isController": true}, {"data": ["Scn-1_Stp-09_ClickOnConfirm", 2, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 0.5509641873278236, 2.895252238292011, 0.3341296487603306], "isController": true}, {"data": ["Scn-4_Stp-06_ClickOnAddToCart", 2, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 0.6090133982947624, 2.8630766595615107, 0.3955018651035323], "isController": true}, {"data": ["Scn-4_Stp-07_ClickOnProceedToCheckOut", 2, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 0.5480953685941354, 2.976521821046862, 0.34470060290490545], "isController": true}, {"data": ["Scn-4_Stp-08_EnterPaymentDetailsAndClickPayment", 2, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 0.5398110661268556, 2.471849696356275, 0.6684379217273954], "isController": true}, {"data": ["Scn-5_Stp-08_EnterPaymentDetailsAndClickPayment", 2, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 0.5842827928717499, 2.661796121822962, 0.7235064271107216], "isController": true}, {"data": ["Scn-5_Stp-10_ClickOnSignOut-1", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 22.306278280542987, 2.7529341063348416], "isController": false}, {"data": ["Scn-1_Stp-07_ClickOnProceedToCheckOut", 2, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 0.5449591280653951, 2.9594899523160763, 0.3427282016348774], "isController": true}, {"data": ["Scn-5_Stp-10_ClickOnSignOut-0", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.0350662442396314, 2.8441820276497696], "isController": false}, {"data": ["Scn-6_Stp-02_ClickOnSignIn", 2, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 0.5732301519059902, 2.291241222413299, 0.367225566064775], "isController": true}, {"data": ["Scn-6_Stp-05_ClickOnProduct", 2, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 0.6121824303642486, 2.411066153963881, 0.39576637588001223], "isController": true}, {"data": ["Scn-1_Stp-06_ClickOnAddToCart", 2, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 0.6097560975609756, 2.859422637195122, 0.3953887195121951], "isController": true}, {"data": ["Scn-3_Stp-10_ClickOnSignOut", 2, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 0.5488474204171241, 2.8289225439077934, 0.6726596802963776], "isController": true}, {"data": ["Scn-2_Stp-09_ClickOnConfirm", 2, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 0.6193868070610096, 3.245732037782595, 0.3756242257664912], "isController": true}, {"data": ["Scn-1_Stp-02_ClickOnSignIn", 2, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 0.6053268765133172, 2.420716366525424, 0.3877875302663438], "isController": true}, {"data": ["Scn-2_Stp-10_ClickOnSignOut-0", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.0446947674418605, 2.870639534883721], "isController": false}, {"data": ["Scn-6_Stp-04_ClickOnProductCatalog", 2, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 0.5997001499250374, 2.2617597451274363, 0.3695417916041979], "isController": true}, {"data": ["Scn-2_Stp-03_EnterTheCredentialAndClickOnLoginButton", 2, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 0.5657708628005658, 0.12707743988684583, 0.5519580975954738], "isController": true}, {"data": ["Scn-2_Stp-10_ClickOnSignOut-1", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 22.306278280542987, 2.7529341063348416], "isController": false}, {"data": ["Scn-1_Stp-05_ClickOnProduct", 2, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 0.5884083553986466, 2.4306321712268315, 0.38039680788467195], "isController": true}, {"data": ["Scn-3_Stp-09_ClickOnConfirm", 2, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 0.5859947260474656, 3.1165305449750953, 0.3553737547612072], "isController": true}, {"data": ["Scn-5_Stp-02_ClickOnSignIn", 2, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 0.6069802731411229, 2.428513846737481, 0.3888467374810319], "isController": true}, {"data": ["Scn-2_Stp-06_ClickOnAddToCart", 2, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 0.5815644082582145, 2.7323304376272173, 0.37710817097993604], "isController": true}, {"data": ["Scn-4_Stp-10_ClickOnSignOut", 2, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 0.5098139179199592, 2.627732283966352, 0.6248207685444812], "isController": true}, {"data": ["Scn-6_Stp-07_ClickOnSignOut-1", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 10.101818647540984, 1.2467181096311475], "isController": false}, {"data": ["Scn-3_Stp-10_ClickOnSignOut-0", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 1.0798527644230769, 2.9672475961538463], "isController": false}, {"data": ["Scn-3_Stp-10_ClickOnSignOut-1", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 23.58702153110048, 2.91099730861244], "isController": false}, {"data": ["Scn-2_Stp-02_ClickOnSignIn", 2, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 0.588754783632617, 2.3555940903738595, 0.3771710332646453], "isController": true}, {"data": ["Scn-3_Stp-07_ClickOnProceedToCheckOut", 2, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 0.5512679162072768, 3.0238983255237044, 0.34669583792723263], "isController": true}, {"data": ["Scn-6_Stp-07_ClickOnSignOut-0", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.0350662442396314, 2.8441820276497696], "isController": false}, {"data": ["Scn-4_Stp-09_ClickOnConfirm", 2, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 0.5374899220639613, 2.829170585864015, 0.32595824375167964], "isController": true}, {"data": ["Scn-8_Stp-1_Search_Product", 1, 0, 0.0, 884.0, 884, 884, 884.0, 884.0, 884.0, 884.0, 1.1312217194570138, 5.513601173642534, 0.1944287330316742], "isController": false}, {"data": ["Scn-3_Stp-03_EnterTheCredentialAndClickOnLoginButton", 2, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 0.6079027355623101, 0.13654065349544073, 0.6055281155015197], "isController": true}, {"data": ["Scn-6_Stp-03_EnterTheCredentialAndClickOnLoginButton", 2, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 0.5402485143165856, 0.12134488114532685, 0.5381381685575365], "isController": true}, {"data": ["Scn-7_Stp-04_ClickOnSignOut", 2, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 0.5755395683453237, 2.966501798561151, 0.7053732014388489], "isController": true}, {"data": ["Scn-5_Stp-10_ClickOnSignOut", 2, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 0.5359056806002144, 2.762216974812433, 0.6567984659699893], "isController": true}, {"data": ["Scn-3_Stp-04_ClickOnProductCatalog", 2, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 0.6047777441790142, 2.282091019050499, 0.37444247051708496], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 76, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
