/*
  Script used to retrieve status content based on the given names, and update the tables
  on the status page

  Muktadir Chowhury - mrchwdhr@memphis.edu
*/

var face;

// Enables the tabs to work
$('#myTab a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})

function onData(interest, encodedMessage) {
  console.log("Got data for " + interest.getName().toUri());

  var nameStr = interest.getName().toUri().split("/");
  var lsType = nameStr[nameStr.length-1]
  console.log(lsType);

  if (lsType == "names") {
    console.log("Got Name LSA Data.");
    parseNameLsa(encodedMessage);
  }
  else if (lsType == "adjacencies") {
    console.log("Got Adjaceny LSA Data.");
    parseAdjacentLsa(encodedMessage);
  }
  else {
    console.log("LSA type: " + lsType + " is unknown");
  }
}

function onTimeout(interest) {
  console.log("Interest timed out: " + interest.getName().toUri());
  console.log("Host: " + face.connectionInfo.toString());

  console.log("Reexpressing interest: " + interest.getName().toUri());

  SegmentFetcher.fetch(face, interest, SegmentFetcher.DontVerifySegment,
                       function(encodedMessage) {
                         console.log("Got data");
                         onData(interest, encodedMessage);
                       },
                       function(errorCode, message) {
                          console.log("Error #" + errorCode + ": " + message);
                          /*onTimeout(interest);*/
                        }
                      );
}


function getLsa(lsType) {
  console.log("init:getLsa()");
  switch(lsType) {
    case "names":
      // get Name lsa from Titan (Memphis)
      var interest = new Interest(new Name("/ndn/edu/memphis/%C1.Router/titan/lsdb/" + lsType));
      break;
    case "adjacencies":
      // get Adjacency Lsa from Hobo (Arizona)
      var interest = new Interest(new Name("/ndn/edu/arizona/%C1.Router/hobo/lsdb/" + lsType));
      break;
    case "coordinates":
      var interest = new Interest(new Name("/ndn/edu/memphis/%C1.Router/titan/lsdb/" + lsType));
      break;
    default:
      console.log("LSA type: " + lsType + " is unknown");
  }

  console.log("Express Interest: " + interest.getName().toUri());
  interest.setInterestLifetimeMilliseconds(4000);
  SegmentFetcher.fetch (face, interest, SegmentFetcher.DontVerifySegment,
                        function(encodedMessage) {
                          onData(interest, encodedMessage);
                        },
                        function(errorCode, message) {
                          console.log("Error retrieving data.");
                        });
}


$(document).ready(function() {
  face = new Face({host:"titan.cs.memphis.edu"});
  getLsa("names");
  getLsa("adjacencies");
});