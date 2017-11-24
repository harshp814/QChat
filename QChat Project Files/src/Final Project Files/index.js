/** Behaviours for Qchat Web-app */
//global variables for constant access to HTML elements and data
var text = document.getElementById("text");
var session = document.getElementById("text1");
var questions = [];

/**
 * Posts the user's question to the database in desired format
 */
function pushQuestion() {
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
        "key" : pushedRefKey
    });
    printQuestions();
}

/**
 * Prints the questions from the database
 */
function printQuestions() {
    var ref = firebase.database().ref('/' + session.value);
    ref.on("value", function (snapshot) {
        var question = snapshot.val();
        var keys = Object.keys(question);

        for (var i in question) {
          questions.push(question[i]);
        }
        questions.sort(function(a, b) {
          return b.upvote - a.upvote;
        });
        document.getElementById("out").innerHTML = '';

        questions.forEach(function(que) {
          var keyResp = que.key + "RESP";
          var keyInput = que.key + "INPUT";
          document.getElementById("out").innerHTML +=
          '<div class="qCard">' +
              '<h1 id='+ que.key + '>' + que.question +'</h1>' +
              
              '<button align="right" class = "answer" id="submit1"' +
                      'onClick=showResponses("' + que.key + '"),' +
                      'document.getElementById("'+ keyResp +'").style.display="block";>Show Answers</button>' +
              
              '<h1 id='+ keyResp +'></h1>' +
              
              '<div>' + 
              
                    '<input align="left" id="'+ keyInput +'" placeholder="Please enter your answer here" ></input>' +
              
                    '<div><button align="right" class = "answer" id="submit1" ' + 
                        'onClick=postAnswer("' + que.key+ '",document.getElementById("' + keyInput +  
                        '").value)> Submit My Answer </button> </div>' +
              
              '</div>' +

                            
              
              '<div align="right" >' +
                    '<button align="right" id="'+ que.key +'" onClick=upVote("' + que.key + '")>  &nbsp +  &nbsp </button>' +
              
                    '<h1 align="right">'+"Votes: " +que.upvote +'</h1>' +
              
                    '<button align="right" id="'+ que.key +'" onClick=downVote("' + que.key + '")> &nbsp - &nbsp</button>' +
              '</div>' +
              

              
          '</div>';
        });
        questions = [];

    }, function (error) {
        console.log("Error: " + error.code);
    });
}

/**
 * Shows the responses to the specified question.
 * @param {String} id - The id of the h1 element where the responses will be printed - the value of the id is the key of the question itself
 */
function showResponses(id){
    var keyResp = id + "RESP";
    document.getElementById(keyResp).innerHTML = '';
    var ref = firebase.database().ref('/' + session.value + '/' + id + '/responses');
    ref.on("value", function (snapshot) {
        var responses = snapshot.val();
        var keys = Object.keys(responses);
        var count = 1;
        for (var i = keys.length-1; i >= 1; i--) {
            document.getElementById(keyResp).innerHTML += '<br>' + count + '.' + responses[keys[i]];
            count++;
            //console.log(String(responses[keys[i]]));
        }
    });
}

/**
 * Posts the answer to a specific question to its corresponding location in the database
 * @param {String} id - The id of the input element where the answer was typed
 * @param {String} answer - The answer the user wishes to post
 */
function postAnswer(id, answer){
    var postRef = firebase.database().ref('/' + session.value + '/' + id);
    var newPostKey = firebase.database().ref().child('responses').push().key;

    var newPostKey = firebase.database().ref().child('posts').push().key;
    var updates = {};
    updates['/responses/' + newPostKey] = answer;

    return firebase.database().ref('/' + session.value + '/' + id).update(updates);
}

/**
 * Increments the upvote counter by 1 for corresponding question
 * @param {String} id - The id of the element where the vote counter is kept
 */
function upVote(id){
    var ref = firebase.database().ref('/' + session.value + '/' + id + '/upvote');
    var votes;
    ref.on("value", function (snapshot) {
        votes = snapshot.val();
    });
    votes++;
    var updates = {};
    updates['/upvote'] = votes;
    return firebase.database().ref('/' + session.value + '/' + id).update(updates);
}

/**
 * Increments the upvote counter by 1 for corresponding question
 * @param {String} id - The id of the element where the vote counter is kept
 */
function downVote(id){
     var ref = firebase.database().ref('/' + session.value + '/' + id + '/upvote');
    var votes;
    ref.on("value", function (snapshot) {
        votes = snapshot.val();
    });
    votes--;
    var updates = {};
    updates['/upvote'] = votes;
    return firebase.database().ref('/' + session.value + '/' + id).update(updates);
}

/**
 * Shows (unhides) the second component of the User interface which is only accessible after initial session entry
 */
function show() {
    document.getElementById("second").style.display = "block";
    document.getElementById("secondDiv").style.display = "block";
}

/**
 * Clears the content of the input box used for letting users enter questions
 */
function clearContents() {
    text.value = '';
}
