const { spawn } = require("child_process");

const streamUrl = "Remplace par ton flux"; // Remplace par l'URL de ton flux
const youtubeRtmp = "rtmp://a.rtmp.youtube.com/live2/Stream-keys"; // Remplace par ta clé de stream

function startStream() {
  console.log("Démarrage du stream...");

  const ffmpegCmd = [
    "-loglevel", "debug", // Debug pour voir les logs détaillés
    "-rtbufsize", "256M", // Tampon pour éviter les pertes
    "-re", "-stream_loop", "-1", "-i", streamUrl, // 🔥 Boucle infinie
    "-vf", "scale=1280:720", // Réduit la résolution pour alléger le CPU
    "-c:v", "libx264",
    "-preset", "ultrafast", // Encodage plus rapide
    "-b:v", "2000k", // Réduction du bitrate vidéo
    "-maxrate", "2000k",
    "-bufsize", "4000k",
    "-pix_fmt", "yuv420p",
    "-g", "50", // Intervalle entre les keyframes
    "-c:a", "aac",
    "-b:a", "128k",
    "-ar", "44100",
    "-threads", "2", // Limite l'utilisation des threads
    "-f", "flv", youtubeRtmp, // Format de sortie
  ];

  const ffmpeg = spawn("ffmpeg", ffmpegCmd);

  ffmpeg.stdout.on("data", (data) => console.log(`stdout: ${data}`));
  ffmpeg.stderr.on("data", (data) => console.error(`stderr: ${data}`));

  ffmpeg.on("close", (code) => {
    console.log(`FFmpeg exited with code ${code}, redémarrage dans 5 secondes...`);
    setTimeout(startStream, 5000); // Redémarre après 5 secondes
  });
}

startStream(); // Lancer le stream au démarrage
