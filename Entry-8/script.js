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
            
            // 
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
                    
                    // add overlay 
                    overlay.classList.add('hidden');
                    
                    // update status
                    statusDot.classList.add('active');
                    statusText.textContent = 'Your camera has been on';
                    
                } catch (err) {
                    console.error("Error occurs:", err);
                    statusText.textContent = 'cannot access the camera: ' + err.message;
                    alert('cannot access the camera, please make sure your camera is on and reload');
                }
            }
            
            // stop the camera
            function stopCamera() {
                if (currentStream) {
                    currentStream.getTracks().forEach(track => track.stop());
                    currentStream = null;
                    
                    // overlay remove
                    overlay.classList.remove('hidden');
                    
                    // status remove
                    statusDot.classList.remove('active');
                    statusText.textContent = 'Your camera is not on';
                }
            }
            
            // flipcamera
            function flipCamera() {
                if (currentStream) {
                    stopCamera();
                    usingFrontCamera = !usingFrontCamera;
                    startCamera();
                }
            }
            
            // capture
            function capturePhoto() {
                if (!currentStream) {
                    alert('Please open your camera first');
                    return;
                }
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                
                // canvaswidth
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                // 
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // 
                const link = document.createElement('a');
                link.download = 'mirror-photo-' + new Date().getTime() + '.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                // 
                const originalText = captureBtn.innerHTML;
                captureBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/></svg>Your photo has been saved';
                
                setTimeout(() => {
                    captureBtn.innerHTML = originalText;
                }, 2000);
            }
            
            // 
            startBtn.addEventListener('click', startCamera);
            flipBtn.addEventListener('click', flipCamera);
            captureBtn.addEventListener('click', capturePhoto);
            
            // 
            window.addEventListener('beforeunload', () => {
                if (currentStream) {
                    stopCamera();
                }
            });
        });