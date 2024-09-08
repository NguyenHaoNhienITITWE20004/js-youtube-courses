document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("video-form");
    const urlInput = document.getElementById("video-url");
    const titleInput = document.getElementById("video-title");
    const videoGrid = document.getElementById("video-grid");

    // Load saved videos from localStorage when the page loads
    const loadVideos = () => {
        const savedVideos = localStorage.getItem("videos");
        if (savedVideos) {
            try {
                const videos = JSON.parse(savedVideos);
                videos.forEach(video => displayVideo(video));
            } catch (error) {
                console.error("Error parsing videos from localStorage", error);
            }
        }
    };

    // Save videos to localStorage
    const saveVideo = (video) => {
        const savedVideos = localStorage.getItem("videos");
        let videos = [];
        if (savedVideos) {
            try {
                videos = JSON.parse(savedVideos);
            } catch (error) {
                console.error("Error parsing videos from localStorage", error);
            }
        }
        videos.push(video);
        localStorage.setItem("videos", JSON.stringify(videos));
    };

    // Display a video on the page
    const displayVideo = (video) => {
        const videoContainer = document.createElement("div");
        videoContainer.className = "video-container";

        const title = document.createElement("h3");
        title.textContent = video.title;

        const iframe = document.createElement("iframe");
        iframe.width = "100%";
        iframe.height = "315";
        iframe.src = video.url;
        iframe.title = `YouTube video ${video.title}`;
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;

        videoContainer.appendChild(title);
        videoContainer.appendChild(iframe);
        videoGrid.appendChild(videoContainer);
    };

    // Handle form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const url = urlInput.value;
        const title = titleInput.value.trim();
        const videoId = getYouTubeVideoId(url);

        if (videoId && title) {
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            const video = { title, url: embedUrl };
            displayVideo(video);
            saveVideo(video);
            urlInput.value = "";
            titleInput.value = "";
        } else {
            alert("Please enter a valid YouTube URL and title.");
        }
    });

    // Extracts the YouTube video ID from a URL
    const getYouTubeVideoId = (url) => {
        const regex =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regex);
        return match && match[2].length === 11 ? match[2] : null;
    };

    // Initial load of videos
    loadVideos();
});
