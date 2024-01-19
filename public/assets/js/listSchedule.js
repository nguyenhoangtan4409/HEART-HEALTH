function displayListSche(schedules) {
    const tableBody = document.querySelector('#user-list-table tbody');
    // Xóa toàn bộ nội dung trong tbody trước khi cập nhật
    tableBody.innerHTML = '';

    // Lặp qua mỗi người dùng từ dữ liệu nhận được
    schedules.forEach(schedule => {
        // Tạo một dòng mới
        const newRow = document.createElement('tr');

        // Tạo các ô dữ liệu
        const cells = [
            `<td class="text-center">
                <a href="../app/patient-profile.html?username=${schedule.idPatient}">
                    <img class="rounded img-fluid avatar-40" src="${schedule.imgPatient}" alt="profile">
                </a>
            </td>`,
            `<td>
                <a href="../app/patient-profile.html?username=${schedule.idPatient}" style="color: black">
                    ${schedule.namePatient}
                </a>
            </td>`,
            `<td>${schedule.genderPatient}</td>`,
            `<td>${schedule.date}</td>`,
            `<td>${schedule.time}</td>`,
            `<td>${schedule.content}</td>`,
            `<td>
                <span class="badge ${schedule.status === 1 ? 'bg-success' : schedule.status === 0 ? 'bg-danger' : 'bg-warning'}">
                    ${schedule.status === 1 ? 'Đã duyệt' : schedule.status === 0 ? 'Đã hủy' : 'Chờ duyệt'}
                </span>
            </td>`,
            `<td>
                <div class="flex align-items-center list-user-action">
                    <a class="btn btn-sm bg-success infor-button" data-toggle="tooltip" data-placement="top" title="Duyệt" data-original-title="Duyệt" href="#" onclick="updateStatus(1, '${schedule._id}');"><i class="fa fa-check mr-0"></i></a>
                    <a class="btn btn-sm bg-primary edit-button" data-toggle="tooltip" data-placement="top" title="Hủy" data-original-title="Hủy" href="#"  onclick="updateStatus(0, '${schedule._id}');"><i class="fa fa-times mr-0"></i></a>
                    <a class="btn btn-sm bg-danger" data-toggle="tooltip" data-placement="top" title="Xóa" data-original-title="Xóa" href="#" onclick="deleteShedule('${schedule._id}');"><i class="fa fa-trash mr-0"></i></a>
                </div>
            </td>`
        ];

        // Chèn ô dữ liệu vào dòng mới
        newRow.innerHTML = cells.join('');

        // Chèn dòng mới vào bảng
        tableBody.appendChild(newRow);
    });
}

function sendEmailRequest(schedule, status) {
    fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schedule, status }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Email sent successfully');
        } else {
            console.error('Failed to send email');
        }
    })
    .catch(error => {
        console.error('Error sending email:', error);
    });
}

function updateStatus(status, schedule) {
    const updatedScheInfor = {
        status: status
    };
    var strStatus;
    if (status == 0) {
        strStatus = "Hủy thành công"
    } else {
        strStatus = "Duyệt thành công"
    }
    // Ví dụ sử dụng fetch:
    fetch(`/api/v1/schedule/updatebyadmin/${schedule}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedScheInfor),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: strStatus,
                    timer: 1200,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then((result) => {
                    // Cập nhật lại thông tin người dùng trên trang nếu cần
                    getAllSche();
                    console.log(data.data);
                    sendEmailRequest(data.data, status);
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Cập nhật không thành công"
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const inputSearch = document.getElementById('exampleInputSearch');
// Lắng nghe sự kiện khi người dùng nhập vào ô tìm kiếm
inputSearch.addEventListener('input', searchSche);

function searchSche() {

    let allUsers;  // Lưu trữ toàn bộ dữ liệu người dùng

    // Gửi yêu cầu đến API và cập nhật bảng
    fetch(`/api/v1/schedule/getalladmin/${userLogin}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Lưu trữ toàn bộ dữ liệu người dùng
                allUsers = data.data;

                const searchTerm = inputSearch.value.toLowerCase();

                // Lọc người dùng dựa trên từ khóa tìm kiếm
                const filteredUsers = allUsers.filter(user =>
                    user.namePatient.toLowerCase().includes(searchTerm)
                );

                // Hiển thị danh sách người dùng đã lọc
                displayListSche(filteredUsers);
            } else {
                console.error('Lỗi khi nhận dữ liệu từ API:', data.message);
            }
        })
        .catch(error => {
            console.error('Lỗi khi gọi API:', error);
        });
};

const getAllSche = async () => {
    fetch(`/api/v1/schedule/getalladmin/${userLogin}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Hiển thị tất cả người dùng khi trang web được tải
                displayListSche(data.data);
            } else {
                console.error('Lỗi khi nhận dữ liệu từ API:', data.message);
            }
        })
        .catch(error => {
            console.error('Lỗi khi gọi API:', error);
        });
};
document.addEventListener('DOMContentLoaded', () => {
    getAllSche();
});

function deleteShedule(idSche) {
    Swal.fire({
        title: "Bạn muốn xóa lịch hẹn này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa",
        cancelButtonText: "Không xóa"
    })
        .then((result) => {
            if (result.isConfirmed) {
                fetch(`/api/v1/schedule/deleteschedule/${idSche}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                        // Các header khác nếu cần
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Xóa thành công, cập nhật lại bảng
                            Swal.fire({
                                title: "Xóa thánh công",
                                icon: "success"
                            });
                            getAllSche();
                        } else {
                            // Hiển thị thông báo lỗi nếu xóa không thành công
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Xóa không thành công"
                            });
                            console.error('Lỗi khi xóa người dùng:', data.message);
                        }
                    })
                    .catch(error => {
                        // Xử lý lỗi khi gọi API
                        console.error('Lỗi khi gọi API xóa người dùng:', error);
                    });
            }
        });
}