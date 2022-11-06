// Selectors
let mainBtn = $('body');
let body = $('body');
let cardsContainer = $('.cards-container');
let sideBar = $('.side-bar');
let showSideBar = $('.menu');
let hideSideBar = $('.side-bar .head i');
let bg = $('.bg-flow');
let switchTheme = $('nav ul li:nth-child(2)');
let light = $('nav ul li:nth-child(2) i:nth-child(1)');
let dark = $('nav ul li:nth-child(2) i:nth-child(2)');
let numsContainer = $('.nums');
let pageNumF = 0;
let pageNumT = -56;
let pageNumB = 56;
let searchBar = $('.search-bar');
let searchBtn = $('.search');
let gamescontainer = $('.games .content')
let appscontainer = $('.apps .content')
let sideContainer = $('.side-bar');
let downloadBg = $('.download-overlay');
let downloadContainer = $('.download-container');
let reportBtn = $('.report-btn');
let result = $('.result');


var CTD;
let array = [];
let arrayElements = [];

// Get Width Side Bar & Hide It
let sideBarWidth = sideBar.innerWidth();
sideBar.css('right', -sideBarWidth - 50)

// Show SideBar
showSideBar.on('click', function () {
    sideBar.animate({ left: 0 }, 1000);
    bg.show();
    bg.animate({ opacity: 1 }, 1000);
    setTimeout(() => {
        $('.categories').css({
            opacity: 1,
            transform: 'translateX(0px)'
        })
    }, 800);
})

// Hide SideBar By Click Close
hideSideBar.on('click', function () {
    sideBar.animate({ left: -sideBarWidth - 50 }, 1000);
    bg.animate({ opacity: 0 }, 1000, function () { bg.hide() });
    $('.categories').css({
        opacity: 0,
        transform: 'translateX(-30px)'
    })
})

// Hide SideBar By Click On Background
bg.on('click', function () {
    sideBar.animate({ left: -sideBarWidth - 50 }, 1000);
    bg.animate({ opacity: 0 }, 1000, function () { bg.hide() });
    $('.categories').css({
        opacity: 0,
        transform: 'translateX(-30px)'
    })
})

// Get Result From Json and Create it
searchBar.on('input', function (e) {
    let inputText = e.currentTarget.value

    // Clear Result if Lenght > 3
    if (inputText.length < 3){
        result.html('');
        designSearch('5px');
    } 

    if (inputText.length > 2) {
        designSearch('5px 5px 0 0');
        // Get Data From Json File
        fetch("../js/all.json")
        .then((response) => response.json())
        .then((data) => {
            array = [];
            for (let i = 0; i < data.length; i++) {
                let text = data[i].title;
                let check = text.toLowerCase().includes(searchBar.val().toLowerCase());
                if (check) {
                    array.push(data[i]);
                }
            }

            // 
            if (array.length >= 1) {
                result.html('');
                if (array.length <= 4) {
                    createResluts(array, array.length);
                }
                if (array.length > 4) {
                    createResluts(array, 8);
                }
            } else {
                $('.content .input span').show();
                setTimeout(() => { $('.content .input span').hide() }, 3000);
            }
        })
    }
})

// create Elements
function createResluts (array, pro) {
    for (let i = 0; i < pro; i++) {
        let p = document.createElement('p');
        p.className = 'result-text';
        p.appendChild(document.createTextNode(array[i].title))
        result.append(p);
    }
}

// Design Search Bar
function designSearch(val) {
    searchBar.css({"border-radius": val})
}

// Add Click To Reslut
$('.result').on('click',$('.result-text'), function (e) {
    searchBar.val(e.target.innerHTML);
    result.html('');
})

// Get Categories Fron Json
function getCategorie() {
    $(function () {
        $.getJSON("../js/categories.json", function (data) {
            let apps = data.filter((e) => e.name.toLowerCase() === "apps")
            let games = data.filter((e) => e.name.toLowerCase() === "games")
            createCategories(apps, appscontainer);
            createCategories(games, gamescontainer);
        })
    })
}
getCategorie()

