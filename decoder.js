function parseNameLsa(encodedMessage) {
  // decode encoded message
  var ProtoBuf = dcodeIO.ProtoBuf;
  var builder = ProtoBuf.loadProtoFile("nlsr-status-names.proto");
  var descriptor = builder.lookup("nlsr_message.NlsrStatusNamesMessage");
  var NlsrStatusNamesMessage = descriptor.build();
  var nlsrStatusNameMessage = new NlsrStatusNamesMessage();
  ProtobufTlv.decode(nlsrStatusNameMessage, descriptor, encodedMessage);

  // create table
  var table = $('<table></table>').addClass('table');
  var thead = $('<thead></thead>');
  var theadRow = $('<tr></tr>');
  thead.append(theadRow);
  table.append(thead);

  // Create the table headers
  var headers = ["Router", "Prefix"];
  for (var i in headers) {
    var row = $('<td></td>').text(headers[i]);
    theadRow.append(row);
  }

  // Create the body of the table
  var tbody = $('<tbody></tbody>');
  table.append(tbody);

  var line = "";
  for (var iNameLsa = 0; iNameLsa < nlsrStatusNameMessage.name_lsa.length; ++iNameLsa) {
    var nlsrStatusName = nlsrStatusNameMessage.name_lsa[iNameLsa];
    var originRouter = ProtobufTlv.toName(nlsrStatusName.lsa_info.origin_router.origin_router_name.component).toUri();

    // make a row for the origin router
    var row = $('<tr></tr>');
    var tmp;
    tmp = $('<td rowspan="' + nlsrStatusName.name_prefix.length + '"></td>');;
    tmp.text(originRouter);
    row.append(tmp);

    for (var inames = 0; inames < nlsrStatusName.name_prefix.length;
         ++inames) {
      var namePrefix = ProtobufTlv.toName(nlsrStatusName.name_prefix[inames].component).toUri();
      tmp = $('<td><td>');
      tmp.text(namePrefix);
      row.append(tmp);
    }
  }

  // Add the table to the page
  $('#advertisedPrefixes').append(table);
}

function parseAdjacentLsa(encodedMessage) {
  // decode encoded message
  var ProtoBuf = dcodeIO.ProtoBuf;
  var builder = ProtoBuf.loadProtoFile("nlsr-status-adjacencies.proto");
  var descriptor = builder.lookup("nlsr_message.NlsrStatusAdjMessage");
  var NlsrStatusAdjMessage = descriptor.build();
  var nlsrStatusAdjMessage = new NlsrStatusAdjMessage();
  ProtobufTlv.decode(nlsrStatusAdjMessage, descriptor, encodedMessage);

  // Add a new table to the prefix section of the page
  var table = $('<table></table>').addClass('table');
  var thead = $('<thead></thead>');
  var theadRow = $('<tr></tr>');

  thead.append(theadRow);
  table.append(thead);

  // Create the table headers
  var headers = ["Router", "Links"];

  for (var i in headers) {
    var row = $('<td></td>').text(headers[i]);
    theadRow.append(row);
  }

  // Create the body of the table
  var tbody = $('<tbody></tbody>');
  table.append(tbody);

  for (var iAdjLsa = 0; iAdjLsa < nlsrStatusAdjMessage.adj_lsa.length;
      ++iAdjLsa) {

    var nlsrStatusAdj = nlsrStatusAdjMessage.adj_lsa[iAdjLsa];

    var originRouter = ProtobufTlv.toName(nlsrStatusAdj.lsa_info.origin_router.origin_router_name.component).toUri();

    for (var iAdj = 0; iAdj < nlsrStatusAdj.adj.length; ++iAdj) {
      line += " adjacency = Adjacency(Name: " + ProtobufTlv.toName(nlsrStatusAdj.adj[iAdj].name.component).toUri() +
              ", Uri: " + nlsrStatusAdj.adj[iAdj].uri + ", Cost: " + nlsrStatusAdj.adj[iAdj].cost + ")" + "</br>";
      var adjacency = ProtobufTlv.toName(nlsrStatusAdj.adj[iAdj].name.component).toUri();
    }
  }
}