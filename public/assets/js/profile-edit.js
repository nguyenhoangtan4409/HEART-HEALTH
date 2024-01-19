// Lấy các đối tượng input theo ID
var fullname = document.getElementById("fname");
var hospital = document.getElementById("oname");
var city = document.getElementById("cname");
var dayOfBirth = document.getElementById("dob");
var country = document.getElementById("exampleFormControlSelect3");
var address = document.getElementById("address");
var genderMale = document.getElementsByName('customRadio6');
var genderFemale = document.getElementsByName('customRadio7');
var avatar = document.getElementById("avatarProfile");


// const userLogin = localStorage.getItem('loginIdentifier');

var numberPhone = document.getElementById("cno");
var email = document.getElementById("email");

function getInforInit() {
    fetch(`/api/v1/admin/getadmin/${userLogin}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Điền thông tin người dùng vào các trường
                fullname.value = data.data.name || '';
                hospital.value = data.data.hospital || '';
                city.value = data.data.city || '';
                dayOfBirth.value = data.data.dayOfBirth || '';
                country.value = data.data.country || '';
                address.value = data.data.address || '';


                numberPhone.value = data.data.phoneNumber || '';
                email.value = data.data.email || '';

                genderMale.value = data.data.male || false;
                genderFemale.value = data.data.female;

                avatar.src = data.data.urlAvatar;
            } else {
                console.error('Không thể lấy thông tin người dùng');
            }
        })
        .catch(error => {
            console.error('Lỗi khi gọi API getUser:', error);
        });
}

function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^(?:(?:\+|0{0,2})84|0)[1-9]\d{8,9}$/;
    return phoneRegex.test(phoneNumber);
}

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

function updateContact() {

    // Get the selected radio button value

    // Kiểm tra số điện thoại hợp lệ
    if (!isValidPhoneNumber(numberPhone.value)) {
        console.log(numberPhone.value);
        Swal.fire({
            icon: "error",
            title: "Số điện thoại không hợp lệ",
            text: "Vui lòng nhập số điện thoại hợp lệ."
        });
        return false;
    }

    // Kiểm tra email hợp lệ
    else if (!isValidEmail(email.value)) {
        console.log(email.value); 
        Swal.fire({
            icon: "error",
            title: "Email không hợp lệ",
            text: "Vui lòng nhập email hợp lệ."
        });
        return false;
    }
    else {
        console.log(numberPhone.value);
        console.log(email.value); 
        const updatedContact = {
            phoneNumber: numberPhone.value,
            email: email.value,
        };

        // Hoặc có thể gửi dữ liệu lên server thông qua Ajax, tùy thuộc vào yêu cầu của bạn
        // Ví dụ sử dụng fetch:
        fetch(`/api/v1/admin/updateadmin/${userLogin}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedContact),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Cập nhật Liên hệ thành công.",
                        timer: 1200,
                        timerProgressBar: true,
                        showConfirmButton: false
                    }).then((result) => {
                        // Cập nhật lại thông tin người dùng trên trang nếu cần
                        console.log(data.data)
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Cập nhật Liên hệ thất bại."
                    });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        return false;
    }
}
function updateInfo() {
    // Get the selected radio button value


    const updatedAdminInfo = {
        name: fullname.value,
        hospital: hospital.value,
        city: city.value,
        dayOfBirth: dayOfBirth.value,
        country: country.value,
        address: address.value,
        male: genderMale.value,
        female: genderFemale.value,
        // Thêm các trường khác nếu cần
    };

    console.log("Nam", genderMale.value)
    console.log("Nu", genderFemale.value)

    // Hoặc có thể gửi dữ liệu lên server thông qua Ajax, tùy thuộc vào yêu cầu của bạn
    // Ví dụ sử dụng fetch:
    fetch(`/api/v1/admin/updateadmin/${userLogin}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAdminInfo),
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
                    console.log(data.data)
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Cập nhật thông tin thất bại."
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    return false;
}

function changePass() {
    var incpass = document.getElementById("cpass");
    var npass = document.getElementById("npass");
    var vpass = document.getElementById("vpass");

    var INcpass = incpass.value;

    fetch(`/api/v1/admin/getadmin/${userLogin}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                var DBcpass = data.data.pass;

                if (DBcpass != INcpass) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Mật khẩu hiện tại chưa đúng"
                    }).then((result) => {
                        // Cập nhật lại thông tin người dùng trên trang nếu cần
                        console.log("in", incpass.value, typeof incpass.value)
                        console.log("DB", DBcpass, typeof DBcpass)
                    });
                }
                else if (npass.value != vpass.value) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Nhập lại mật khẩu chưa đúng"
                    }).then((result) => {
                        // Cập nhật lại thông tin người dùng trên trang nếu cần
                        console.log(npass.value)
                    });
                }
                else {
                    const changeAdminPass = {
                        pass: npass.value,
                    };

                    fetch(`/api/v1/admin/updateadmin/${userLogin}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(changeAdminPass),
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                Swal.fire({
                                    icon: "success",
                                    title: "Cập nhật mật khẩu thành công.",
                                    timer: 1200,
                                    timerProgressBar: true,
                                    showConfirmButton: false
                                }).then((result) => {
                                    // Cập nhật lại thông tin người dùng trên trang nếu cần
                                    console.log(data.data)
                                });
                            } else {
                                Swal.fire({
                                    icon: "error",
                                    title: "Oops...",
                                    text: "Cập nhật mật khẩu thất bại."
                                });
                            }
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }
            } else {
                console.error('Không thể lấy thông tin người dùng');
            }
        })
        .catch(error => {
            console.error('Lỗi khi gọi API getUser:', error);
        });
}






getInforInit();