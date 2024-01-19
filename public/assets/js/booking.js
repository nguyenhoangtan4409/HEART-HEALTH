var nameUser = document.getElementById("nameUser");
var phoneUser = document.getElementById("phoneUser");
var mailUser = document.getElementById("mailUser");
var dateSche = document.getElementById("dateSche");
var timeSche = document.getElementById("timeSche");
var noidung = document.getElementById("noidung");

var selectDoctor = document.getElementById('nameDoctor');

const userLogin = localStorage.getItem('loginIdentifier');
var genderPatient;
var imgPatient;
var email;

document.addEventListener('DOMContentLoaded', () => {
    getIfUser();
    getIfDoctor();
});

function getIfUser() {
    fetch(`/api/v1/user/getuser/${userLogin}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                var inforUser = data.data;
                nameUser.value = inforUser.name;
                phoneUser.value = inforUser.phoneNumber;
                mailUser.value = inforUser.email;
                genderPatient = inforUser.gender;
                imgPatient = inforUser.UrlImg;
                email = inforUser.email;
            } else {
                // Hiển thị thông báo lỗi nếu không tìm thấy người dùng
                console.log("Không tìm thấy người dùng")
            }
        })
        .catch(error => {
            // Xử lý lỗi khi gọi API
            console.error('Lỗi khi gọi API getUser:', error);
        });
}

function getIfDoctor() {
    fetch(`/api/v1/admin/`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                var doctors = data.data


                doctors.forEach(doctor => {
                    var newOption = document.createElement('option');
                    newOption.value = doctor.username; // Giả sử _id là giá trị duy nhất để xác định bác sĩ
                    newOption.text = doctor.name; // Sử dụng tên hoặc username nếu tên trống
                    selectDoctor.appendChild(newOption);
                })

            } else {
                // Hiển thị thông báo lỗi nếu không tìm thấy người dùng
                console.log("Không tìm thấy bác sĩ")
            }
        })
        .catch(error => {
            // Xử lý lỗi khi gọi API
            console.error('Lỗi khi gọi API: ', error);
        });
}

function formatDate(inputDate) {
    const dateArray = inputDate.split('-');
    const formattedDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
    return formattedDate;
}

function sendRequestSche() {

    const newSchedule = {
        nameDoctor: selectDoctor.options[selectDoctor.selectedIndex].value,
        idPatient: userLogin,
        namePatient: nameUser.value,
        genderPatient: genderPatient,
        imgPatient: imgPatient,
        email: email,
        date: formatDate(dateSche.value),
        time: timeSche.options[timeSche.selectedIndex].value,
        content: noidung.value,
        // Thêm các trường khác nếu cần
    };

    fetch('/api/v1/schedule/createsche', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSchedule)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Gửi yêu cầu thành công",
                    timer: 1200,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then((result) => {
                    location.reload();
                });
                console.log("create sche success");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Gửi yêu cầu thất bại"
                });
                console.log(data.message);
            }
        })
        .catch(error => {
            console.error('Lỗi khi gọi API:', error);
        });
    return false;
}






