

// const gloAcademyList = document.querySelector('.glo-academy-list'),
//     trendingList = document.querySelector('.trending-list'),
//     musicList = document.querySelector('.music-list'),

const content = document.querySelector('.content');
navMenuMore = document.querySelector('.nav-menu-more'),
    showMore = document.querySelector('.show-more'),
    formSearch = document.querySelector('.form-search'),
    subscriptionsList = document.querySelector('.subscriptions-list');

const createCard = (dataVideo) => {
    //console.log(dataVideo);

    const imgUrl = dataVideo.snippet.thumbnails.high.url,
        videoId = typeof dataVideo.id === 'string' ? dataVideo.id : dataVideo.id.videoId,
        titleVideo = dataVideo.snippet.title,
        dateVideo = dataVideo.snippet.publishedAt,
        channelTitle = dataVideo.snippet.channelTitle,
        viewCount = dataVideo.statistics?.viewCount;
    // viewCount = typeof dataVideo.statistics === "object" ? dataVideo.statistics.viewCount + ' views' : '';

    const card = document.createElement('li');
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


const createList = (listVideo, title, clear) => {

    const channel = document.createElement('section');
    channel.classList.add('channel');

    if (clear) {
        content.textContent = '';
    }

    if (title) {
        const header = document.createElement('h2');
        header.textContent = title;
        channel.insertAdjacentElement('afterbegin', header);
    }

    const wrapper = document.createElement('ul');
    wrapper.classList.add('video-list');
    channel.insertAdjacentElement('beforeend', wrapper);

    listVideo.forEach(item => wrapper.append(createCard(item)));

    content.insertAdjacentElement('beforeend', channel);
};


const createSubList = listVideo => {
    subscriptionsList.textContent = '';
    listVideo.forEach(item => {
        const html = `
        <li class="nav-item">
            <a href="#" class="nav-link" data-channel-id="${item.snippet.resourceId.channelId}">
                <img src="${item.snippet.thumbnails.high.url}" alt="Photo: ${item.snippet.title}" class="nav-image">
                <span class="nav-text">${item.snippet.title}</span>
            </a>
        </li>
    `;
        subscriptionsList.insertAdjacentHTML('beforeend', html);
    });
};


//yotubAPI https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
// https://developers.google.com/youtube/v3/docs/channels/list

const authBtn = document.querySelector('.auth-btn'),
    userAvatar = document.querySelector('.user-avatar');


const handleSuccessAuthent = (data) => {

    authBtn.classList.add('hide');
    userAvatar.classList.remove('hide');
    userAvatar.src = data.getImageUrl();
    userAvatar.alt = data.getName();

    requestSubscriptions(createSubList);
}

const handleNoAuth = () => {
    authBtn.classList.remove('hide');
    userAvatar.classList.add('hide');
    userAvatar.src = '';
    userAvatar.alt = '';
}

const handleAuth = () => {
    gapi.auth2.getAuthInstance().signIn();

}

const handleSignout = () => {
    gapi.auth2.getAuthInstance().signOut();
}

const updateStatusAuth = (data) => {

    data.isSignedIn.listen(() => {
        updateStatusAuth(data);
    });

    if (data.isSignedIn.get()) {
        const userData = data.currentUser.get().getBasicProfile();
        handleSuccessAuthent(userData);
    } else {
        handleNoAuth();
    }
}

// необходимо включить стороние coocke иначе не дает авторизоватся
function initClient() {
    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': 'https://www.googleapis.com/auth/youtube.readonly',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    }).then(() => {
        updateStatusAuth(gapi.auth2.getAuthInstance());
        authBtn.addEventListener('click', handleAuth);
        userAvatar.addEventListener('click', handleSignout);
    }).then(loadScreen).catch(err => {
        authBtn.removeEventListener('click', handleAuth);
        userAvatar.removeEventListener('click', handleSignout);
        alert('Авторизация не возможна!');
        console.log(err);
    });
}

gapi.load('client:auth2', initClient);

// https://www.youtube.com/channel/UCVswRUcKC-M35RzgPRv8qUg запрос на получение данных канала id UCVswRUcKC-M35RzgPRv8qUg
const getChannel = () => {
    gapi.client.youtube.channels.list({
        part: 'snippet, statistics',
        id: 'UCVswRUcKC-M35RzgPRv8qUg',
    }).execute((response) => {
        console.log(response);
    });
}

const requestVideos = (channelId, callback, maxResults = 6) => {
    gapi.client.youtube.search.list({
        part: 'snippet',
        channelId,
        maxResults,
        order: 'date',
    }).execute((response) => {
        callback(response.items);
    });

};

const requestTrending = (callback, maxResults = 6) => {
    gapi.client.youtube.videos.list({
        part: 'snippet, statistics',
        chart: 'mostPopular',
        regionCode: 'RU',
        maxResults,
    }).execute((response) => {
        callback(response.items);
    });
};

const requestMusic = (callback, maxResults = 6) => {
    gapi.client.youtube.videos.list({
        part: 'snippet, statistics',
        chart: 'mostPopular',
        regionCode: 'RU',
        maxResults,
        videoCategoryId: '10',  // категори для музыки 
    }).execute((response) => {
        callback(response.items);
    });
};

//запрос на поиска
const requestSearch = (searchText, callback, maxResults = 12) => {
    gapi.client.youtube.search.list({
        part: 'snippet',
        q: searchText,
        maxResults,
        order: 'relevance',
    }).execute((response) => {
        callback(response.items);
    });
};

const requestSubscriptions = (callback, maxResults = 10) => {
    gapi.client.youtube.subscriptions.list({
        part: 'snippet',
        mine: 'true',
        maxResults,
        order: 'unread',
    }).execute((response) => {
        callback(response.items);
    });
};

const loadScreen = () => {
    content.textContent = '';

    requestVideos('UCVswRUcKC-M35RzgPRv8qUg', data => {

        createList(data, data[0].snippet.channelTitle);

        requestTrending(data => {
            createList(data, 'Популярное видео');

            requestMusic(data => {
                createList(data, 'Популярная музыка');
            });
        });
    });
};

showMore.addEventListener('click', event => {
    event.preventDefault();
    navMenuMore.classList.toggle('nav-menu-more-show');
});

formSearch.addEventListener('submit', event => {
    event.preventDefault();
    console.log(formSearch.elements.search.value); //получаем даные из строки поиска
    const value = formSearch.elements.search.value
    requestSearch(value, data => {

        createList(data, 'Результат поиска', true);
    });
});

subscriptionsList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target,
        linkChannel = target.closest('.nav-link');

    content.textContent = '';
    requestVideos(linkChannel.dataset.channelId, data => {

        createList(data, data[0].snippet.channelTitle);

        requestTrending(data => {
            createList(data, 'Популярное видео');

            requestMusic(data => {
                createList(data, 'Популярная музыка');
            });
        });
    });
});