// Hàm kích hoạt âm thanh dựa trên phần tử nút bấm trống được chọn
function playSound(key) {
  // Tìm nút bấm trống dựa trên giao kèo dữ liệu data-key đã định nghĩa ở HTML
  const pad = document.querySelector(`.drum-pad[data-key="${key.toLowerCase()}"]`);
  
  if (!pad) return;

  // STEP 2: Polyphonic Audio Playback Engine độc lập
  // Khởi tạo instance Audio mới mỗi lần kích hoạt để các âm thanh có thể vang chồng lên nhau
  const audioInstance = new Audio(pad.dataset.sound);
  audioInstance.play();

  // Tạo hiệu ứng nhấn trực quan bằng Class Manipulation phục vụ A11y/UX
  pad.classList.add('active');
  setTimeout(() => pad.classList.remove('active'), 100);
}

// Lắng nghe sự kiện gõ phím trên phạm vi toàn bộ cửa sổ trình duyệt
window.addEventListener('keydown', (e) => {
  // STEP 3: Chặn hiện tượng dồn ứ âm thanh (Audio Flooding) khi người dùng đè giữ phím
  if (e.repeat) return; 

  // Gọi hàm phát âm thanh với ký tự phím vừa gõ
  playSound(e.key);
});
