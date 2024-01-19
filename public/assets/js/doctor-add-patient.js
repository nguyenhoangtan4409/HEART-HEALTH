let isHandlingImageUpload = false;
let imageData = null;
let imageUrl = "";

function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^(?:(?:\+|0{0,2})84|0)[1-9]\d{8,9}$/;
    return phoneRegex.test(phoneNumber);
}

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

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

document.addEventListener('DOMContentLoaded', function () {
    // Gán sự kiện cho nút "Tải hình lên"
    document.querySelector('#inputImage').addEventListener('change', function (event) {
        handleImageUpload(event);
    });
    // Lắng nghe sự kiện input trong ô mật khẩu
    document.getElementById('pass').addEventListener('input', checkPasswordMatch);

    // Lắng nghe sự kiện input trong ô xác nhận mật khẩu
    document.getElementById('rpass').addEventListener('input', checkPasswordMatch);
    let password;
    let confirmPassword;
    function checkPasswordMatch() {
        // Lấy giá trị của mật khẩu và xác nhận mật khẩu
        password = document.getElementById('pass').value;
        confirmPassword = document.getElementById('rpass').value;
    }
    // Gán sự kiện cho nút "submit"
    document.querySelector('#submit').addEventListener('click', function (event) {
        event.preventDefault(); // Ngăn chặn reload trang mặc định

        if (!imageData) {
            Swal.fire({
                icon: "error",
                title: "Img không hợp lệ",
                text: "Vui lòng chọn ảnh đại diện"
            });
        } else if (document.getElementById('fname').value == '' || document.getElementById('lname').value == '') {
            Swal.fire({
                icon: "error",
                title: "Tên không hợp lệ",
                text: "Vui lòng điền đầy đủ họ và tên"
            });
        } else if (document.getElementById('city').value == "" || document.getElementById('district').value == "" || document.getElementById('ward').value == "" || document.getElementById('add1').value == "") {
            Swal.fire({
                icon: "error",
                title: "Địa chỉ không hợp lệ",
                text: "Vui lòng điền đầy đủ địa chỉ"
            });
        } else if (document.getElementById('mobno').value == "" || document.getElementById('email').value == "") {
            Swal.fire({
                icon: "error",
                title: "Số điện thoại không hợp lệ",
                text: "Vui lòng điền số điện thoại và email"
            });
        }
        else if (!isValidPhoneNumber(document.getElementById('mobno').value)) {
            console.log(document.getElementById('mobno').value);
            Swal.fire({
                icon: "error",
                title: "Số điện thoại không hợp lệ",
                text: "Vui lòng nhập số điện thoại hợp lệ."
            });
            // return false;
        }

        // Kiểm tra email hợp lệ
        else if (!isValidEmail(document.getElementById('email').value)) {
            console.log(email.value);
            Swal.fire({
                icon: "error",
                title: "Email không hợp lệ",
                text: "Vui lòng nhập email hợp lệ."
            });
            // return false;
        } else if (document.getElementById('uname').value == "") {
            Swal.fire({
                icon: "error",
                title: "Username không hợp lệ",
                text: "Vui lòng điền username của bạn"
            });
        } else if (document.getElementById('pass').value == '') {
            Swal.fire({
                icon: "error",
                title: "Mật khẩu không hợp lệ",
                text: "Vui lòng điền password của bạn."
            });
        } else if (document.getElementById('idDevice').value == '') {
            Swal.fire({
                icon: "error",
                title: "Mật khẩu không hợp lệ",
                text: "Vui lòng điền idDevice của bạn"
            })
        } else if (password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Mật khẩu không hợp lệ",
                text: "Mật khẩu và xác nhận mật khẩu không khớp."
            })
        }
        else {
            fetch(`/api/v1/user/getuser/${document.getElementById('uname').value}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Username đã tồn tại, vui lòng sử dụng username khác');
                    } else {
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
                                    createUser();
                                } else {
                                    console.error('Upload image failed:', data.error);
                                    // Có thể thêm xử lý tùy thuộc vào việc bạn muốn
                                    // nếu có lỗi trong quá trình xử lý hình ảnh
                                }
                            })
                            .catch(error => {
                                console.error('Error calling upload API:', error);
                                // Có thể thêm xử lý tùy thuộc vào việc bạn muốn
                                // nếu có lỗi trong quá trình gửi yêu cầu fetch
                            })
                            .finally(() => {
                                isHandlingImageUpload = false;
                                imageData = null;

                                // Reload trang sau khi hoàn tất xử lý
                                // location.reload(); // hoặc window.location.reload();
                            });
                    }
                })
        }
    });

    document.querySelector('#huy').addEventListener('click', function () {
        location.reload();
    });
});

function createUser() {
    // Lấy giá trị từ các trường và gửi yêu cầu fetch để cập nhật thông tin người dùng
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    const wardSelect = document.getElementById('ward');
    const add1Input = document.getElementById('add1');

    const selectedCity = citySelect.options[citySelect.selectedIndex].text;
    const selectedDistrict = districtSelect.options[districtSelect.selectedIndex].text;
    const selectedWard = wardSelect.options[wardSelect.selectedIndex].text;

    const address = selectedCity + " " + selectedDistrict + " " + selectedWard + " " + add1Input.value;

    let gender;
    const genderRadioNam = document.getElementById('customRadio6');
    const genderRadioNu = document.getElementById('customRadio7');

    // Kiểm tra xem nút radio "Nam" hay "Nữ" được chọn
    if (genderRadioNam.checked) {
        gender = "Nam";
    } else if (genderRadioNu.checked) {
        gender = "Nữ";
    }
    const createUser = {
        zalo: document.getElementById('zurl').value,
        name: document.getElementById('fname').value + " " + document.getElementById('lname').value,
        dayOfBirth: document.getElementById('birthday').value,
        gender: gender,
        address: address,
        nationality: document.getElementById('country').value,
        carrier: document.getElementById('career').value,
        phoneNumber: document.getElementById('mobno').value,
        email: document.getElementById('email').value,
        anamnesis: document.getElementById('History').value,
        username: document.getElementById('uname').value,
        pass: document.getElementById('pass').value,
        role: document.getElementById('role').value,
        UrlImg: imageUrl,
        idDevice: document.getElementById('idDevice').value
    };

    console.log(createUser); // Log để kiểm tra giá trị
    fetch(`/api/v1/user/createuser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(createUser),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Thêm bệnh nhân thành công.",
                    timer: 1200,
                    timerProgressBar: true,
                    showConfirmButton: false
                });

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Thêm bệnh nhân thất bại."
                });
            }
        })
        .catch(error => {
            console.error('Lỗi khi gọi API updateUser:', error);
        });
}
window.handleImageUpload = handleImageUpload;

