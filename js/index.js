
const gloAcademyList = document.querySelector('.glo-academy-list'),
    trendingList = document.querySelector('.trending-list'),
    musicList = document.querySelector('.music-list');

const createCard = (dataVideo) => {
    console.log(dataVideo);

    const imgUrl = dataVideo.snippet.thumbnails.high.url,
        videoId = typeof dataVideo.id === 'string' ? dataVideo.id : dataVideo.id.videoId,
        titleVideo = dataVideo.snippet.title,
        dateVideo = dataVideo.snippet.publishedAt,
        channelTitle = dataVideo.snippet.channelTitle,
        viewCount = dataVideo.statistics?.viewCount;
    // viewCount = typeof dataVideo.statistics === "object" ? dataVideo.statistics.viewCount + ' views' : '';

    const card = document.createElement('div');
    card.classList.add('video-card');
    card.innerHTML = `
            <div class="video-thumb">
                <a class="link-video youtube-modal" href="https://youtu.be/${videoId}">
                    <img src="${imgUrl}" alt="" class="thumbnail">
                </a>
            </div>
            <h3 class="video-title">${titleVideo}</h3>
            <div class="video-info">
                <span class="video-counter">
                    ${viewCount ? `<span class="video-views">${viewCount} views</span>` : ''}                    
                    <span class="video-date">${new Date(dateVideo).toLocaleString("ru-RU")}</span>
                </span>
                <span class="video-channel">${channelTitle}</span>
            </div>
            `;

    return card;
}

const createList = (wrapper, listVideo) => {
    wrapper.textContent = '';

    listVideo.forEach(item => wrapper.append(createCard(item)));
};

createList(gloAcademyList, gloAcademy);
createList(trendingList, trending);
createList(musicList, music);