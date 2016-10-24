function parseNameLsa(encodedMessage) {
  // decode encoded message
  console.log("decoder::parseNameLsa");
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

  //for debugging
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

    line += "  info = LsaInfo (Origin Router: " + ProtobufTlv.toName(nlsrStatusName.lsa_info.origin_router.origin_router_name.component).toUri();
    line += ", Sequence Number: " + nlsrStatusName.lsa_info.sequence_number +
                ", Expiration Period: " + nlsrStatusName.lsa_info.expiration_period + ")" + "</br>";

    for (var inames = 0; inames < nlsrStatusName.name_prefix.length;
         ++inames) {
      var namePrefix = ProtobufTlv.toName(nlsrStatusName.name_prefix[inames].component).toUri();

      // Make a row, and add name prefix to it
      tmp = $('<td><td>');
      tmp.text(namePrefix);
      row.append(tmp);

      // for debugging
      line += "\t\tname = ";
      line += ProtobufTlv.toName(nlsrStatusName.name_prefix[inames].component).toUri();
      line += "</br>";
    }
    console.log(line);
  }

  // Add the table to the page
  $('#advertisedPrefixes').append(table);
}

function parseAdjacentLsa(encodedMessage) {
  console.log("decoder::parseAdjacentLsa");
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
  var headers = ["Router", "Adjacents"];

  for (var i in headers) {
    var row = $('<td></td>').text(headers[i]);
    theadRow.append(row);
  }

  // Create the body of the table
  var tbody = $('<tbody></tbody>');
  table.append(tbody);

  var tmp;
  for (var iAdjLsa = 0; iAdjLsa < nlsrStatusAdjMessage.adj_lsa.length;
       ++iAdjLsa) {
    var nlsrStatusAdj = nlsrStatusAdjMessage.adj_lsa[iAdjLsa];
    // get the router name
    var originRouter = ProtobufTlv.toName(nlsrStatusAdj.lsa_info.origin_router.origin_router_name.component).toUri();

    // Make a row for the origin router and add orign router to it.
    var row = $('<tr></tr>');
    var tmp;
    tmp = $('<td rowspan="' + nlsrStatusAdj.adj.length + '"></td>');;
    tmp.text(originRouter);
    row.append(tmp);

    for (var iAdj = 0; iAdj < nlsrStatusAdj.adj.length; ++iAdj) {
      line += " adjacency = Adjacency(Name: " + ProtobufTlv.toName(nlsrStatusAdj.adj[iAdj].name.component).toUri() +
              ", Uri: " + nlsrStatusAdj.adj[iAdj].uri + ", Cost: " + nlsrStatusAdj.adj[iAdj].cost + ")" + "</br>";
      var adjacent = ProtobufTlv.toName(nlsrStatusAdj.adj[iAdj].name.component).toUri();
      //var cost = nlsrStatusAdj.adj[iAdj].cost;
      tmp = $('<td><td>');
      tmp.text(adjacent);
      row.append(tmp);
    }
  }

  // Add the table to the page
  $('#linkStatus').append(table);
}