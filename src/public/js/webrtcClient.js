let mediaRecorder;
let socket;

document.getElementById('start').onclick = async () => {
    console.log('🎤 Získávám přístup k mikrofonu...');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    console.log('🔌 Otevírám WebSocket připojení...');
    socket = new WebSocket('ws://localhost:5500/keyboard');
    socket.binaryType = 'arraybuffer';

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(e.data);  // Odesíláme WebM chunk
            console.log('📤 Odeslán audio chunk (500ms)');
        }
    };

    mediaRecorder.start(500);  // Záznam každý 500ms
    console.log('▶️ Nahrávání spuštěno');

    document.getElementById('start').disabled = true;
    document.getElementById('stop').disabled = false;
};

document.getElementById('stop').onclick = () => {
    mediaRecorder.stop();  // Zastavení nahrávání
    socket.close();  // Uzavření WebSocket připojení
    console.log('⏹️ Nahrávání zastaveno a socket uzavřen');

    document.getElementById('start').disabled = false;
    document.getElementById('stop').disabled = true;
};
