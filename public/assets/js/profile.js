let isHandlingImageUpload = false;
let imageData = null;
let imageUrl = "";

function handleImageUpload(event) {
    const inputImage = event.target;
    const file = inputImage.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imageData = e.target.result;
            document.getElementById('profileImage').src = imageData; 
        };

        reader.readAsDataURL(file);
    } 
}

document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra xem có giá trị loginIdentifier trong localStorage không
    const storedLoginIdentifier = localStorage.getItem('loginIdentifier');
    if (storedLoginIdentifier) {
        // Lấy thông tin người dùng khi trang được tải
        fetchUserInfo(storedLoginIdentifier)
        .then(() => {
            console.log("storedLoginIdentifier: " + storedLoginIdentifier);
            // Gán sự kiện cho nút "Tải hình lên"
            document.querySelector('#inputImage').addEventListener('change', function(event) {
                handleImageUpload(event);
            });
            // Lắng nghe sự kiện input trong ô mật khẩu
            document.getElementById('inputPassword').addEventListener('input', checkPasswordMatch);

            // Lắng nghe sự kiện input trong ô xác nhận mật khẩu
            document.getElementById('inputConfirmPassword').addEventListener('input', checkPasswordMatch);
            let password;
            let confirmPassword;
            function checkPasswordMatch() {
                // Lấy giá trị của mật khẩu và xác nhận mật khẩu
                password = document.getElementById('inputPassword').value;
                confirmPassword = document.getElementById('inputConfirmPassword').value;
            }
            // Gán sự kiện cho nút "Save changes"
            document.querySelector('#saveChangesBtn').addEventListener('click', function() {
                if (imageData) {
                    // Nếu có dữ liệu hình ảnh, thì mới gửi lên máy chủ
                    isHandlingImageUpload = true;
        
                    fetch('/api/upload', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ imageData }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Server response:', data);
                        if (data.success) {
                            imageUrl = data.imageUrl;
                            console.log('Image uploaded to Imgbb:', imageUrl);
                            saveChanges(storedLoginIdentifier);
                            // Cập nhật hoặc sử dụng imageUrl theo cách bạn muốn
                        } else {
                            console.error('Upload image failed:', data.error);
                        }
                    })
                    .catch(error => {
                        console.error('Error calling upload API:', error);
                    })
                    .finally(() => {
                        isHandlingImageUpload = false;
                        imageData = null;
                    });
                }
                // Kiểm tra xem mật khẩu và xác nhận mật khẩu có giống nhau hay không
                else if (password !== confirmPassword) {
                    alert('Mật khẩu và xác nhận mật khẩu không khớp.');
                }
                else
                    saveChanges(storedLoginIdentifier);
            });
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
        });

    } else {
        console.log("Không có giá trị Login Identifier trong localStorage");
    }
});

function fetchUserInfo(loginIdentifier) {
    return new Promise((resolve, reject) => {
    // Thay thế '0918582160' bằng số điện thoại hoặc '...@gmail.com' bằng địa chỉ email
    fetch(`/api/v1/user/getuser/${loginIdentifier}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Điền thông tin người dùng vào các trường
                document.getElementById('inputFirstName').value = data.data.name || '';
                document.getElementById('inputLocation').value = data.data.address || '';
                document.getElementById('inputEmailAddress').value = data.data.email || '';
                document.getElementById('inputPhone').value = data.data.phoneNumber || '';
                document.getElementById('inputBirthday').value = data.data.dayOfBirth || '';
                document.getElementById('inputPassword').value = data.data.pass || '';
                document.getElementById('profileImage').src = data.data.UrlImg || '';
                document.getElementById('IdDevice').innerHTML = data.data.idDevice || '';
                imageUrl = data.data.UrlImg;
                resolve();
            } else {
                console.error('Không thể lấy thông tin người dùng');
            }
            console.log("get user info: " + JSON.stringify(data))
        })
        .catch(error => {
            console.error('Lỗi khi gọi API getUser:', error);
            reject(error);
        });
    });
}

function saveChanges(loginIdentifier) {
    // Lấy giá trị từ các trường và gửi yêu cầu fetch để cập nhật thông tin người dùng
    const updatedUserInfo = {
        name: document.getElementById('inputFirstName').value,
        address: document.getElementById('inputLocation').value,
        email: document.getElementById('inputEmailAddress').value,
        phoneNumber: document.getElementById('inputPhone').value,
        dayOfBirth: document.getElementById('inputBirthday').value,
        pass: document.getElementById('inputPassword').value,
        UrlImg: imageUrl,
    };
    
    console.log(updatedUserInfo); // Log để kiểm tra giá trị
    fetch(`/api/v1/user/updateuser/${loginIdentifier}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserInfo),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: "success",
                title: "Cập nhật thông tin thành công.",
                timer: 1200,
                timerProgressBar: true,
                showConfirmButton: false
            }).then((result) => {
                // Cập nhật lại thông tin người dùng trên trang nếu cần
                fetchUserInfo(loginIdentifier);
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Cập nhật thông tin thất bại."
            });
        }
    })
    .catch(error => {
        console.error('Lỗi khi gọi API updateUser:', error);
    });
}
window.handleImageUpload = handleImageUpload;

