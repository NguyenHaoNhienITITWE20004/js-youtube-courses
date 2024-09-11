document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("video-form");
    const urlInput = document.getElementById("video-url");
    const titleInput = document.getElementById("video-title");
    const videoGrid = document.getElementById("video-grid");

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

    const saveVideos = (videos) => {
        localStorage.setItem("videos", JSON.stringify(videos));
    };

    const getSavedVideos = () => {
        const savedVideos = localStorage.getItem("videos");
        return savedVideos ? JSON.parse(savedVideos) : [];
    };

    const displayVideo = (video) => {
        const videoContainer = document.createElement("div");
        videoContainer.className = "video-container";
        videoContainer.dataset.videoId = video.id;
    
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
    
        const [checkbox, doneMessage] = createCheckbox(video.id, video.isChecked);
    
        const editButton = createButton("Edit Title", () => handleEditButtonClick(video.id, title, editButton));
        const deleteButton = createButton("Delete Video", () => handleDeleteButtonClick(video.id, videoContainer));
    
        videoContainer.append(checkbox, doneMessage, title, iframe, editButton, deleteButton);
        videoGrid.appendChild(videoContainer);
    };
    
    
    const createCheckbox = (id, isChecked) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "video-checkbox";
        checkbox.checked = isChecked;
    
        const doneMessage = document.createElement("span");
        doneMessage.textContent = "Done";
        doneMessage.style.display = isChecked ? "inline" : "none";
        doneMessage.style.color = "green";
    
        checkbox.addEventListener("change", () => {
            doneMessage.style.display = checkbox.checked ? "inline" : "none";
            updateVideoCheckboxState(id, checkbox.checked);
        });
    
        return [checkbox, doneMessage];
    };
    

    const createButton = (text, onClick) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.addEventListener("click", onClick);
        return button;
    };

    const handleEditButtonClick = (id, titleElement, buttonElement) => {
        if (titleElement.contentEditable === "true") {
            titleElement.contentEditable = "false";
            buttonElement.textContent = "Edit Title";
            updateVideoTitle(id, titleElement.textContent);
        } else {
            titleElement.contentEditable = "true";
            buttonElement.textContent = "Save Title";
        }
    };

    const handleDeleteButtonClick = (id, container) => {
        deleteVideo(id);
        container.remove();
    };

    const getYouTubeVideoId = (url) => {
        const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regex);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const updateVideoTitle = (id, newTitle) => {
        let videos = getSavedVideos();
        videos = videos.map(video => video.id === id ? { ...video, title: newTitle } : video);
        saveVideos(videos);
    };

    const updateVideoCheckboxState = (id, isChecked) => {
        let videos = getSavedVideos();
        videos = videos.map(video => video.id === id ? { ...video, isChecked } : video);
        saveVideos(videos);
    };

    const saveVideo = (video) => {
        const videos = getSavedVideos();
        if (!videos.some(v => v.id === video.id)) {
            videos.push(video);
            saveVideos(videos);
        }
    };

    const deleteVideo = (id) => {
        const videos = getSavedVideos().filter(video => video.id !== id);
        saveVideos(videos);
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const url = urlInput.value;
        const title = titleInput.value.trim();
        const videoId = getYouTubeVideoId(url);

        if (videoId && title) {
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            const video = { id: videoId, title, url: embedUrl, isChecked: false };
            displayVideo(video);
            saveVideo(video);
            urlInput.value = "";
            titleInput.value = "";
        } else {
            alert("Please enter a valid YouTube URL and title.");
        }
    });

    loadVideos();
});
