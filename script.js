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
    const saveVideos = (videos) => {
        localStorage.setItem("videos", JSON.stringify(videos));
    };

    // Get all saved videos from localStorage
    const getSavedVideos = () => {
        const savedVideos = localStorage.getItem("videos");
        return savedVideos ? JSON.parse(savedVideos) : [];
    };

    // Display a video on the page
    const displayVideo = (video) => {
        const videoContainer = document.createElement("div");
        videoContainer.className = "video-container";
        videoContainer.dataset.videoId = video.id;
        videoContainer.style.position = "relative"; // Ensure the checkbox can be positioned inside

        const title = document.createElement("h3");
        title.textContent = video.title;
        title.contentEditable = false;

        const iframe = document.createElement("iframe");
        iframe.width = "100%";
        iframe.height = "315";
        iframe.src = video.url;
        iframe.title = `YouTube video ${video.title}`;
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;

        // Create Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "video-checkbox"; // Add a class for styling if needed

        // Create "done" message
        const doneMessage = document.createElement("span");
        doneMessage.textContent = "Done";
        doneMessage.style.display = "none"; // Hidden initially
        doneMessage.style.color = "green"; // Style the message

        // Checkbox click event
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                doneMessage.style.display = "inline";
            } else {
                doneMessage.style.display = "none";
            }
        });


        // Add Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit Title";
        editButton.addEventListener("click", () => {
            if (title.contentEditable === "true") {
                title.contentEditable = "false";
                editButton.textContent = "Edit Title";
                updateVideoTitle(video.id, title.textContent);
            } else {
                title.contentEditable = "true";
                editButton.textContent = "Save Title";
            }
        });

        // Add Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Video";
        deleteButton.addEventListener("click", () => {
            deleteVideo(video.id);
            videoContainer.remove();
        });
        // Append elements to video container
        videoContainer.appendChild(checkbox); // Append the checkbox
        videoContainer.appendChild(doneMessage); // Append the done message
        videoContainer.appendChild(title);
        videoContainer.appendChild(iframe);
        videoContainer.appendChild(editButton);
        videoContainer.appendChild(deleteButton);
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
            const video = { id: videoId, title, url: embedUrl };
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

    // Update video title in localStorage
    const updateVideoTitle = (id, newTitle) => {
        let videos = getSavedVideos();
        videos = videos.map(video => {
            if (video.id === id) {
                video.title = newTitle;
            }
            return video;
        });
        saveVideos(videos);
    };

    // Save a single video to localStorage
    const saveVideo = (video) => {
        const videos = getSavedVideos();
        videos.push(video);
        saveVideos(videos);
    };

    // Delete a video from localStorage
    const deleteVideo = (id) => {
        let videos = getSavedVideos();
        videos = videos.filter(video => video.id !== id);
        saveVideos(videos);
    };

    // Initial load of videos
    loadVideos();
});
