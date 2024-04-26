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



var edit_detail = document.getElementById("edit-detail");
for (const i of document.getElementsByClassName("edit-btn")) {
    i.onclick = function() {
        edit_detail.style.display = 'block';
        window.scrollTo(0, 500);
    }
}

var add_btn = document.getElementById("add-btn");
add_btn.onclick = function() {
    window.scrollTo(0, 500);
}


var display = document.getElementById('display');
var close_btn = document.getElementById("close-btn");

// When the user clicks anywhere outside of the modal hoặc nút không, close it
window.onclick = function(event) {
  if (event.target == display || event.target == close_btn) {
    display.style.display = "none";
  }
}

var yes_btn = document.getElementById("yes");
yes_btn.onclick = function() {
    // gửi yêu cầu xóa này lên server
    location.reload();
}


