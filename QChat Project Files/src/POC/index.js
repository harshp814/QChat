var text = document.getElementById("text");

var session = document.getElementById("text1");
var questions;

function submitClick() {
    var sessionID = session.value
    var postRef = firebase.database().ref('/' + sessionID);
    var messageText = text.value;
    postRef.push(messageText);
    printValues();
}

function printValues() {
    var ref = firebase.database().ref('/' + session.value);
    ref.on("value", function (snapshot) {
        questions = snapshot.val();
        var keys = Object.keys(questions);
        document.getElementById("out").innerHTML = '';
        for (var i = keys.length-1; i >= 0; i--) {
            var key = keys[i];
            document.getElementById("out").innerHTML += '<div class="qCard"> <h1>' + questions[key] + '</h1> </div>';
        }
    }, function (error) {
        console.log("Error: " + error.code);
    });
}

function hide() {
    document.getElementById("first").style.display = "none";
}
function show() {
    document.getElementById("second").style.display = "block";
    document.getElementById("secondDiv").style.display = "block";
}

function clearContents() {
    text.value = '';
}
