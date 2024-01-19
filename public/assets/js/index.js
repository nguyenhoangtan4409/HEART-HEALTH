// // to get current year
// function getYear() {
//     var currentDate = new Date();
//     var currentYear = currentDate.getFullYear();
//     document.querySelector("#displayYear").innerHTML = currentYear;
// }

// getYear();


// client section owl carousel
// $(".client_owl-carousel").owlCarousel({
//     loop: true,
//     margin: 0,
//     dots: false,
//     nav: true,
//     navText: [],
//     autoplay: true,
//     autoplayHoverPause: true,
//     navText: [
//         '<i class="fa fa-angle-left" aria-hidden="true"></i>',
//         '<i class="fa fa-angle-right" aria-hidden="true"></i>'
//     ],
//     responsive: {
//         0: {
//             items: 1
//         },
//         600: {
//             items: 1
//         },
//         1000: {
//             items: 2
//         }
//     }
// });

/** google_map js **/
function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(40.712775, -74.005973),
        zoom: 18,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}
document.addEventListener('DOMContentLoaded', function() {
    const storedLoginIdentifier = localStorage.getItem('loginIdentifier');
    fetchDataAndRenderCarousel();
    document.querySelector('#contactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        if (document.getElementById('message').value == '') {
            alert('Vui lòng điền feedback trước khi gửi');
        }
        else {
            fetch (`/api/v1/user/getuser/${storedLoginIdentifier}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Username = data.data.username;
                    Name = data.data.name;
                    UrlImg = data.data.UrlImg;
                    saveChanges(storedLoginIdentifier, Username, Name, UrlImg);
                }
                else
                    console.log("get user error");
            })
            .catch(error => {
                console.error('Lỗi khi gọi API getUser:', error);
            });
        }
    });
    

});

function saveChanges(loginIdentifier, Username, Name, Urlimg) {
    // Lấy giá trị từ các trường và gửi yêu cầu fetch để cập nhật thông tin người dùng
    const currentTime = new Date();
    // Định dạng thời gian
    const formattedTime = currentTime.toISOString();
    const createFeedback = {
        name: Name,
        username: Username,
        content: document.getElementById('message').value,
        time: formattedTime,
        UrlImg: Urlimg,
    };
    
    console.log(createFeedback); 
    fetch(`/api/v1/feedback/create/${Username}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(createFeedback),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: "success",
                title: "Tạo feedback thành công.",
                timer: 1200,
                timerProgressBar: true,
                showConfirmButton: false
            }).then((result) => {
                // Cập nhật lại thông tin người dùng trên trang nếu cần
                fetchDataAndRenderCarousel();
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Tạo feedback thất bại."
            });
        }
    })
    .catch(error => {
        console.error('Lỗi khi gọi API create feedback:', error);
    });
}
function fetchDataAndRenderCarousel() {
    // Gọi API để lấy dữ liệu
    fetch('/api/v1/feedback')
      .then(response => response.json())
      .then(data => {
        // Xử lý dữ liệu từ API và thêm vào carousel
        handleFeedbackData(data);
      })
      .catch(error => {
        console.error('Error fetching feedback data:', error);
      });
}
function handleFeedbackData(data) {
  // Lấy phần tử chứa phản hồi
  const feedbackContainer = document.getElementById('feedbackContainer');

  // Xóa nội dung cũ trong container
  feedbackContainer.innerHTML = '';

  // Lặp qua mỗi phản hồi từ API và thêm vào container
  data.forEach(function (feedback) {
    console.log(data);
    var feedbackItem = `
      <div class="feedback-item">
        <div class="feedback-content">
          <div class="img-box1">
            <img src="${feedback.UrlImg}" alt="" />
          </div>
          <div class="detail-box">
            <div class="name">
              <h6>${feedback.name}</h6>
            </div>
            <p>${feedback.content}</p>
            <i class="fa fa-quote-left" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    `;

    // Thêm feedbackItem vào container
    feedbackContainer.innerHTML += feedbackItem;
  });
}

// Thêm sự kiện click cho liên kết "Đăng xuất"
document.getElementById('loginNavItem').addEventListener('click', function() {
    // Hiển thị thông báo xác nhận sử dụng SweetAlert
    Swal.fire({
        title: 'Bạn có muốn đăng xuất không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            // Nếu người dùng nhấp chấp nhận, chuyển hướng về trang login.html
            window.location.href = '/';
        }
    });
});