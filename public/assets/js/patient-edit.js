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
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    fetchUserInfo(username)
    .then(()=> {
        // Gán sự kiện cho nút "Tải hình lên"
        document.querySelector('#inputImage').addEventListener('change', function(event) {
            handleImageUpload(event);
        });
        // Lắng nghe sự kiện input trong ô mật khẩu
        document.getElementById('pass').addEventListener('input', checkPasswordMatch);

        // Lắng nghe sự kiện input trong ô xác nhận mật khẩu
        document.getElementById('rpass').addEventListener('input', checkPasswordMatch);

        // Lắng nghe sự kiện input trong ô username
        document.getElementById('uname').addEventListener('input', checkUserName);

        let password;
        let confirmPassword;
        function checkPasswordMatch() {
            // Lấy giá trị của mật khẩu và xác nhận mật khẩu
            password = document.getElementById('pass').value;
            confirmPassword = document.getElementById('rpass').value;
        }
        let isUsername = false;
        function checkUserName() {
            // Lấy giá trị của mật khẩu và xác nhận mật khẩu
            const rusername = document.getElementById('pass').value;
            if(rusername != username)
                isUsername = true;
        }
        // Gán sự kiện cho nút "submit"
        document.querySelector('#save').addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn reload trang mặc định
            if (imageUrl == null) {
                alert('Vui lòng chọn ảnh đại diện');
            } 
            else if (password !== confirmPassword) {
                alert('Mật khẩu và xác nhận mật khẩu không khớp.');
            } 
            else if(isUsername){
                fetch(`/api/v1/user/getuser/${document.getElementById('uname').value}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert('Username đã tồn tại, vui lòng sử dụng username khác');
                        } else if(imageData){
                            username = document.getElementById('uname').value;
                            fetch('/api/upload', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ imageData }),
                                })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        imageUrl = data.imageUrl;
                                        updateUser(username);
                                    } else {
                                        console.error('Upload image failed:', data.error);
                                    }
                                })
                                .catch(error => {
                                    console.error('Error calling upload API:', error);
                                })
                        }
                        else {
                            updateUser(document.getElementById('uname').value);
                        }

                    })
                
            }
            else {
                updateUser(document.getElementById('uname').value);
            }
        });
        
        document.querySelector('#huy').addEventListener('click', function() {
            location.reload(); 
        });
    })
    .catch(error => {
        console.error('Error fetching user info:', error);
    });
});
function fetchUserInfo(loginIdentifier) {
    return new Promise((resolve, reject) => {
    
    fetch(`/api/v1/user/getuser/${loginIdentifier}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Điền thông tin người dùng vào các trường
                document.getElementById('zurl').value = data.data.zalo || '';
                const fullName = data.data.name || '';
                const nameParts = fullName.split(' ');

                // Lấy last name (nếu có)
                const lastName = nameParts.length > 1 ? nameParts.pop() : '';

                // Lấy first name từ phần còn lại
                const firstName = nameParts.join(' ');

                document.getElementById('lname').value = lastName;
                document.getElementById('fname').value = firstName;
                document.getElementById('birthday').value = data.data.dayOfBirth || '';
                //gender
                const genderValue = data.data.gender;
                const maleRadio = document.getElementById('customRadio6');
                const femaleRadio = document.getElementById('customRadio7');

                // Kiểm tra giá trị giới tính và thiết lập thuộc tính 'checked' tương ứng
                if (genderValue === 'Nam') {
                    maleRadio.checked = true;
                } else if (genderValue === 'Nữ') {
                    femaleRadio.checked = true;
                }
                document.getElementById('country').value = data.data.nationality || '';
                document.getElementById('career').value = data.data.carrier || '';
                document.getElementById('mobno').value = data.data.phoneNumber || '';
                document.getElementById('email').value = data.data.email || '';
                document.getElementById('History').value = data.data.anamnesis || '';
                document.getElementById('uname').value = data.data.username || '';
                // document.getElementById('pass').value = data.data.pass || '';
                document.getElementById('profileImage').src = data.data.UrlImg || '';
                document.getElementById('role').value = data.data.role || '';
                document.getElementById('idDevice').value = data.data.idDevice || '';
                imageUrl = data.data.UrlImg;
                resolve();
            } else {
                console.error('Không thể lấy thông tin người dùng');
            }
        })
        .catch(error => {
            console.error('Lỗi khi gọi API getUser:', error);
            reject(error);
        });
    });
}
function updateUser(username) {
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
    const updateUser = {
        zalo: document.getElementById('zurl').value,
        name: document.getElementById('fname').value + " "+document.getElementById('lname').value,
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
        role:document.getElementById('role').value,
        idDevice:document.getElementById('idDevice').value,
        UrlImg: imageUrl,
    };
    
    console.log(updateUser); // Log để kiểm tra giá trị
    fetch(`/api/v1/user/updateuser/${username}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateUser),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: "success",
                title: "Cập nhật thông tin bệnh nhân thành công.",
                timer: 1200,
                timerProgressBar: true,
                showConfirmButton: false
            });
        
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Cập nhật thông tin bệnh nhân thất bại."
            });
        }
    })
    .catch(error => {
        console.error('Lỗi khi gọi API updateUser:', error);
    });
}
window.handleImageUpload = handleImageUpload;

