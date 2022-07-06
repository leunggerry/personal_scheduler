/** Global Variables
 ******************************************************************************/
const BUSINESS_HOURS = ["9AM", "10AM", "11AM", "12AM", "1PM", "2PM", "3PM", "4PM", "5PM"];
const BUSINESS_HOURS_INT = [9, 10, 11, 12, 1, 2, 3, 4, 5];
var currentDaySchedule = {};

/** Function Definitions
 ******************************************************************************/
var printTodaysDate = function () {
  var currentDayEl = $("#currentDay");

  //console.log(currentDayEl);
  currentDayEl.text(getCurrentDay());
};

var showTimeBlock = function (hour) {
  var timeBockContainerEl = document.querySelector(".container");
  var hourNum = hour.match(/[0-9]+/); // get only the hour

  //   console.log(hourNum[0]);
  // create row div for hour time block
  var hourBlockDivEl = document.createElement("div");
  hourBlockDivEl.classList = "row";
  hourBlockDivEl.id = "hour-" + hourNum[0];

  timeBockContainerEl.appendChild(hourBlockDivEl);

  //show the hour on the right
  var hourTextEl = document.createElement("span");
  hourTextEl.classList = "col col-sm-2 border-right hour";
  hourTextEl.textContent = hour;
  hourBlockDivEl.appendChild(hourTextEl);

  //show events schedule for this hour
  var eventDescriptionDivEl = document.createElement("div");
  eventDescriptionDivEl.classList = "col-9 description hour-description-" + hour;
  var eventDescriptionPEl = document.createElement("p");
  eventDescriptionPEl.textContent = currentDaySchedule[hour];
  eventDescriptionPEl.id = "hourDescription-" + hourNum[0];

  //append event description to hour Block div
  hourBlockDivEl.appendChild(eventDescriptionDivEl);
  eventDescriptionDivEl.appendChild(eventDescriptionPEl);

  //checkSchedule time block
  auditTimeBlock(eventDescriptionDivEl);

  //add save button to the end
  var saveBtnEl = document.createElement("button");
  saveBtnEl.classList = "col-1 border-left saveBtn";
  saveBtnEl.id = "saveBtn-" + hourNum[0];
  saveBtnEl.innerHTML = "<span class='oi oi-lock-locked'></span>";

  hourBlockDivEl.appendChild(saveBtnEl);
};

var showWorkingHours = function () {
  // check if we have a schedule in localstorage
  var schedule = getSchedule();

  for (var hour in schedule) {
    showTimeBlock(hour);
  }
};

var auditTimeBlock = function (timeBlock) {
  var currentHour = getTheHour24Hr();

  //get the paragraph block
  var descriptionEl = $(timeBlock).find("p");
  //get timeBlock hour
  var descriptionHour = $(descriptionEl).attr("id");
  var descriptionHourNum = parseInt(descriptionHour.match(/[0-9]+/));

  //check description hour and use 24hr clock to make easier to calc
  if (descriptionHourNum < 9) {
    descriptionHourNum += 12;
  }

  //remove old classes
  $(timeBlock).removeClass("past present future");
  //it is currently that hour block
  if (currentHour === descriptionHourNum) {
    $(timeBlock).addClass("present");
  }
  //time hasnt past
  else if (currentHour < descriptionHourNum) {
    $(timeBlock).addClass("future");
  }
  // time has past
  else {
    $(timeBlock).addClass("past");
  }
  //console.log(descriptionHour);
};
/** Utility function
 ******************************************************************************/
var getCurrentDay = function () {
  var now = moment();
  //   var day = now._d.getDate();
  //   var month = now._d.getMonth();
  //   var year = now._d.getFullYear();
  //   console.log(now);
  //   console.log(day);
  //   console.log(month);
  //   console.log(year);

  //console.log(now.format("dddd, MMMM Do YYYY"));
  return now.format("dddd, MMMM Do YYYY");
};

var getTheHour24Hr = function () {
  return moment().format("H");
};
var getTheHour = function () {
  return moment().format("h");
};

var getTheMinute = function () {
  return moment().format("mm");
};

var getTheTime = function () {
  //console.log(moment().format("h:mm a"));
  return moment().format("h:mm a");
};

var getSchedule = function () {
  //fetch from local storage
  currentDaySchedule = JSON.parse(localStorage.getItem("schedule"));

  // if not in local storage create it
  if (!currentDaySchedule) {
    currentDaySchedule = {
      "9AM": "",
      "10AM": "",
      "11AM": "",
      "12PM": "",
      "1PM": "",
      "2PM": "",
      "3PM": "",
      "4PM": "",
      "5PM": "",
    };
  }
  return currentDaySchedule;
};

var saveSchedule = function () {
  localStorage.setItem("schedule", JSON.stringify(currentDaySchedule));
};

var getHourString = function (num) {
  if (num > 5 && num < 12) {
    return num + "AM";
  }
  //else afternoon
  else {
    return num + "PM";
  }
};

/** Main Program
 ******************************************************************************/
printTodaysDate();
//load schedule for the first time
showWorkingHours();

//time block description is clicked
$(".container").on("click", "p", function () {
  //get current text in the element
  var text = $(this).text().trim();
  //change to text input area
  var textInput = $("<textarea>").addClass("form-control").val(text);

  // replace p element with text input element
  $(this).replaceWith(textInput);
  textInput.trigger("focus");
});

//save button was clicked
$(".container").on("click", "button", function () {
  console.log($(this));
  //get the update event
  var text = $("textarea").val().trim();

  var [_btn, hour] = this.id.split("-");

  var hourBlockStr = getHourString(hour);
  console.log(hourBlockStr);
  //update schedule
  currentDaySchedule[hourBlockStr] = text;
  console.log(currentDaySchedule);

  //update local storage
  saveSchedule();

  //recreate the p element
  var eventDescriptionPEl = $("<p>").text(text);
  eventDescriptionPEl.classList = "col-9 description";
  $("textarea").replaceWith(eventDescriptionPEl);
});

// set a time to keep checking tasks to make sure the correct color
// category is applied
setInterval(function () {
  $(".description .hour-description").each(function (index, el) {
    auditTimeBlock(el);
  });
}, 1000 * 60 * 5); //execute code every 5 mins
