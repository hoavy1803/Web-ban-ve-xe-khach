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

var discount_btn = document.getElementById("discount-edit");
// var discount = document.getElementById("discount");

var save_btn = document.getElementById("save");

// discount_btn.onclick = function() {
//     discount.removeAttribute("disabled");

// }


document.addEventListener("DOMContentLoaded", function () {
  var discount_btn = document.getElementById("discount-edit");
  discount_btn.onclick = function () {
      // Mã JavaScript của bạn ở đây
      var discount = document.getElementById("discount");
      discount.removeAttribute("disabled");
      var newDiscountValue = document.getElementById("discount").value;
      var day = document.getElementById("date").value;
      console.log(newDiscountValue, day);

      // Gửi yêu cầu HTTP đến máy chủ để cập nhật cơ sở dữ liệu
      fetch("/update_discount", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              discount: newDiscountValue,
              selectedDay: day,
          }),
      })
          .then((response) => {
            // alert("Cập nhật thành công:", data);}
              //  alert(response.json())}
              Swal.fire({
                text: "Đã cập nhật thành công",
                icon: "success",
            }).then(() => {
                location.reload();
            });}
          )
          .then((data) => {
              // Xử lý phản hồi từ máy chủ nếu cần
              alert("Cập nhật thành công:", data);
          })
          .catch((error) => {
              console.error("Lỗi khi cập nhật:", error);
          });
  };
});



for (const i of document.getElementsByClassName("changed-info")) {
        i.oninput = function() {
            save_btn.style.backgroundColor = "#0097B2";
            save_btn.style.border = "none";
            save_btn.style.cursor = 'pointer';
            save_btn.removeAttribute("disabled");
        }
    }

var edit_detail = document.getElementById("edit-detail");
for (const i of document.getElementsByClassName("edit-btn")) {
    i.onclick = function() {
        edit_detail.style.display = 'block';
        window.scrollTo(0, 500);
    }
}


var del_btn = document.getElementById('del-btn');
var alert = document.getElementById('alert');
var close_btn = document.getElementById("close-btn");

// When the user clicks the button, open the modal
del_btn.onclick = function() {
  alert.style.display = "block";
}


// When the user clicks anywhere outside of the modal hoặc nút không, close it
window.onclick = function(event) {
  if (event.target == alert || event.target == close_btn) {
    alert.style.display = "none";
  }
}

var yes_btn = document.getElementById("yes");
yes_btn.onclick = function() {
    // gửi yêu cầu xóa này lên server
    location.reload();
}

var add_btn = document.getElementById("add-btn");
add_btn.onclick = function() {
    window.scrollTo(0, 500);
}

save_btn.onclick = function() {
    for (const i of document.getElementsByClassName("changed-info")) {
        i.submit();
    }
}


discount_btn.onclick = function() {
  discount.removeAttribute("disabled");
  var newDiscountValue = document.getElementById("discount").value;
  var day=document.getElementById("date").value;
  console.log(newDiscountValue,day)
  // Gửi yêu cầu HTTP đến máy chủ để cập nhật cơ sở dữ liệu
  fetch("http://127.0.0.1:8000/update_discount", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
      discount: newDiscountValue,
      selectedDay:day
      }),
  })
  .then(response => response.json())
  .then(data => {
      // Xử lý phản hồi từ máy chủ nếu cần
      console.log("Cập nhật thành công:", data);
  })
  .catch(error => {
      console.error("Lỗi khi cập nhật:", error);
  });

}