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

    // make a row for the origin router
    var row = $('<tr></tr>');
    var tmp;
    var nlsrStatusName = nlsrStatusNameMessage.name_lsa[iNameLsa];
    //console.log(ProtobufTlv.toName(nlsrStatusName.lsa_info.origin_router.origin_router_name.component).toUri());
    //line += "  info = LsaInfo (Origin Router: " + ProtobufTlv.toName(nlsrStatusName.lsa_info.origin_router.origin_router_name.component).toUri();
    originRouter = ProtobufTlv.toName(nlsrStatusName.lsa_info.origin_router.origin_router_name.component).toUri();
    line += ", Sequence Number: " + nlsrStatusName.lsa_info.sequence_number +
          ", Expiration Period: " + nlsrStatusName.lsa_info.expiration_period + ")" + "</br>";

    for (var inames = 0; inames < nlsrStatusName.name_prefix.length;
         ++inames) {
      line += "\t\tname = ";
      // Need to iterate through the name components. -- jefft0
      for (var i = 0; i < nlsrStatusName.name_prefix[inames].component.length; ++i) {
        line += "/" + nlsrStatusName.name_prefix[inames].component[i].toString("utf8");
      }
      line += "</br>";
    }
  }
}

