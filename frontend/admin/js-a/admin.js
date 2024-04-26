// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("user-img");
// When the user clicks the button, open the modal
btn.onmouseover = function () {
  modal.style.display = "block";
}
window.onmouseover = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// lọc tài khoản
var filter_name = document.getElementById('acc-name');
var filter_mailphone = document.getElementById('acc-mailphone');
var filter_type = document.getElementById('acc-type');

var table = document.getElementById('table-data');
tr = table.getElementsByTagName("tr");

function myFilterFunction() {
  // lặp qua tất cả các thẻ tr
  for (i = 0; i < tr.length; i++) {
    // lấy giá trị của thẻ td đầu tiên đại diện cho tên
    ten = tr[i].getElementsByTagName("td")[1];
    sdt = tr[i].getElementsByTagName("td")[3];
    loai = tr[i].getElementsByTagName("td")[4];

    console.log(ten);

    if (loai) {
      if (ten) {
        if (sdt) {
          // kiểm tra giá trị filter có tồn tại trong thẻ tr không
          if (ten.innerHTML.toUpperCase().indexOf(filter_name.value.toUpperCase()) > -1 && sdt.innerHTML.toUpperCase().indexOf(filter_mailphone.value.toUpperCase()) > -1 && loai.innerHTML.toUpperCase().indexOf(filter_type.value.toUpperCase()) > -1) {
            //nếu có hiển thị chúng
            tr[i].style.display = "";
          } else {
            // nếu không ẩn chúng
            tr[i].style.display = "none";
          }
        } else {
          if (ten.innerHTML.toUpperCase().indexOf(filter_name.value.toUpperCase()) > -1 && loai.innerHTML.toUpperCase().indexOf(filter_type.value.toUpperCase()) > -1) {
            //nếu có hiển thị chúng
            tr[i].style.display = "";
          } else {
            // nếu không ẩn chúng
            tr[i].style.display = "none";
          }
        }
      }
    }

  }

}



function displayTable(data) {
  // Lấy container để hiển thị bảng
  var tableContainer = document.getElementById("table-data");

  // Xóa bảng cũ (nếu có)
  tableContainer.innerHTML = "";

  // Tạo bảng mới
  var table = document.createElement("table");

  // Tạo header của bảng
  var headerRow = table.insertRow(0);
  var headers = Object.keys(data[0]); // Lấy tên các cột từ dữ liệu đầu tiên
  for (var i = 0; i < headers.length; i++) {
    var headerCell = headerRow.insertCell(i);
    headerCell.textContent = headers[i];
  }

  // Thêm dữ liệu vào bảng
  for (var i = 0; i < data.length; i++) {
    var row = table.insertRow(i + 1);
    for (var j = 0; j < headers.length; j++) {
      var cell = row.insertCell(j);
      cell.textContent = data[i][headers[j]];
    }
  }

  // Thêm bảng vào container
  tableContainer.appendChild(table);
}




var all = document.getElementById('table-data');
var edit = document.getElementById('acc-edit');
var info = document.getElementById('acc-info');

for (const btn of document.querySelectorAll(".edit-btn")) {
  // When the user clicks the button, open the modal
  btn.onclick = function () {
    all.style.display = "none";
    edit.style.display = 'block';
    info.style.display = 'none';

  }
}

var edit_link = document.getElementById('edit-link');


edit_link.onclick = function () {
  all.style.display = "none";
  edit.style.display = 'block';
  info.style.display = 'none';
}

var del_link = document.getElementById('del-link');
var alert = document.getElementById('alert');
var close_btn = document.getElementById("close-btn");

// When the user clicks the button, open the modal
del_link.onclick = function () {
  alert.style.display = "block";
}


// When the user clicks anywhere outside of the modal hoặc nút không, close it
window.onclick = function (event) {
  if (event.target == alert || event.target == close_btn) {
    alert.style.display = "none";
  }
}

var del_btn = document.getElementById("yes");
del_btn.onclick = function () {
  // gửi yêu cầu xóa tài khoản này lên server
  location.reload();
}


function handleSubmit() {
  const selectElement = document.querySelector('select[name="user-type"]');
  const selectedOption = selectElement.value;
  const table = document.getElementById('add_khachhang');
  const table_NV = document.getElementById('add_nhanvien')
  // Xử lý dữ liệu dựa trên giá trị đã chọn
  if (selectedOption === 'passenger') {
    // Logic khi chọn Khách hàng
    table.style.display = 'block';
  } else if (selectedOption === 'manager') {
    // Logic khi chọn Quản lý
    table_NV.style.display = 'block'
    console.log('Bạn đã chọn Quản lý');
  } else if (selectedOption === 'administrator') {
    // Logic khi chọn Admin
    table_NV.style.display = 'block'
    console.log('Bạn đã chọn Admin');
  }
}

async function add_khachhang() {
  const tenKH = document.getElementById("tenKH").value;
  const email = document.getElementById("email").value
  const sdt = document.getElementById("soDT").value
  const nganhang = document.getElementById("nganhang").value
  const mk = document.getElementById("mk").value
  const table = document.getElementById('add_khachhang')
  const response = await fetch('http://127.0.0.1:8000/add_kh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'tenKH': tenKH,
      'email': email,
      'sdt': sdt,
      'nganhang': nganhang,
      'mk': mk
    })
  });
  const responseData = await response.json();
  const message = responseData.message;
  alert(message)
  table.style.display = 'none'
}

var editButtons = document.querySelectorAll(".edit-button");
var deleteButtons = document.querySelectorAll(".delete-button");

editButtons.forEach(function (button) {
  var userId = button.dataset.userId;
  button.addEventListener("click", function () {
    editCustomer(userId);
  });
});

deleteButtons.forEach(function (button) {
  var userId = button.dataset.userId;
  button.addEventListener("click", function () {
    deleteCustomer(userId);
  });
});

