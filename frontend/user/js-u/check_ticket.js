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

var alert_mess = document.getElementById("alert");
var close_btn = document.getElementById("close-btn");

for (const btn of document.querySelectorAll(".del-btn")) {
  // When the user clicks the button, open the modal
  btn.onclick = function () {
    alert_mess.style.display = "block";
  }
}

// When the user clicks anywhere outside of the modal hoặc nút không, close it
window.onclick = function (event) {
  if (event.target == alert_mess || event.target == close_btn) {
    alert_mess.style.display = "none";
  }
}

// var table1 = document.getElementById("table-data1");
// var table2 = document.getElementById("table-data2");
// var table3 = document.getElementById("table-data3");
// var filter1 = document.getElementById("filter1");
// var filter2 = document.getElementById("filter2");
// var filter3 = document.getElementById("filter3");






async function check_ticket() {
  const tableUser1 = document.getElementById('user_table');
  const id = localStorage.getItem('customerID');

  // Gửi yêu cầu GET đến máy chủ FastAPI thông qua Fetch API
  const response = await fetch(`http://127.0.0.1:8000/vehientai/me/` + id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseData = await response.json();
  const data_ticket = responseData.data_ticket;

  tableUser1.style.display = 'block';

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Tạo hàng tiêu đề
  const headerRow = document.createElement('tr');
  const headers = ['Mã chuyến đi', 'Số ghế đặt', 'Giờ đi', 'Giờ đến','Mã lộ trình', 'Mã vé', 'Số vé đã đặt', 'Mã khách hàng', 'Mã thanh toán', 'Trạng thái', 'Tổng tiền', ''];

  for (let i = 0; i < headers.length; i++) {
    const headerCell = document.createElement('th');
    headerCell.textContent = headers[i];
    headerRow.appendChild(headerCell);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Tạo các hàng chứa dữ liệu ticket
  for (let i = 0; i < data_ticket.length; i++) {
    const ticket = data_ticket[i];
    const ticketRow = document.createElement('tr');

    const properties = ['tripId', 'slot', 'time1', 'time2', 'routerId', 'ticketId', 'amount', 'userId', 'payId', 'status', 'bill'];

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Hủy';

    cancelButton.addEventListener('click', () => {
      huy(ticket.tripId, ticket.slot, ticket.ticketId, ticket.amount, ticket.time1, ticket.payId);
    });

    for (let j = 0; j < properties.length; j++) {
      const cell = document.createElement('td');
      cell.textContent = ticket[properties[j]];

      ticketRow.appendChild(cell);

    }
    
    ticketRow.appendChild(cancelButton);
    tbody.appendChild(ticketRow);
  }

  table.appendChild(tbody);
  tableUser1.appendChild(table);
}

document.addEventListener("DOMContentLoaded", function() {
  check_ticket();
});

async function huy(maChuyenDi, soGheDat, maVe, soLuong, gioDi, maThanhToan) {
  var currentDateTime = new Date();
  var gioDiDate = new Date(gioDi); // Chuyển đổi gioDi thành đối tượng Date
  currentDateTime.setDate(currentDateTime.getDate() + 1)
  if (gioDiDate <= currentDateTime) {
    Swal.fire({
      text: "Không thể hủy chuyến",
      // icon: "fail",
    }).then(() => {
      location.reload();
    });
  } else {
    const response = await fetch('http://127.0.0.1:8000/huy_ve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'maChuyenDi': maChuyenDi,
        'soGheDat': soGheDat,
        'maVe': maVe,
        'soLuong': soLuong,
        'maThanhToan': maThanhToan
      })
    });
    
    const responseData = await response.json();
    const message = responseData.message;
    Swal.fire({
      text: message,
      icon: "success",
    }).then(() => {
      location.reload();
    });
    // location.reload();
  }
}

function logout() {
  localStorage.removeItem('customerID');
}

