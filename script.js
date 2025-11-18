  document.addEventListener('DOMContentLoaded', function() {
            const video = document.getElementById('video');
            const overlay = document.getElementById('overlay');
            const startBtn = document.getElementById('startBtn');
            const flipBtn = document.getElementById('flipBtn');
            const captureBtn = document.getElementById('captureBtn');
            const statusDot = document.getElementById('statusDot');
            const statusText = document.getElementById('statusText');
            
            let currentStream = null;
            let usingFrontCamera = true;
            
            // 开启摄像头
            async function startCamera() {
                try {
                    const constraints = {
                        video: { 
                            facingMode: usingFrontCamera ? 'user' : 'environment',
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        }
                    };
                    
                    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
                    video.srcObject = currentStream;
                    
                    // 隐藏覆盖层
                    overlay.classList.add('hidden');
                    
                    // 更新状态
                    statusDot.classList.add('active');
                    statusText.textContent = 'Your camera has been on';
                    
                } catch (err) {
                    console.error("Error occurs:", err);
                    statusText.textContent = 'cannot access the camera: ' + err.message;
                    alert('cannot access the camera, please make sure your camera is on and reload');
                }
            }
            
            // 停止摄像头
            function stopCamera() {
                if (currentStream) {
                    currentStream.getTracks().forEach(track => track.stop());
                    currentStream = null;
                    
                    // 显示覆盖层
                    overlay.classList.remove('hidden');
                    
                    // 更新状态
                    statusDot.classList.remove('active');
                    statusText.textContent = 'Your camera is not on';
                }
            }
            
            // 翻转摄像头
            function flipCamera() {
                if (currentStream) {
                    stopCamera();
                    usingFrontCamera = !usingFrontCamera;
                    startCamera();
                }
            }
            
            // 拍照功能
            function capturePhoto() {
                if (!currentStream) {
                    alert('Please open your camera first');
                    return;
                }
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                
                // 设置canvas尺寸与视频相同
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                // 绘制图像到canvas（注意镜像翻转）
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // 创建下载链接
                const link = document.createElement('a');
                link.download = 'mirror-photo-' + new Date().getTime() + '.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                // 显示短暂提示
                const originalText = captureBtn.innerHTML;
                captureBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/></svg>Your photo has been saved';
                
                setTimeout(() => {
                    captureBtn.innerHTML = originalText;
                }, 2000);
            }
            
            // 事件监听
            startBtn.addEventListener('click', startCamera);
            flipBtn.addEventListener('click', flipCamera);
            captureBtn.addEventListener('click', capturePhoto);
            
            // 页面卸载时停止摄像头
            window.addEventListener('beforeunload', () => {
                if (currentStream) {
                    stopCamera();
                }
            });
        });