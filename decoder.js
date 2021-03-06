function parseNameLsa(encodedMessage) {
  // decode encoded message
  console.log("decoder::parseNameLsa");
  var ProtoBuf = dcodeIO.ProtoBuf;
  var builder = ProtoBuf.loadProtoFile("nlsr-status-names.proto");
  var descriptor = builder.lookup("nlsr_message.NlsrStatusNamesMessage");
  var NlsrStatusNamesMessage = descriptor.build();
  var nlsrStatusNameMessage = new NlsrStatusNamesMessage();
  ProtobufTlv.decode(nlsrStatusNameMessage, descriptor, encodedMessage);

  // Add a table to the name prefix section
  var table = $('<table></table>').addClass('table');
  var thead = $('<thead></thead>');
  var theadRow = $('<tr></tr>');

  thead.append(theadRow);
  table.append(thead);

  // Create the table headers
  var headers = ["Router", "Prefix"];
  for (var i in headers) {
    var theadCol = $('<td></td>').text(headers[i]);
    theadRow.append(theadCol);
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
    var col = $('<td rowspan="' + nlsrStatusName.name_prefix.length + '"></td>');;
    col.text(originRouter);
    row.append(col);

    line += "  info = LsaInfo (Origin Router: " + originRouter;
    line += ", Sequence Number: " + nlsrStatusName.lsa_info.sequence_number +
                ", Expiration Period: " + nlsrStatusName.lsa_info.expiration_period + ")\n";

    for (var inames = 0; inames < nlsrStatusName.name_prefix.length;
         ++inames) {
      var namePrefix = ProtobufTlv.toName(nlsrStatusName.name_prefix[inames].component).toUri();

      // Make a row and add name prefix to it
      var col = $('<td></td>');
      col.text(namePrefix);
      row.append(col);
      tbody.append(row);
      row = $('<tr></tr>');

      // for debugging
      line += "\t\tname = ";
      line += namePrefix;
      line += "\n";
    }
    //console.log(line);
  }

  // Add the table to the page
  $('#namePrefixTable').append(table);
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

  // Add a new table to the adjacent section
  var table = $('<table></table>').addClass('table');
  var thead = $('<thead></thead>');
  var theadRow = $('<tr></tr>');

  thead.append(theadRow);
  table.append(thead);

  // Create the table headers
  var headers = ["Router", "Adjacent"];
  for (var i in headers) {
    var row = $('<td></td>').text(headers[i]);
    theadRow.append(row);
  }

  // Create the body of the table
  var tbody = $('<tbody></tbody>');
  table.append(tbody);

  var line = ""; // for debugging

  for (var iAdjLsa = 0; iAdjLsa < nlsrStatusAdjMessage.adj_lsa.length;
       ++iAdjLsa) {
    var nlsrStatusAdj = nlsrStatusAdjMessage.adj_lsa[iAdjLsa];
    // get the router name
    var originRouter = ProtobufTlv.toName(nlsrStatusAdj.lsa_info.origin_router.origin_router_name.component).toUri();

    // for debugging
    line += originRouter;
    line += "\n";

    // Make a row for the origin router and add orign router to it.
    var row = $('<tr></tr>');
    var col = $('<td rowspan="' + nlsrStatusAdj.adj.length + '"></td>');
    col.text(originRouter);
    row.append(col);

    for (var iAdj = 0; iAdj < nlsrStatusAdj.adj.length; ++iAdj) {
      var adjacent = ProtobufTlv.toName(nlsrStatusAdj.adj[iAdj].name.component).toUri();
      //var cost = nlsrStatusAdj.adj[iAdj].cost;
      var col = $('<td></td>');
      col.text(adjacent);
      row.append(col);

      // Append the data to the table and move to the next row
      tbody.append(row);
      row = $('<tr></tr>');

      // for debugging
      line += "\t\tadjacency = Adjacency(Name: " + adjacent +
              ", Uri: " + nlsrStatusAdj.adj[iAdj].uri + ", Cost: " + nlsrStatusAdj.adj[iAdj].cost + ")" + "\n";
    }
  }

  // Add the table to the page
  $('#adjacentTable').append(table);
}

function parseCoordinateLsa(encodedMessage) {
  console.log("decoder::parseCoordinateLsa");
  var ProtoBuf = dcodeIO.ProtoBuf;
  var builder = ProtoBuf.loadProtoFile("nlsr-status-coordinates.proto");
  var descriptor = builder.lookup("nlsr_message.NlsrStatusCoordinateMessage");
  var NlsrStatusCoordinateMessage = descriptor.build();
  var nlsrStatusCoordinateMessage = new NlsrStatusCoordinateMessage();
  ProtobufTlv.decode(nlsrStatusCoordinateMessage, descriptor, encodedMessage);

  // Add a table to the Coordinate LSA section
  var table = $('<table></table>').addClass('table');
  var thead = $('<thead></thead>');
  var theadRow = $('<tr></tr>');

  thead.append(theadRow);
  table.append(thead);

  var headers = ["Router", "Coordinate"];
  for (var i in headers) {
    var theadCol = $('<td></td>').text(headers[i]);
    theadRow.append(theadCol);
  }

  // create the body of the table
  var tbody = $('<tbody></tbody>');
  table.append(tbody);

  var line = "";
  for (var iCoorLsa = 0; iCoorLsa < nlsrStatusCoordinateMessage.coor_lsa.length;
       ++iCoorLsa) {
    var nlsrStatusCoor = nlsrStatusCoordinateMessage.coor_lsa[iCoorLsa];
    var origin_router = ProtobufTlv.toName(nlsrStatusCoor.lsa_info.origin_router.origin_router_name.component).toUri();;
    var angle = nlsrStatusCoor.angle.value
    var radius = nlsrStatusCoor.radius.value

    var row = $('<tr></tr>');

    var col = $('<td></td>');
    col.text(origin_router);
    row.append(col);

    col = $('<td></td>');
    col.text("Angle: " + angle + ", Radius: " + radius);
    row.append(col);

    tbody.append(row);

    // for debugging
    line += "  info = LsaInfo (Origin Router: " + origin_router;
    line += ", Sequence Number: " + nlsrStatusCoor.lsa_info.sequence_number +
          ", Expiration Period: " + nlsrStatusCoor.lsa_info.expiration_period + ")" + "\n";
    line += "angle: " + nlsrStatusCoor.angle.value + "\n";
    line += "radius: " + nlsrStatusCoor.radius.value + "\n";
    line += "\n";
  }
  // add table to the page
  $('#coordinateTable').append(table);
  console.log(line);
}