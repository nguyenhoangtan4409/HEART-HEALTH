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
