const gloAcademyList = document.querySelector('.glo-academy-list');

const createCard = (dataVideo) => {

    const card = document.createElement('div');
    card.classList.add('video-card');
    card.innerHTML = `${dataVideo}`;

    return card;
}

const createList = (wrapper, listVideo) => {
    wrapper.textContent = '';
    // for (let i = 0; i < listVideo.length; i++) {
    //     wrapper.textContent += listVideo[i];

    // }

    listVideo.forEach(item => wrapper.append(createCard(item)));
};

const list = ['Josef', 'Vladyslav', 'Ilya', 'Vladys', 'Serega'];

createList(gloAcademyList, list);