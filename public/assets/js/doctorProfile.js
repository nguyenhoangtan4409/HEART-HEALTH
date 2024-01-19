var nameDoctor = document.getElementById("nameDoctor");
var cityCountry = document.getElementById("cityCountry");
var hospital = document.getElementById("hospital");
var dayOfBirth = document.getElementById("dayOfBirth");
var phoneNumber = document.getElementById("phoneNumber");
var emailDoctor = document.getElementById("emailDoctor");
var avatarDoctor = document.getElementById("avatarDoctor");

const userLogin = localStorage.getItem('loginIdentifier');

var avatarDoctor2 = document.getElementById("avatarDoctor2");
var nameDoctor2 = document.getElementById("nameDoctor2");
getIfDoctor();

function getIfDoctor() {
    fetch(`/api/v1/admin/getadmin/${userLogin}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                var inforDoctor = data.data;
                console.log(inforDoctor);
                nameDoctor.innerText = inforDoctor.name;
                cityCountry.innerText = inforDoctor.city + " " + inforDoctor.country;
                hospital.innerText = inforDoctor.hospital;
                dayOfBirth.innerText = inforDoctor.dayOfBirth;
                phoneNumber.innerText = inforDoctor.phoneNumber;
                emailDoctor.innerText = inforDoctor.email;
                avatarDoctor.src = inforDoctor.urlAvatar;
                avatarDoctor2.src = inforDoctor.urlAvatar;
                nameDoctor2.innerText = inforDoctor.name;
            } else {
                // Hiển thị thông báo lỗi nếu không tìm thấy người dùng
                console.log("Không tìm thấy bác sĩ")
            }
        })
        .catch(error => {
            // Xử lý lỗi khi gọi API
            console.error('Lỗi khi gọi API getUser:', error);
        });
}


