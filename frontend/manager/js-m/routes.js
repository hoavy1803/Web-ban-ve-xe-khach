// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("user-img");
// When the user clicks the button, open the modal
btn.onmouseover = function() {
  modal.style.display = "block";
}
window.onmouseover = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}



var add_btn = document.getElementById("add-btn");
add_btn.onclick = function() {
    window.scrollTo(0, 500);
}


