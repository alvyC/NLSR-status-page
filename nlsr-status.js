var hostip = "localhost";

var face = new Face({host:hostip});

function onTimeout(interest)
{
    var nameStr = interest.getName().toUri().split("/").slice(0,-2).join("/");
    document.getElementById('pingreport').innerHTML += '<tr><td width="50%">' + nameStr + ' </td><td align="right">timeout</td></tr>' ;
}

function onData(interest, content, T0)
{
    var T1 = new Date();
    var nameStr = content.getName().toUri().split("/").slice(0,-2).join("/");
    var strContent = DataUtils.toString(content.getContent().buf());

    nameStr += '<font color="gray" size="-1"> (unverified)</font>';

    if (strContent=="NDN TLV Ping Response\0") {
      document.getElementById('pingreport').innerHTML += '<tr><td width="50%">' + nameStr + ' </td><td align="right">' + (T1-T0) + ' ms</td></tr>' ;
    } else {
      console.log("Unknown content received.");
    }
}

function requestNlsrStatus(name) {
  //var pingname = name + "/ping/" + Math.floor(Math.random()*100000);
  var T0 = new Date();
  face.expressInterest
    (name,
     function(interest, content) { onData(interest, content, T0); },
     onTimeout);
};

window.onload = function() {
    document.getElementById("host").innerHTML=hostip;
    requestNlsrStatus("/ndn/edu/memphis/%C1.Router/cs/pollux/lsdb/list");
}