// Create Categories & Add Them To Side-Bar
function createCategories(categorie, cont) {
    for (let i = 0; i < categorie.length; i++) {
        let categoriescontainer = document.createElement('div');
        categoriescontainer.className = "categories";
        let img = document.createElement('img');
        img.src = `../img/${categorie[i].title}.png`;
        let text = document.createElement('span');
        text.className = 'categorieSP';
        text.appendChild(document.createTextNode(categorie[i].title));
        categoriescontainer.appendChild(img);
        categoriescontainer.appendChild(text);
        cont.append(categoriescontainer);
    }
}

// Get The Categorie By Click It
sideContainer.on('click', function (e) {
    if (e.target.classList.contains('categories')) {
        let categorie = e.target.children[1].innerHTML;
        getByCategorie(categorie);
        numsContainer.html('');
        // Add Active To Chosen Categorie and Remove It From Brothers
        delAct();
        e.target.classList.add("active");
    }
    if (e.target.classList.contains('categorieSP')) {
        let categorieSP = e.target.innerHTML;
        getByCategorie(categorieSP);
        numsContainer.html('');
        // Add Active To Chosen Categorie and Remove It From Brothers
        delAct();
        e.target.parentElement.classList.add("active");
    }
})

// Remove Active Class From All Categories
function delAct() {
    $('.categories').each(function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        }
    })
}

// Create Cards Based On Chosed Categorie
function getByCategorie(categorie) {
    $(function () {
        $.getJSON("../js/all.json", function (data) {
            data = data.filter((obj) => obj.categorie.toLowerCase() == categorie.toLowerCase());
            cardsContainer.html('');
            for (let i = 0; i < data.length; i++) {
                let card = document.createElement('div');
                card.className = "card";
                let title = document.createElement('h3');
                title.className = "title";
                title.appendChild(document.createTextNode(data[i].title))
                card.appendChild(title);
                let img = document.createElement('img');
                img.src = "../img/apps/" + data[i].title + ".jpg";
                card.appendChild(img);
                cardsContainer.append(card);
            }
        })
    })
}

// Set Light Color As Default Theme
lightColor();

// Set Theme Color Based On LocalStorage
// if (localStorage.getItem('colorTheme')) {
//     if (localStorage.getItem('colorTheme') === 'dark') {
//         darkColor();
//         dark.show();
//         light.hide();
//         imgCollect(1);
//     } else if (localStorage.getItem('colorTheme') === 'light') {
//         lightColor();
//         dark.hide();
//         light.show();
//         imgCollect(0);
//     }
// }

// Set Root Color Light
function lightColor() {
    $(":root").css({
        "--MainColor": '#009383',
        "--SeconderyColor1": '#fff',
        "--SeconderyColor2": '#000',
        "--SeconderyColor3": '#d4d4d4',
        "--SeconderyColor4": '#006156',
        "--SeconderyColor5": '#00000098',
        "--SeconderyColor6": '#ffffff4d',
        "--SeconderyColor7": '#06e3cb'
    })
}

// Set Root Color Dark
function darkColor() {
    $(":root").css({
        "--MainColor": '#2c2c2c',
        "--SeconderyColor1": '#000',
        "--SeconderyColor2": '#fff',
        "--SeconderyColor3": '#000',
        "--SeconderyColor4": '#141414',
        "--SeconderyColor5": '#00000098',
        "--SeconderyColor6": '#ffffff4d',
        "--SeconderyColor7": '#707070'
    })
}


// Switch Theme Color
light.on('click', function () {
    $(this).hide();
    dark.show();
    darkColor();
    imgCollect(1);
    // localStorage.setItem('colorTheme', 'dark')
})
dark.on('click', function () {
    $(this).hide();
    light.show();
    lightColor();
    imgCollect(0);
    // localStorage.setItem('colorTheme', 'light')
});

// Collect All Img In Side Bar
function imgCollect (val) {
    $('.side-bar .content img').css('filter', `invert(${val})`)
}

