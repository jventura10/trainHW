$(document).ready(function () {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBctV9Eai5PZawDj4Xqs_JD5NjKX_bIar8",
    authDomain: "trainapp-927fc.firebaseapp.com",
    databaseURL: "https://trainapp-927fc.firebaseio.com",
    projectId: "trainapp-927fc",
    storageBucket: "trainapp-927fc.appspot.com",
    messagingSenderId: "14568436256"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  $("#submitBtn").on("click", function (event) {
    event.preventDefault();

    var tName = $("#inputName").val().trim();
    var tDest = $("#inputDest").val().trim();
    var tFirst = $("#inputFirst").val().trim();
    var tFreq = $("#inputFreq").val().trim();

    database.ref().push({
      name: tName,
      destination: tDest,
      firstTime: tFirst,
      frequency: tFreq
    });

    $("#inputName").val("");
    $("#inputDest").val("");
    $("#inputFirst").val("");
    $("#inputFreq").val("");

  });


  database.ref().on("child_added", function (snapshot) {

    //Data for New Child in Database
    var trainName = snapshot.val().name;                //Newly Added Train's Name
    var trainDest = snapshot.val().destination;         //Newly Added Train's Destination
    var trainTime = moment(snapshot.val().firstTime, "HH:mm");           //Newly Added Train's First Time
    var trainFreq = parseInt(snapshot.val().frequency);           //Newly Added Train's Monthly Rate

    //Calculate How Many Minutes Diffence From Now and First Train Mod by Freq and Parse as INT, Gives us How Many Minutes in the Current Interval
    var nextOne = parseInt((moment().diff(trainTime, "minutes")) % trainFreq);

    //Number of Minutes Until Next Train
    var minutesAway = trainFreq - nextOne;

    var nextTrain = moment().add(minutesAway, "minutes");
    nextTrain = nextTrain.format("LT");

    //New Row in the Output Table
    var newRow = $("<tr>");

    //Append Each Piece of Data to Row in Same Order as the Table Headers in HTML File
    $(newRow).append("<td>" + trainName + "</td>");
    $(newRow).append("<td>" + trainDest + "</td>");
    $(newRow).append("<td>" + trainFreq + "</td>");
    $(newRow).append("<td>" + nextTrain + "</td>");
    $(newRow).append("<td>" + minutesAway + "</td>");

    //Append New Row to Table Body
    $("#scheduleArea").append(newRow);

    // Handle the errors
  }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

});
