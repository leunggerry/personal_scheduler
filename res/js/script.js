/** Global Variables
 ******************************************************************************/

/** Function Definitions
 ******************************************************************************/
var printTodaysDate = function () {
  var currentDayEl = $("#currentDay");

  //console.log(currentDayEl);
  currentDayEl.text(getCurrentDay());
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

var getTheHour = function () {
  //console.log(now.format("h"));

  return moment().format("h");
};

var getTheMinute = function () {
  //console.log(now.format("h"));

  return moment().format("mm");
};

var getTheTime = function () {
  //console.log(moment().format("h:mm a"));
  return moment().format("h:mm a");
};

/** Main Program
 ******************************************************************************/
printTodaysDate();
