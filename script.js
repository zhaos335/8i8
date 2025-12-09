  // 更新所有时钟的时间
        function updateAllClocks() {
            const clocks = document.querySelectorAll('.clock');
            
            clocks.forEach(clock => {
                const timeZone = clock.getAttribute('data-zone');
                const timeBox = clock.querySelector('.time-box');
                
                if (timeBox) {
                    try {
                        const now = new Date();
                        const timeString = new Intl.DateTimeFormat('en-US', {
                            timeZone: timeZone,
                            hour12: true,
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }).format(now);
                        
                        timeBox.textContent = timeString;
                    } catch (error) {
                        console.error(`Error updating time for ${timeZone}:`, error);
                        timeBox.textContent = '--:--:--';
                    }
                }
            });
        }

          // 播放滴答声
  const tickSound = document.getElementById('tick-sound');
  tickSound.currentTime = 0;
  tickSound.play().catch(e => console.log("Audio play failed:", e));


// 每秒更新一次
setInterval(updateClock, 1000);
updateClock(); // 初始调用

// 添加点击效果
document.querySelectorAll('.clock').forEach(clock =>{
  clock.addEventListener('click', function() {
    this.style.transform = 'scale(0.98)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 100);
  });
});
