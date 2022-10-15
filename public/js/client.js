window.addEventListener('load', async () => {
    'use strict';
    let darkModeEnabled = false;
    let pref = localStorage.getItem('dark-mode');
    let darkModeButton = document.querySelector('.button.toggle-dark-mode');

    darkModeButton.addEventListener('click', () => {
        darkModeEnabled = !darkModeEnabled;
        setClass();
        localStorage.setItem('dark-mode', darkModeEnabled);
    })

    if (!pref) {
        pref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'true' : 'false';
    }

    if (pref) {
        darkModeEnabled = pref === 'true';
    }

    let html = document.querySelector('html');

    const setClass = () => {
        if (darkModeEnabled) {
            html.classList.add('dark-mode');
        } else {
            html.classList.remove('dark-mode');
        }
    }

    setClass();
});

window.addEventListener('load', async () => {
    'use strict';
    const baseUrl = '/api/';
    const playUrl = baseUrl + 'play';
    const stopUrl = baseUrl + 'stop';
    const autoStopClass = 'STOPPPP';
    let autoStop = false;
    let autoStopInterval = null;

    const buttonHandler = async e => {
        var params = {
            group: e.target.dataset.group,
            sound: e.target.dataset.sound
        };

        const response = await fetch(playUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        console.log(await response.text());
    };

    const stop = async () => {
        await fetch(stopUrl, {method: 'POST'});
    }

    const buttons = document.querySelectorAll('.sound-button');

    for (const button of buttons) {
        button.addEventListener('click', buttonHandler);
    }

    document.querySelector('.stop-button').addEventListener('click', stop);

    document.querySelector('.auto-stop').addEventListener('click', () => {
        autoStop = !autoStop;

        if (autoStop) {
            document.body.classList.add(autoStopClass);
            autoStopInterval = setInterval(stop, 100);
        } else {
            document.body.classList.remove(autoStopClass);
            if (autoStopInterval) {
                clearInterval(autoStopInterval);
                autoStopInterval = null;
            }
        }
    });

    const html = document.querySelector('html');
    const style = document.querySelector('#search-stlye');
    const searchBar = document.querySelector('#search');
    searchBar.value = null;
    let timeout = null;

    const handleSearch = () => {
        const query = searchBar.value;

        if (query) {
            html.classList.add('search-active');
            style.innerHTML = `.regular-sound[data-sound*="${query}" i] {display: inline-block;}`;
            const elements = document.querySelectorAll('.search-display');
            for (const element of elements) {
                element.classList.remove('search-display');
            }

            const activeButtons = document.querySelectorAll(`.regular-sound[data-sound*="${query}" i]`);
            for (const activeButton of activeButtons) {
                const groupEl = activeButton.parentElement.parentElement;
                groupEl.classList.add('search-display');
                const link = document.querySelector(`.nav-link[href="#${groupEl.id}"]`);
                link.parentElement.classList.add('search-display');
            }

        } else {
            html.classList.remove('search-active');
            style.innerHTML = '';
        }
        timeout = null;
    }

    searchBar.addEventListener('keyup', e => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(handleSearch, 100);

        if (e.keyCode === 13) {
            setTimeout(() => {
                const query = searchBar.value;

                if (!query) return;
                const firstButton = document.querySelector(`.regular-sound[data-sound*="${query}" i]`);

                if (!firstButton) return;
                firstButton.click();
            }, 100);
        }
    });

});
