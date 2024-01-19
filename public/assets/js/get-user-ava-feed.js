const userLogin = localStorage.getItem('loginIdentifier');
var avatarUser = document.getElementById("feedAva");
var nameUser = document.getElementById("feedName");


function getIfUser() {
    fetch(`/api/v1/user/getuser/${userLogin}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                var inforUser = data.data;
                console.log(inforUser);
                avatarUser.src = inforUser.UrlImg;
                nameUser.innerText = inforUser.name;
            } else {
                // Hiển thị thông báo lỗi nếu không tìm thấy người dùng
                console.log("Không tìm thấy bệnh nhân")
            }
        })
        .catch(error => {
            // Xử lý lỗi khi gọi API
            console.error('Lỗi khi gọi API getUser:', error);
        });
}

getIfUser();