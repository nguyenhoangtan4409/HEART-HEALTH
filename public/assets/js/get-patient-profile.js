document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    getInforPatient(username)
});

function getInforPatient(username) {
    var fullname = document.getElementById("HoTen");
    var dayOfBirth = document.getElementById("NgaySinh");
    var address = document.getElementById("DiaChi");
    var phoneNumber = document.getElementById('SoDienThoai');
    var email = document.getElementById('Email');
    var Img = document.getElementById('profileImage');

    var TieuSuBenh = document.getElementById('TieuSuBenh');
    fetch(`/api/v1/user/getuser/${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fullname.textContent = data.data.name || ''; 
                dayOfBirth.textContent = data.data.dayOfBirth || '';
                address.textContent = data.data.address || '';
                phoneNumber.textContent = data.data.phoneNumber || '';
                email.textContent = data.data.email || '';
                TieuSuBenh.textContent = data.data.anamnesis || '';
                Img.src = data.data.UrlImg || ''
            } else {
                console.error('Không thể lấy thông tin người dùng');
            }
        })
        .catch(error => {
            console.error('Lỗi khi gọi API getUser:', error);
        });
}