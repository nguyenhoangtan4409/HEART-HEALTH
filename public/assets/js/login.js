var username = document.getElementById("username");
var password = document.getElementById("password");
var role = document.getElementById("role");
// var registerUsername = document.getElementById("registerUsername");
// var registerPassword = document.getElementById("registerPassword");
// var registerConfirmPassword = document.getElementById("registerConfirmPassword");

function isEmail(input) {
    // Sử dụng một biểu thức chính quy đơn giản để kiểm tra xem input có dạng email không
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
}

function login() {
    console.log(username.value);
    console.log(password.value);
    const roleCheck = role.checked;
    const loginIdentifier = username.value;

    if (roleCheck) {
        fetch(`/api/v1/user/getuser/${username.value}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (data.data.pass == password.value) {
                        localStorage.setItem('loginIdentifier', loginIdentifier);
                        Swal.fire({
                            icon: "success",
                            title: "Đăng nhập thành công.",
                            timer: 1000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        }).then((result) => {
                            // Cài đặt một cookie
                            document.cookie = "loginSuccess=true; path=/";
                            window.location.href = "/index.html";
                        });
                    }
                    else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Username hoặc mật khẩu không chính xác."
                        });
                    }
                    console.log("Thông tin người dùng:", data.data);
                } else {
                    // Hiển thị thông báo lỗi nếu không tìm thấy người dùng
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Tài khoản không tồn tại."
                    });
                    console.log("Không tìm thấy người dùng")
                }
            })
            .catch(error => {
                // Xử lý lỗi khi gọi API
                console.error('Lỗi khi gọi API getUser:', error);
            });
    } else {
        fetch(`/api/v1/admin/getadmin/${username.value}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.data.pass == password.value) {
                    localStorage.setItem('loginIdentifier', loginIdentifier);
                    Swal.fire({
                        icon: "success",
                        title: "Đăng nhập thành công.",
                        timer: 1000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    }).then((result) => {
                        // Cài đặt một cookie
                        document.cookie = "loginSuccess=true; path=/";
                        // window.location.href = "/app/patient-list.html";
                        window.location.href = "/app/doctor-monitors-patients.html";
                    });
                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Username hoặc mật khẩu không chính xác."
                    });
                    console.log("Failed: ", data.data.pass, "value: ", password.value)
                }
                console.log("Thông tin bác sĩ:", data.data);
            } else {
                // Hiển thị thông báo lỗi nếu không tìm thấy người dùng
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Tài khoản không tồn tại."
                });
                console.log("Không tìm thấy người dùng")
            }
        })
        .catch(error => {
            // Xử lý lỗi khi gọi API
            console.error('Lỗi khi gọi API getUser:', error);
        });
    }
    return false;
}


// function signup() {
//     if (registerConfirmPassword.value !== registerPassword.value) {
//         Swal.fire({
//             icon: "error",
//             title: "Oops...",
//             text: "Phần xác nhận mật khẩu của bạn không khớp"
//         });
//     } else if (registerUsername.value !== "" && registerPassword.value !== "" && registerConfirmPassword.value !== "") {
//         var newUser = {
//             pass: registerPassword.value
//         };

//         if (isEmail(registerUsername.value)) {
//             newUser.email = registerUsername.value;
//         } else {
//             newUser.phoneNumber = registerUsername.value;
//         }

//         fetch('/api/v1/user/createuser', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(newUser)
//         })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success) {
//                     Swal.fire({
//                         icon: "success",
//                         title: "Đăng ký thành công.",
//                         timer: 1200,
//                         timerProgressBar: true,
//                         showConfirmButton: false
//                     }).then((result) => {
//                         location.reload();
//                     });
//                     console.log("Đăng ký thành công");
//                 } else {
//                     Swal.fire({
//                         icon: "error",
//                         title: "Oops...",
//                         text: "Email hoặc số điện thoại đã tồn tại."
//                     });
//                     console.log(data.message);
//                 }
//             })
//             .catch(error => {
//                 console.error('Lỗi khi gọi API createUser:', error);
//             });
//     }
//     return false;
// }