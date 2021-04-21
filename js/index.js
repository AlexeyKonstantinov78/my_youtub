const gloAcademyList = document.querySelector('.glo-academy-list');

const createCard = (dataVideo) => {
    console.log(dataVideo);

    const imgUrl = dataVideo.snippet.thumbnails.high.url,
        videoId = dataVideo.id.videoId,
        titleVideo = dataVideo.snippet.title,
        dateVideo = dataVideo.snippet.publishedAt,
        channelTitle = dataVideo.snippet.channelTitle;

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
                    <span class="video-date">${dateVideo}</span>
                </span>
                <span class="video-channel">${channelTitle}</span>
            </div>
            `;

    return card;
}

const createList = (wrapper, listVideo) => {
    wrapper.textContent = '';
    // for (let i = 0; i < listVideo.length; i++) {
    //     wrapper.textContent += listVideo[i];

    // }

    listVideo.forEach(item => wrapper.append(createCard(item)));
};

createList(gloAcademyList, gloAcademy);