// Go By Cliking Search Btn
searchBtn.on('click', function () {
    searchItem();
})

// Go By Cliking Enter
mainBtn.on('keyup', function (e) {
    if (e.keyCode === 13) {
        searchItem();
    }
})

// Filter Items By Search
function searchItem() {
    if (searchBar.val() !== '') {
        numsContainer.css('display', 'none');
        cardsContainer.html('');
        fetch("../js/all.json")
        .then((response) => response.json())
        .then((data) => {
            arrayElements = [];
            for (let i = 0; i < data.length; i++) {
                let text = data[i].title;
                let check = text.toLowerCase().includes(searchBar.val().toLowerCase())
                if (check) {
                    arrayElements.push(data[i]);
                }
            }
            createcardsT(arrayElements);
        })


        // 
        function createcardsT(array) {
            cardsContainer.html('');
            if (array.length >= 1) {
                for (let i = 0; i < array.length; i++) {
                    let card = document.createElement('div');
                    card.className = "card";
                    let title = document.createElement('h3');
                    title.className = 'title';
                    title.appendChild(document.createTextNode(array[i].title))
                    card.appendChild(title);
                    let img = document.createElement('img');
                    img.src = "../img/apps/" + array[i].title + ".jpg";
                    card.appendChild(img);
                    cardsContainer.append(card);
                }
        }else {
            let notFound = document.createElement('div');
            notFound.className = "not-found";
            let imgEr = document.createElement('img');
            imgEr.src = "../img/sad.png";
            let h2Er = document.createElement('h2');
            h2Er.appendChild(document.createTextNode('We Are Sorry, We Cant Find What You Looking For.'))
            notFound.appendChild(imgEr);
            notFound.appendChild(h2Er);
            cardsContainer.append(notFound)
        }
    }
}
}

// Get Data From Json
$(function () {
    $.getJSON('../js/all.json', function (data) {

        // Create Card
        createCards(pageNumF, data, pageNumB);

        // Create Bullets Based On Cards Length
        let numSpans = Math.ceil(data.length / 56);
        for (let i = 1; i <= numSpans; i++) {
            let span = document.createElement('span');
            span.appendChild(document.createTextNode(i));
            if (span.innerHTML === '1') {
                span.className = 'active';
            }
            span.setAttribute('data-i-first', pageNumF += 56);
            span.setAttribute('data-i-last', pageNumT += 56);
            numsContainer.append(span);
        }

        // Traversing By Clicking Bullets
        $('.nums').on('click', 'span', function () {
            $(this).addClass('active').siblings().removeClass('active');
            pageNumF = $(this).data('i-last');
            pageNumT = $(this).data('i-first');
            createCards(pageNumF, data, pageNumT);
        })
    })

})

// Create Cards
function createCards(pN, data, pG) {
    cardsContainer.html('');
    for (let i = pN; i < pG; i++) {
        let card = document.createElement('div');
        card.className = "card";
        let title = document.createElement('h3');
        title.className = 'title';
        title.appendChild(document.createTextNode(data[i].title))
        card.appendChild(title);
        let img = document.createElement('img');
        img.src = "../img/apps/" + data[i].title + ".jpg";
        card.appendChild(img);
        cardsContainer.append(card);
    }
}

// Create Go-Up Button
function goUp() {
    let goUp = document.createElement('div');
    goUp.className = "goUp";
    let img = document.createElement('img');
    img.src = '../img/arrow-up.svg';
    goUp.appendChild(img);
    mainBtn.append(goUp);
}
goUp();

// Show & Hide Go-Up
$(window).on('scroll', function () {
    let win = $(window).scrollTop();
    let container = $('.cards-container').offset().top;
    if (win > container) {
        $('.goUp').css('right', "25px");
    }
    if (win < container) {
        $('.goUp').css('right', "-50px");
    }
})

// assign Go-Up
document.querySelector('.goUp').addEventListener('click', (e) => {
    $("html, body").animate({
        scrollTop: 0
    }, 1000);
})

