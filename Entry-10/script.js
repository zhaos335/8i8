document.addEventListener('DOMContentLoaded', () => {
    const tickSound = document.getElementById('tick-sound');

    tickSound.muted = false;   
    tickSound.volume = 1.0;

  
    const playAttempt = tickSound.play();

    if (playAttempt !== undefined) {
        playAttempt.catch(err => {
            console.log("自动播放被阻止 → 等待用户第一次点击");

  
            const userStart = () => {
                tickSound.play().then(() => {
                    console.log("已开始播放 tick.wav");
                });
                document.removeEventListener('click', userStart);
            };

            document.addEventListener('click', userStart);
        });
    }
});

function updateTimes() {
  const clocks = document.querySelectorAll('.clock');

  clocks.forEach(clock => {
    const zone = clock.dataset.zone;
    const box = clock.querySelector('.time-box');

    const now = new Date();
    const timeString = new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: zone
    }).format(now);

    box.textContent = timeString;
  });
}

// 
setInterval(updateTimes, 1000);
updateTimes();
