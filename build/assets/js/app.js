const jsTriggersTabs = document.querySelectorAll('.js-tab-trigger[data-tab]');
const jsTriggersProducts = document.querySelectorAll('.js-tab-trigger[data-product]');

//,
//let jsActiveData; //= document.querySelectorAll('.js-tab-content.active');

jsTriggersTabs.forEach(function(trigger) {
    trigger.addEventListener('click', function() {
        let id,content,activeTrigger,activeContent;
        id = this.getAttribute('data-tab');
            content = document.querySelector('.js-tab-content[data-tab="'+id+'"]');
            activeTrigger = document.querySelector('.js-tab-trigger.active[data-tab]');
            activeContent = document.querySelector('.js-tab-content.active[data-tab]');

        activeTrigger.classList.remove('active'); // 1
        trigger.classList.add('active'); // 2
        activeContent.classList.remove('active');
        // 3
        content.classList.add('active'); // 4
    });
});
console.log(jsTriggersProducts);
jsTriggersProducts.forEach(function(trigger) {
    trigger.addEventListener('click', function() {
        let id,content,activeTrigger,activeContent;
        id = this.getAttribute('data-product');
        content = document.querySelector('.js-tab-content[data-product="'+id+'"]');
        activeTrigger = document.querySelector('.js-tab-trigger.active[data-product]');
        activeContent = document.querySelector('.js-tab-content.active[data-product]');

        activeTrigger.classList.remove('active'); // 1
        trigger.classList.add('active'); // 2
        activeContent.classList.remove('active');
        // 3
        content.classList.add('active'); // 4
    });
});
//Переменная для включения/отключения индикатора загрузки
var spinner = $('.ymap-container').children('.loader');
//Переменная для определения была ли хоть раз загружена Яндекс.Карта (чтобы избежать повторной загрузки при наведении)
var check_if_load = false;
//Необходимые переменные для того, чтобы задать координаты на Яндекс.Карте
let coord ={
    base : {
        coordinates: [44.932676, 34.044137],
    },
    mag : {
        coordinates: [44.938942, 34.060864]
    }
};

//Функция создания карты сайта и затем вставки ее в блок с идентификатором &#34;map-yandex&#34;
function init () {
    const myMap = new ymaps.Map("map-yandex", {
        center: [44.938942, 34.060864], // координаты центра на карте
        zoom: 13, // коэффициент приближения карты
        controls: ['zoomControl', 'fullscreenControl', 'routeButtonControl', 'trafficControl']

        // выбираем только те функции, которые необходимы при использовании
    });
    myMap.behaviors.disable('scrollZoom');
    //Массив опций карты
    const control = {
        endPoint: myMap.controls.get('routeButtonControl'),
        traficControl: myMap.controls.get('trafficControl')
    };

    control.traficControl.showTraffic();

    // Создадим объекты из их JSON-описания и добавим их на карту.
    window.myObjects = ymaps.geoQuery({
        type: "FeatureCollection",
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [44.932676, 34.044137]
                },
                options: {
                    preset: 'islands#redIcon',
                    name: '1',
                    address: 'Узловая, 20',
                    balloonContent: 'Аргентавто'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [44.938942, 34.060864]
                },
                options: {
                    preset: 'islands#blueIcon',
                    name: '2',
                    address: 'Героев Сталинграда, 3-А',
                    balloonContent: 'Motor Doctor'
                }
            },
        ]
    });//.addToMap(myMap);

    // Функция, которая по состоянию табов в меню
    // показывает или скрывает геообъекты из выборки.
    function showByTrigger() {
        let showActiveTrigger = document.querySelector('.js-tab-trigger.active[data-tab]');
        let data = showActiveTrigger.getAttribute('data-tab');
        let shownObjects;
        let byActiveClass = new ymaps.GeoQueryResult();
        byActiveClass = myObjects.search('options.name ="' + data + '"').add(byActiveClass);
        //console.log(showActiveTrigger.data);
        shownObjects = byActiveClass.addToMap(myMap);
        myObjects.remove(shownObjects).removeFromMap(myMap);
        // Программно установим конечную точку маршрута.
        let endPoint;
        if (data === '1') {
            endPoint = 'Симферополь, Узловая 20';
        } else if (data === '2') {
            endPoint = 'Симферополь, Героев Сталинграда, 3-A';
        }
        control.endPoint.routePanel.state.set('to', endPoint);
    }
    showByTrigger();
    // Получаем первый экземпляр коллекции слоев, потом первый слой коллекции
    let layer = myMap.layers.get(0).get(0);

        // Решение по callback-у для определения полной загрузки карты
        waitForTilesLoad(layer).then(function () {
            // Скрываем индикатор загрузки после полной загрузки карты
            spinner.removeClass('is-active');
        });

        if(check_if_load){
            let jsTrigger = document.querySelectorAll('.js-tab-trigger[data-tab]');
            jsTrigger.forEach(
                function(trigger) {
                    trigger.addEventListener('click' || 'touch', showByTrigger)
                }
            );
        }

}

