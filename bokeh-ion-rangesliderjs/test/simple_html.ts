import $ from "jquery";
import "ion-rangeslider"

//And a trivial slider that does nothing
let range = document.getElementById('example_id');
if ( range ) {
  $('#example_id').ionRangeSlider({
      disable: false
  });
}
