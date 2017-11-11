var text = document.getElementById("text");

var session = document.getElementById("text1");
var questions;

function submitClick() {
    var sessionID = session.value
    var postRef = firebase.database().ref('/' + sessionID);
    var messageText = text.value;
    var pushedRef = postRef.push();
    var pushedRefKey = pushedRef.getKey();
    console.log(pushedRefKey);
    postRef.child(pushedRefKey).set({
        "question" : messageText,
        "responses" : { 
            1: "none yet" 
        },
        "upvote" : 0, 
    });
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
            var keyResp = key + "RESP";
            var keyInput = key + "INPUT";

            document.getElementById("out").innerHTML += 
            '<div class="qCard">' +
                '<h1 id='+ key + '>' +
                    questions[key]["question"] + 
                    '<button align="right" class = "answer" id="submit1"' +
                        'onClick=showResponses("' + key + '"),' +
                        'document.getElementById("'+ keyResp +'").style.display="block";>Answer</button>' +
                '</h1>' + 
                '<h1 id="'+ keyResp +'" hidden></h1>' + 
                '<input align="left" id="'+ keyInput +'" placeholder="Please enter your answer here" >' + 
                '<button align="right" class = "answer" id="submit1" onClick=postAnswer("' + key + '",document.getElementById("'+keyInput+'").value)>Submit</button>' +
                '</input>'
            '</div>';
        }
    }, function (error) {
        console.log("Error: " + error.code);
    });
}

function showResponses(id){
    var keyResp = id + "RESP";
    document.getElementById(keyResp).innerHTML = '';
    var ref = firebase.database().ref('/' + session.value + '/' + id + '/responses');
    ref.on("value", function (snapshot) {
        var responses = snapshot.val();
        var keys = Object.keys(responses);
        var count = 1;
        for (var i = keys.length-1; i >= 1; i--) {
            document.getElementById(keyResp).innerHTML += '<br>' + count + '. ' + responses[keys[i]];
            count++;
            //console.log(String(responses[keys[i]]));
        }
    });
}
function postAnswer(id, answer){
    var postRef = firebase.database().ref('/' + session.value + '/' + id);
    var newPostKey = firebase.database().ref().child('responses').push().key;
    console.log(answer);
    
    var newPostKey = firebase.database().ref().child('posts').push().key;
    var updates = {};
    updates['/responses/' + newPostKey] = answer;
  
    return firebase.database().ref('/' + session.value + '/' + id).update(updates);
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
