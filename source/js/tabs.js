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