
let isLoggedIn = false;
// Chuyển trang
function showPage(pageId) {
    if (!isLoggedIn && pageId !== "loginPage") {
        alert("Vui lòng đăng nhập trước khi sử dụng các chức năng.");
        return;
    }

    const pages = document.querySelectorAll(".page");
    pages.forEach(page => {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);
    selectedPage.classList.add("active");

    if (pageId === "residentPage") updateRoomData();
}

// --- Bluetooth Wi-Fi Connect --- 
let bluetoothDevice;
let server;
let characteristic;

document.getElementById('scanButton').addEventListener('click', async () => {
    try {
        document.getElementById('status').textContent = 'Scanning for devices...';

        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['00001234-0000-1000-8000-00805f9b34fb']
        });

        console.log('Device found:', device);
        bluetoothDevice = device;
        document.getElementById('status').textContent = `Connecting to ${device.name}...`;

        server = await bluetoothDevice.gatt.connect();
        const service = await server.getPrimaryService('00001234-0000-1000-8000-00805f9b34fb');
        characteristic = await service.getCharacteristic('00005678-0000-1000-8000-00805f9b34fb');

        document.getElementById('wifiForm').style.display = 'block';
    } catch (error) {
        console.error('Bluetooth scan/connect failed', error);
        document.getElementById('status').textContent = 'Failed to scan/connect.';
    }
});

// Gửi Wi-Fi SSID + Password
document.getElementById('wifiForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const ssid = document.getElementById('ssid').value;
    const password = document.getElementById('password').value;

    try {
        const wifiData = `${ssid},${password}`;
        await characteristic.writeValue(new TextEncoder().encode(wifiData));

        document.getElementById('status').textContent = 'Wi-Fi Credentials Sent!';
    } catch (error) {
        console.error('Failed to send Wi-Fi data', error);
        document.getElementById('status').textContent = 'Failed to send Wi-Fi credentials.';
    }
});

// Khi mở web, tự động mở Trang chủ
window.onload = () => {
    showPage('loginPage');
};
// Xử lý đăng nhập giả lập
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Bạn có thể thay đoạn này bằng xác thực Firebase hoặc API
    if (
        (email === "admin@example.com" && password === "123456") ||
        (email === "20161203@student.hcmute.edu.vn" && password === "123456") ||
        (email === "20161204@student.hcmute.edu.vn" && password === "123456")
    ) {
        isLoggedIn = true;
        document.getElementById("loginStatus").style.color = "green";
        document.getElementById("loginStatus").textContent = "Đăng nhập thành công!";
        alert("Chào mừng bạn đã đăng nhập!");

        // Ẩn nút đăng nhập, hiện nút đăng xuất
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("logoutBtn").style.display = "inline-block";

        showPage("homePage");
    } else {
        document.getElementById("loginStatus").style.color = "red";
        document.getElementById("loginStatus").textContent = "Sai tài khoản hoặc mật khẩu.";
    }

});

function logout() {
    isLoggedIn = false;
    alert("Bạn đã đăng xuất.");
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("loginBtn").style.display = "inline-block";
    showPage("loginPage");
}
function showAlert(message) {
    const alertContainer = document.getElementById('alertContainer');

    const alert = document.createElement('div');
    alert.classList.add('alert');
    alert.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖';
    closeBtn.style.marginLeft = '10px';
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => alert.remove();

    alert.appendChild(closeBtn);
    alertContainer.appendChild(alert);
}
