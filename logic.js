
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDlMrus8TgA4C3kmx5UNhgn0kj-MWRiBHk",
    authDomain: "trainactivity-480b7.firebaseapp.com",
    databaseURL: "https://trainactivity-480b7.firebaseio.com",
    projectId: "trainactivity-480b7",
    storageBucket: "trainactivity-480b7.appspot.com",
    messagingSenderId: "334319294284"
  };
  firebase.initializeApp(config);

var database = firebase.database();

var name = "";
var destination = "";
var frequency = 0;
var initialTrainTime = 0;
var arrival = 0; //this variable is not stored in firebase
var minAway = 0; //this variable is nor stored in firebase

$("#addTrain").on("click", function(event) {
  event.preventDefault();
	
	name = $("#trainName").val().trim();
	destination = $("#trainDestination").val().trim();
	frequency = $("#trainFrequency").val().trim();
	initialTrainTime = $("#firstTrainTime").val().trim();
	

	database.ref().push({
		name: name,
		destination: destination,
		frequency: frequency,
		initialTrainTime: initialTrainTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP  
	});
});


database.ref().on("child_added", function(snapshot) {

    // Print the initial data to the console.
    console.log(snapshot.val());

    
    // First Time (pushed back 1 year to make sure it comes before current time)
    var initialTimeConverted = moment(snapshot.val().initialTrainTime, "hh:mm").subtract(1, "years");
    console.log(initialTimeConverted);


    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(initialTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var timeRemainder = diffTime % snapshot.val().frequency;
    console.log("TIME REMAINDER = " + timeRemainder);

    // Minute Until Train
    minAway = snapshot.val().frequency - timeRemainder;
    console.log("MINUTES FOR NEXT TRAIN: " + minAway);

    // Next Train
    arrival = moment().add(minAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(arrival).format("hh:mm"));



	// Change the HTML
      $("#tableHeader").html(
       "<tr><th> " + "Train Name" + 
      "</th><th> " + "Destination" + 
      "</th><th> " + "Frequency (min)" +
      "</th><th> " + "Next Arrival" +
      "</th><th> " + "Minutes Away" +
      "</th></tr><br>");

      $("#trainTable").append(
        "<tr><td> " + snapshot.val().name + 
      " </td><td> " + snapshot.val().destination +
      " </td><td> " + snapshot.val().frequency +
      " </td><td> " + (moment(arrival).format("hh:mm A")) +
      " </td><td> " + minAway + 
      "</td></tr>");

// If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
  });