// Add 2 Div After Reflect
$(('.reflect')).append('<div class="first"></div>');

// Close Download Overlay
downloadBg.on('click', function () {
    setTimeout(() => { $(this).css('display', 'none') }, 500);
    animationFlowDown(0, -30);
    // Turn Off Report Notification
    reportBtn.removeClass('send-report');
    clearTimeout(CTD);
});
downloadContainer.on('click', function (e) {
    e.stopPropagation();
});
reportBtn.on('click', function (e) {
    e.stopPropagation();
});

// Get Title From Chosed Card
cardsContainer.on('click', function (e) {
    if ($(e.target).hasClass('title')) {
        let title = e.target.innerHTML;
        getTitle(title);
        $(downloadBg).css('display', 'grid');
        animationFlowDown(1, 0);
        turnOnNotification();
    }
})

// Animation For Download Page
function animationFlowDown(val1, val2) {
    setTimeout(() => {
        downloadContainer.css({
            opacity: val1,
            transform: `translateY(${val2}px)`,
        })
    }, 150);
}

// Get The Chosed Card From Json
function getTitle(title) {
    $(function () {
        $.getJSON("../js/all.json", function (data) {
            data = data.filter((e) => e.title.toLowerCase() === title.toLowerCase());
            placeDataToDownload(data);
        })
    })
}

// clear body & Create Downloading Page
function placeDataToDownload(data) {
    downloadContainer.html('');

    let heading = document.createElement('div');
    heading.className = 'heading';
    downloadContainer.append(heading);

    let headingText = document.createElement('h1');
    headingText.appendChild(document.createTextNode(data[0].title));
    heading.appendChild(headingText);

    let infoContainer = document.createElement('div');
    infoContainer.className = "info-container";
    downloadContainer.append(infoContainer);

    let img = document.createElement('img');
    img.src = `./../img/apps/${data[0].title}.jpg`;
    infoContainer.appendChild(img);
    
    let info = document.createElement("div");
    info.className = "info";
    infoContainer.appendChild(info);

    let infoText = document.createElement('h1');
    infoText.appendChild(document.createTextNode('Information'));
    info.appendChild(infoText);

    let div1 = document.createElement('div');

    let span1 = document.createElement('span');
    span1.appendChild(document.createTextNode('Version'));
    div1.appendChild(span1);

    let p1 = document.createElement('p');
    p1.appendChild(document.createTextNode(data[0].version));
    div1.appendChild(p1);
    
    let div2 = document.createElement('div');

    let span2 = document.createElement('span');
    span2.appendChild(document.createTextNode('Size'));
    div2.appendChild(span2);

    let p2 = document.createElement('p');
    p2.appendChild(document.createTextNode(data[0].size));
    div2.appendChild(p2);
    
    let div3 = document.createElement('div');

    let span3 = document.createElement('span');
    span3.appendChild(document.createTextNode('Operation System'));
    div3.appendChild(span3);

    let p3 = document.createElement('p');
    p3.appendChild(document.createTextNode(data[0].core));
    div3.appendChild(p3);
    
    let div4 = document.createElement('div');

    let span4 = document.createElement('span');
    span4.appendChild(document.createTextNode('Downloads'));
    div4.appendChild(span4);

    let p4 = document.createElement('p');
    p4.appendChild(document.createTextNode(data[0].downloads));
    div4.appendChild(p4);

    info.appendChild(div1);
    info.appendChild(div2);
    info.appendChild(div3);
    info.appendChild(div4);

    let a = document.createElement('a');
    // a.href = data[0].url;

    let button = document.createElement('button');
    button.className = 'reflect';
    button.appendChild(document.createTextNode('Download'))
    a.appendChild(button);

    let first = document.createElement('div');
    first.className = 'first';
    button.appendChild(first)

    info.appendChild(a);
}

// Notification For Report Useless Links
function turnOnNotification(e) {
    CTD = setTimeout(TON, 8000)

    function TON () {
        reportBtn.addClass('send-report')
    }
}