// Функция для определения полной загрузки карты (на самом деле проверяется загрузка тайлов)
function waitForTilesLoad(layer) {
    return new ymaps.vow.Promise(function (resolve, reject) {
        var tc = getTileContainer(layer), readyAll = true;
        tc.tiles.each(function (tile, number) {
            if (!tile.isReady()) {
                readyAll = false;
            }
        });
        if (readyAll) {
            resolve();
        } else {
            tc.events.once("ready", function() {
                resolve();
            });
        }
    });
}

function getTileContainer(layer) {
    for (var k in layer) {
        if (layer.hasOwnProperty(k)) {
            if (
                layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer
                || layer[k] instanceof ymaps.layer.tileContainer.DomContainer
            ) {
                return layer[k];
            }
        }
    }
    return null;
}

// Функция загрузки API Яндекс.Карт по требованию (в нашем случае при наведении)
function loadScript(url, callback){
    var script = document.createElement("script");

    if (script.readyState){  // IE
        script.onreadystatechange = function(){
            if (script.readyState === "loaded" ||
                script.readyState === "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  // Другие браузеры
        script.onload = function(){
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

// Основная функция, которая проверяет когда мы навели на блок с классом &#34;ymap-container&#34;
var ymap = function() {
    $('.ymap-container').click(function(){
            if (!check_if_load) { // проверяем первый ли раз загружается Яндекс.Карта, если да, то загружаем

                // Чтобы не было повторной загрузки карты, мы изменяем значение переменной
                check_if_load = true;

                // Показываем индикатор загрузки до тех пор, пока карта не загрузится
                spinner.addClass('is-active');

                // Загружаем API Яндекс.Карт
                loadScript("https://api-maps.yandex.ru/2.1/?&api=a7919ed5-869a-47f4-8d4c-7cc426de9d6e&lang=ru_RU&amp;loadByRequire=1", function(){
                    // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором &#34;map-yandex&#34;
                    ymaps.load(init);

                });
            }
        }
    );
};

$(function() {
    //Запускаем основную функцию
    ymap();
});


let slider = tns({
    container: '.slider-data-1',
    items: 1,
    responsive: {
        640: {
            edgePadding: 20,
            gutter: 10,
            items: 2
        },
        700: {
            gutter: 30
        },
        900: {
            items: 3,
            edgePadding: 20,
            gutter: 10,
        }
    }
});
let slider2 = tns({
    container: '.slider-data-2',
    items: 1,
    responsive: {
        640: {
            edgePadding: 20,
            gutter: 20,
            items: 2
        },
        700: {
            gutter: 30
        },
        900: {
            items: 2
        }
    }
});
let slider3 = tns({
    container: '.slider-data-3',
    items: 1,
    responsive: {
        640: {
            edgePadding: 20,
            gutter: 20,
            items: 2
        },
        700: {
            gutter: 30
        },
        900: {
            items: 2
        }
    }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhYnMuanMiLCJtYXAuanMiLCJhcHAuanMiLCJ0bnNTZXR0aW5ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6TEE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBqc1RyaWdnZXJzVGFicyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy10YWItdHJpZ2dlcltkYXRhLXRhYl0nKTtcclxuY29uc3QganNUcmlnZ2Vyc1Byb2R1Y3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXRhYi10cmlnZ2VyW2RhdGEtcHJvZHVjdF0nKTtcclxuXHJcbi8vLFxyXG4vL2xldCBqc0FjdGl2ZURhdGE7IC8vPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdGFiLWNvbnRlbnQuYWN0aXZlJyk7XHJcblxyXG5qc1RyaWdnZXJzVGFicy5mb3JFYWNoKGZ1bmN0aW9uKHRyaWdnZXIpIHtcclxuICAgIHRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgaWQsY29udGVudCxhY3RpdmVUcmlnZ2VyLGFjdGl2ZUNvbnRlbnQ7XHJcbiAgICAgICAgaWQgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS10YWInKTtcclxuICAgICAgICAgICAgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy10YWItY29udGVudFtkYXRhLXRhYj1cIicraWQrJ1wiXScpO1xyXG4gICAgICAgICAgICBhY3RpdmVUcmlnZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXRhYi10cmlnZ2VyLmFjdGl2ZVtkYXRhLXRhYl0nKTtcclxuICAgICAgICAgICAgYWN0aXZlQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy10YWItY29udGVudC5hY3RpdmVbZGF0YS10YWJdJyk7XHJcblxyXG4gICAgICAgIGFjdGl2ZVRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7IC8vIDFcclxuICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpOyAvLyAyXHJcbiAgICAgICAgYWN0aXZlQ29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAvLyAzXHJcbiAgICAgICAgY29udGVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTsgLy8gNFxyXG4gICAgfSk7XHJcbn0pO1xyXG5jb25zb2xlLmxvZyhqc1RyaWdnZXJzUHJvZHVjdHMpO1xyXG5qc1RyaWdnZXJzUHJvZHVjdHMuZm9yRWFjaChmdW5jdGlvbih0cmlnZ2VyKSB7XHJcbiAgICB0cmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGlkLGNvbnRlbnQsYWN0aXZlVHJpZ2dlcixhY3RpdmVDb250ZW50O1xyXG4gICAgICAgIGlkID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZHVjdCcpO1xyXG4gICAgICAgIGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtdGFiLWNvbnRlbnRbZGF0YS1wcm9kdWN0PVwiJytpZCsnXCJdJyk7XHJcbiAgICAgICAgYWN0aXZlVHJpZ2dlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy10YWItdHJpZ2dlci5hY3RpdmVbZGF0YS1wcm9kdWN0XScpO1xyXG4gICAgICAgIGFjdGl2ZUNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtdGFiLWNvbnRlbnQuYWN0aXZlW2RhdGEtcHJvZHVjdF0nKTtcclxuXHJcbiAgICAgICAgYWN0aXZlVHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTsgLy8gMVxyXG4gICAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7IC8vIDJcclxuICAgICAgICBhY3RpdmVDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgIC8vIDNcclxuICAgICAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpOyAvLyA0XHJcbiAgICB9KTtcclxufSk7IiwiLy/Qn9C10YDQtdC80LXQvdC90LDRjyDQtNC70Y8g0LLQutC70Y7Rh9C10L3QuNGPL9C+0YLQutC70Y7Rh9C10L3QuNGPINC40L3QtNC40LrQsNGC0L7RgNCwINC30LDQs9GA0YPQt9C60LhcclxudmFyIHNwaW5uZXIgPSAkKCcueW1hcC1jb250YWluZXInKS5jaGlsZHJlbignLmxvYWRlcicpO1xyXG4vL9Cf0LXRgNC10LzQtdC90L3QsNGPINC00LvRjyDQvtC/0YDQtdC00LXQu9C10L3QuNGPINCx0YvQu9CwINC70Lgg0YXQvtGC0Ywg0YDQsNC3INC30LDQs9GA0YPQttC10L3QsCDQr9C90LTQtdC60YEu0JrQsNGA0YLQsCAo0YfRgtC+0LHRiyDQuNC30LHQtdC20LDRgtGMINC/0L7QstGC0L7RgNC90L7QuSDQt9Cw0LPRgNGD0LfQutC4INC/0YDQuCDQvdCw0LLQtdC00LXQvdC40LgpXHJcbnZhciBjaGVja19pZl9sb2FkID0gZmFsc2U7XHJcbi8v0J3QtdC+0LHRhdC+0LTQuNC80YvQtSDQv9C10YDQtdC80LXQvdC90YvQtSDQtNC70Y8g0YLQvtCz0L4sINGH0YLQvtCx0Ysg0LfQsNC00LDRgtGMINC60L7QvtGA0LTQuNC90LDRgtGLINC90LAg0K/QvdC00LXQutGBLtCa0LDRgNGC0LVcclxubGV0IGNvb3JkID17XHJcbiAgICBiYXNlIDoge1xyXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbNDQuOTMyNjc2LCAzNC4wNDQxMzddLFxyXG4gICAgfSxcclxuICAgIG1hZyA6IHtcclxuICAgICAgICBjb29yZGluYXRlczogWzQ0LjkzODk0MiwgMzQuMDYwODY0XVxyXG4gICAgfVxyXG59O1xyXG5cclxuLy/QpNGD0L3QutGG0LjRjyDRgdC+0LfQtNCw0L3QuNGPINC60LDRgNGC0Ysg0YHQsNC50YLQsCDQuCDQt9Cw0YLQtdC8INCy0YHRgtCw0LLQutC4INC10LUg0LIg0LHQu9C+0Log0YEg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8ICYjMzQ7bWFwLXlhbmRleCYjMzQ7XHJcbmZ1bmN0aW9uIGluaXQgKCkge1xyXG4gICAgY29uc3QgbXlNYXAgPSBuZXcgeW1hcHMuTWFwKFwibWFwLXlhbmRleFwiLCB7XHJcbiAgICAgICAgY2VudGVyOiBbNDQuOTM4OTQyLCAzNC4wNjA4NjRdLCAvLyDQutC+0L7RgNC00LjQvdCw0YLRiyDRhtC10L3RgtGA0LAg0L3QsCDQutCw0YDRgtC1XHJcbiAgICAgICAgem9vbTogMTMsIC8vINC60L7RjdGE0YTQuNGG0LjQtdC90YIg0L/RgNC40LHQu9C40LbQtdC90LjRjyDQutCw0YDRgtGLXHJcbiAgICAgICAgY29udHJvbHM6IFsnem9vbUNvbnRyb2wnLCAnZnVsbHNjcmVlbkNvbnRyb2wnLCAncm91dGVCdXR0b25Db250cm9sJywgJ3RyYWZmaWNDb250cm9sJ11cclxuXHJcbiAgICAgICAgLy8g0LLRi9Cx0LjRgNCw0LXQvCDRgtC+0LvRjNC60L4g0YLQtSDRhNGD0L3QutGG0LjQuCwg0LrQvtGC0L7RgNGL0LUg0L3QtdC+0LHRhdC+0LTQuNC80Ysg0L/RgNC4INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC4XHJcbiAgICB9KTtcclxuICAgIG15TWFwLmJlaGF2aW9ycy5kaXNhYmxlKCdzY3JvbGxab29tJyk7XHJcbiAgICAvL9Cc0LDRgdGB0LjQsiDQvtC/0YbQuNC5INC60LDRgNGC0YtcclxuICAgIGNvbnN0IGNvbnRyb2wgPSB7XHJcbiAgICAgICAgZW5kUG9pbnQ6IG15TWFwLmNvbnRyb2xzLmdldCgncm91dGVCdXR0b25Db250cm9sJyksXHJcbiAgICAgICAgdHJhZmljQ29udHJvbDogbXlNYXAuY29udHJvbHMuZ2V0KCd0cmFmZmljQ29udHJvbCcpXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnRyb2wudHJhZmljQ29udHJvbC5zaG93VHJhZmZpYygpO1xyXG5cclxuICAgIC8vINCh0L7Qt9C00LDQtNC40Lwg0L7QsdGK0LXQutGC0Ysg0LjQtyDQuNGFIEpTT04t0L7Qv9C40YHQsNC90LjRjyDQuCDQtNC+0LHQsNCy0LjQvCDQuNGFINC90LAg0LrQsNGA0YLRgy5cclxuICAgIHdpbmRvdy5teU9iamVjdHMgPSB5bWFwcy5nZW9RdWVyeSh7XHJcbiAgICAgICAgdHlwZTogXCJGZWF0dXJlQ29sbGVjdGlvblwiLFxyXG4gICAgICAgIGZlYXR1cmVzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcclxuICAgICAgICAgICAgICAgIGdlb21ldHJ5OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BvaW50JyxcclxuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlczogWzQ0LjkzMjY3NiwgMzQuMDQ0MTM3XVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBwcmVzZXQ6ICdpc2xhbmRzI3JlZEljb24nLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICcxJyxcclxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiAn0KPQt9C70L7QstCw0Y8sIDIwJyxcclxuICAgICAgICAgICAgICAgICAgICBiYWxsb29uQ29udGVudDogJ9CQ0YDQs9C10L3RgtCw0LLRgtC+J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnRmVhdHVyZScsXHJcbiAgICAgICAgICAgICAgICBnZW9tZXRyeToge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQb2ludCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFs0NC45Mzg5NDIsIDM0LjA2MDg2NF1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJlc2V0OiAnaXNsYW5kcyNibHVlSWNvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJzInLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6ICfQk9C10YDQvtC10LIg0KHRgtCw0LvQuNC90LPRgNCw0LTQsCwgMy3QkCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFsbG9vbkNvbnRlbnQ6ICdNb3RvciBEb2N0b3InXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXVxyXG4gICAgfSk7Ly8uYWRkVG9NYXAobXlNYXApO1xyXG5cclxuICAgIC8vINCk0YPQvdC60YbQuNGPLCDQutC+0YLQvtGA0LDRjyDQv9C+INGB0L7RgdGC0L7Rj9C90LjRjiDRgtCw0LHQvtCyINCyINC80LXQvdGOXHJcbiAgICAvLyDQv9C+0LrQsNC30YvQstCw0LXRgiDQuNC70Lgg0YHQutGA0YvQstCw0LXRgiDQs9C10L7QvtCx0YrQtdC60YLRiyDQuNC3INCy0YvQsdC+0YDQutC4LlxyXG4gICAgZnVuY3Rpb24gc2hvd0J5VHJpZ2dlcigpIHtcclxuICAgICAgICBsZXQgc2hvd0FjdGl2ZVRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtdGFiLXRyaWdnZXIuYWN0aXZlW2RhdGEtdGFiXScpO1xyXG4gICAgICAgIGxldCBkYXRhID0gc2hvd0FjdGl2ZVRyaWdnZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXRhYicpO1xyXG4gICAgICAgIGxldCBzaG93bk9iamVjdHM7XHJcbiAgICAgICAgbGV0IGJ5QWN0aXZlQ2xhc3MgPSBuZXcgeW1hcHMuR2VvUXVlcnlSZXN1bHQoKTtcclxuICAgICAgICBieUFjdGl2ZUNsYXNzID0gbXlPYmplY3RzLnNlYXJjaCgnb3B0aW9ucy5uYW1lID1cIicgKyBkYXRhICsgJ1wiJykuYWRkKGJ5QWN0aXZlQ2xhc3MpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coc2hvd0FjdGl2ZVRyaWdnZXIuZGF0YSk7XHJcbiAgICAgICAgc2hvd25PYmplY3RzID0gYnlBY3RpdmVDbGFzcy5hZGRUb01hcChteU1hcCk7XHJcbiAgICAgICAgbXlPYmplY3RzLnJlbW92ZShzaG93bk9iamVjdHMpLnJlbW92ZUZyb21NYXAobXlNYXApO1xyXG4gICAgICAgIC8vINCf0YDQvtCz0YDQsNC80LzQvdC+INGD0YHRgtCw0L3QvtCy0LjQvCDQutC+0L3QtdGH0L3Rg9GOINGC0L7Rh9C60YMg0LzQsNGA0YjRgNGD0YLQsC5cclxuICAgICAgICBsZXQgZW5kUG9pbnQ7XHJcbiAgICAgICAgaWYgKGRhdGEgPT09ICcxJykge1xyXG4gICAgICAgICAgICBlbmRQb2ludCA9ICfQodC40LzRhNC10YDQvtC/0L7Qu9GMLCDQo9C30LvQvtCy0LDRjyAyMCc7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhID09PSAnMicpIHtcclxuICAgICAgICAgICAgZW5kUG9pbnQgPSAn0KHQuNC80YTQtdGA0L7Qv9C+0LvRjCwg0JPQtdGA0L7QtdCyINCh0YLQsNC70LjQvdCz0YDQsNC00LAsIDMtQSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRyb2wuZW5kUG9pbnQucm91dGVQYW5lbC5zdGF0ZS5zZXQoJ3RvJywgZW5kUG9pbnQpO1xyXG4gICAgfVxyXG4gICAgc2hvd0J5VHJpZ2dlcigpO1xyXG4gICAgLy8g0J/QvtC70YPRh9Cw0LXQvCDQv9C10YDQstGL0Lkg0Y3QutC30LXQvNC/0LvRj9GAINC60L7Qu9C70LXQutGG0LjQuCDRgdC70L7QtdCyLCDQv9C+0YLQvtC8INC/0LXRgNCy0YvQuSDRgdC70L7QuSDQutC+0LvQu9C10LrRhtC40LhcclxuICAgIGxldCBsYXllciA9IG15TWFwLmxheWVycy5nZXQoMCkuZ2V0KDApO1xyXG5cclxuICAgICAgICAvLyDQoNC10YjQtdC90LjQtSDQv9C+IGNhbGxiYWNrLdGDINC00LvRjyDQvtC/0YDQtdC00LXQu9C10L3QuNGPINC/0L7Qu9C90L7QuSDQt9Cw0LPRgNGD0LfQutC4INC60LDRgNGC0YtcclxuICAgICAgICB3YWl0Rm9yVGlsZXNMb2FkKGxheWVyKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8g0KHQutGA0YvQstCw0LXQvCDQuNC90LTQuNC60LDRgtC+0YAg0LfQsNCz0YDRg9C30LrQuCDQv9C+0YHQu9C1INC/0L7Qu9C90L7QuSDQt9Cw0LPRgNGD0LfQutC4INC60LDRgNGC0YtcclxuICAgICAgICAgICAgc3Bpbm5lci5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKGNoZWNrX2lmX2xvYWQpe1xyXG4gICAgICAgICAgICBsZXQganNUcmlnZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXRhYi10cmlnZ2VyW2RhdGEtdGFiXScpO1xyXG4gICAgICAgICAgICBqc1RyaWdnZXIuZm9yRWFjaChcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKHRyaWdnZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyB8fCAndG91Y2gnLCBzaG93QnlUcmlnZ2VyKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbn1cclxuXHJcbi8vINCk0YPQvdC60YbQuNGPINC00LvRjyDQvtC/0YDQtdC00LXQu9C10L3QuNGPINC/0L7Qu9C90L7QuSDQt9Cw0LPRgNGD0LfQutC4INC60LDRgNGC0YsgKNC90LAg0YHQsNC80L7QvCDQtNC10LvQtSDQv9GA0L7QstC10YDRj9C10YLRgdGPINC30LDQs9GA0YPQt9C60LAg0YLQsNC50LvQvtCyKVxyXG5mdW5jdGlvbiB3YWl0Rm9yVGlsZXNMb2FkKGxheWVyKSB7XHJcbiAgICByZXR1cm4gbmV3IHltYXBzLnZvdy5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICB2YXIgdGMgPSBnZXRUaWxlQ29udGFpbmVyKGxheWVyKSwgcmVhZHlBbGwgPSB0cnVlO1xyXG4gICAgICAgIHRjLnRpbGVzLmVhY2goZnVuY3Rpb24gKHRpbGUsIG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAoIXRpbGUuaXNSZWFkeSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZWFkeUFsbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHJlYWR5QWxsKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0Yy5ldmVudHMub25jZShcInJlYWR5XCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VGlsZUNvbnRhaW5lcihsYXllcikge1xyXG4gICAgZm9yICh2YXIgayBpbiBsYXllcikge1xyXG4gICAgICAgIGlmIChsYXllci5oYXNPd25Qcm9wZXJ0eShrKSkge1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBsYXllcltrXSBpbnN0YW5jZW9mIHltYXBzLmxheWVyLnRpbGVDb250YWluZXIuQ2FudmFzQ29udGFpbmVyXHJcbiAgICAgICAgICAgICAgICB8fCBsYXllcltrXSBpbnN0YW5jZW9mIHltYXBzLmxheWVyLnRpbGVDb250YWluZXIuRG9tQ29udGFpbmVyXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxheWVyW2tdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbi8vINCk0YPQvdC60YbQuNGPINC30LDQs9GA0YPQt9C60LggQVBJINCv0L3QtNC10LrRgS7QmtCw0YDRgiDQv9C+INGC0YDQtdCx0L7QstCw0L3QuNGOICjQsiDQvdCw0YjQtdC8INGB0LvRg9GH0LDQtSDQv9GA0Lgg0L3QsNCy0LXQtNC10L3QuNC4KVxyXG5mdW5jdGlvbiBsb2FkU2NyaXB0KHVybCwgY2FsbGJhY2spe1xyXG4gICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcblxyXG4gICAgaWYgKHNjcmlwdC5yZWFkeVN0YXRlKXsgIC8vIElFXHJcbiAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGlmIChzY3JpcHQucmVhZHlTdGF0ZSA9PT0gXCJsb2FkZWRcIiB8fFxyXG4gICAgICAgICAgICAgICAgc2NyaXB0LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIil7XHJcbiAgICAgICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfSBlbHNlIHsgIC8vINCU0YDRg9Cz0LjQtSDQsdGA0LDRg9C30LXRgNGLXHJcbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHNjcmlwdC5zcmMgPSB1cmw7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxufVxyXG5cclxuLy8g0J7RgdC90L7QstC90LDRjyDRhNGD0L3QutGG0LjRjywg0LrQvtGC0L7RgNCw0Y8g0L/RgNC+0LLQtdGA0Y/QtdGCINC60L7Qs9C00LAg0LzRiyDQvdCw0LLQtdC70Lgg0L3QsCDQsdC70L7QuiDRgSDQutC70LDRgdGB0L7QvCAmIzM0O3ltYXAtY29udGFpbmVyJiMzNDtcclxudmFyIHltYXAgPSBmdW5jdGlvbigpIHtcclxuICAgICQoJy55bWFwLWNvbnRhaW5lcicpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGlmICghY2hlY2tfaWZfbG9hZCkgeyAvLyDQv9GA0L7QstC10YDRj9C10Lwg0L/QtdGA0LLRi9C5INC70Lgg0YDQsNC3INC30LDQs9GA0YPQttCw0LXRgtGB0Y8g0K/QvdC00LXQutGBLtCa0LDRgNGC0LAsINC10YHQu9C4INC00LAsINGC0L4g0LfQsNCz0YDRg9C20LDQtdC8XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0KfRgtC+0LHRiyDQvdC1INCx0YvQu9C+INC/0L7QstGC0L7RgNC90L7QuSDQt9Cw0LPRgNGD0LfQutC4INC60LDRgNGC0YssINC80Ysg0LjQt9C80LXQvdGP0LXQvCDQt9C90LDRh9C10L3QuNC1INC/0LXRgNC10LzQtdC90L3QvtC5XHJcbiAgICAgICAgICAgICAgICBjaGVja19pZl9sb2FkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDQn9C+0LrQsNC30YvQstCw0LXQvCDQuNC90LTQuNC60LDRgtC+0YAg0LfQsNCz0YDRg9C30LrQuCDQtNC+INGC0LXRhSDQv9C+0YAsINC/0L7QutCwINC60LDRgNGC0LAg0L3QtSDQt9Cw0LPRgNGD0LfQuNGC0YHRj1xyXG4gICAgICAgICAgICAgICAgc3Bpbm5lci5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g0JfQsNCz0YDRg9C20LDQtdC8IEFQSSDQr9C90LTQtdC60YEu0JrQsNGA0YJcclxuICAgICAgICAgICAgICAgIGxvYWRTY3JpcHQoXCJodHRwczovL2FwaS1tYXBzLnlhbmRleC5ydS8yLjEvPyZhcGk9YTc5MTllZDUtODY5YS00N2Y0LThkNGMtN2NjNDI2ZGU5ZDZlJmxhbmc9cnVfUlUmYW1wO2xvYWRCeVJlcXVpcmU9MVwiLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIC8vINCa0LDQuiDRgtC+0LvRjNC60L4gQVBJINCv0L3QtNC10LrRgS7QmtCw0YDRgiDQt9Cw0LPRgNGD0LfQuNC70LjRgdGMLCDRgdGA0LDQt9GDINGE0L7RgNC80LjRgNGD0LXQvCDQutCw0YDRgtGDINC4INC/0L7QvNC10YnQsNC10Lwg0LIg0LHQu9C+0Log0YEg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQvtC8ICYjMzQ7bWFwLXlhbmRleCYjMzQ7XHJcbiAgICAgICAgICAgICAgICAgICAgeW1hcHMubG9hZChpbml0KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn07XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG4gICAgLy/Ql9Cw0L/Rg9GB0LrQsNC10Lwg0L7RgdC90L7QstC90YPRjiDRhNGD0L3QutGG0LjRjlxyXG4gICAgeW1hcCgpO1xyXG59KTsiLCIiLCJcclxubGV0IHNsaWRlciA9IHRucyh7XHJcbiAgICBjb250YWluZXI6ICcuc2xpZGVyLWRhdGEtMScsXHJcbiAgICBpdGVtczogMSxcclxuICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICA2NDA6IHtcclxuICAgICAgICAgICAgZWRnZVBhZGRpbmc6IDIwLFxyXG4gICAgICAgICAgICBndXR0ZXI6IDEwLFxyXG4gICAgICAgICAgICBpdGVtczogMlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgNzAwOiB7XHJcbiAgICAgICAgICAgIGd1dHRlcjogMzBcclxuICAgICAgICB9LFxyXG4gICAgICAgIDkwMDoge1xyXG4gICAgICAgICAgICBpdGVtczogMyxcclxuICAgICAgICAgICAgZWRnZVBhZGRpbmc6IDIwLFxyXG4gICAgICAgICAgICBndXR0ZXI6IDEwLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcbmxldCBzbGlkZXIyID0gdG5zKHtcclxuICAgIGNvbnRhaW5lcjogJy5zbGlkZXItZGF0YS0yJyxcclxuICAgIGl0ZW1zOiAxLFxyXG4gICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgIDY0MDoge1xyXG4gICAgICAgICAgICBlZGdlUGFkZGluZzogMjAsXHJcbiAgICAgICAgICAgIGd1dHRlcjogMjAsXHJcbiAgICAgICAgICAgIGl0ZW1zOiAyXHJcbiAgICAgICAgfSxcclxuICAgICAgICA3MDA6IHtcclxuICAgICAgICAgICAgZ3V0dGVyOiAzMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgOTAwOiB7XHJcbiAgICAgICAgICAgIGl0ZW1zOiAyXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxubGV0IHNsaWRlcjMgPSB0bnMoe1xyXG4gICAgY29udGFpbmVyOiAnLnNsaWRlci1kYXRhLTMnLFxyXG4gICAgaXRlbXM6IDEsXHJcbiAgICByZXNwb25zaXZlOiB7XHJcbiAgICAgICAgNjQwOiB7XHJcbiAgICAgICAgICAgIGVkZ2VQYWRkaW5nOiAyMCxcclxuICAgICAgICAgICAgZ3V0dGVyOiAyMCxcclxuICAgICAgICAgICAgaXRlbXM6IDJcclxuICAgICAgICB9LFxyXG4gICAgICAgIDcwMDoge1xyXG4gICAgICAgICAgICBndXR0ZXI6IDMwXHJcbiAgICAgICAgfSxcclxuICAgICAgICA5MDA6IHtcclxuICAgICAgICAgICAgaXRlbXM6IDJcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG4iXX0=
