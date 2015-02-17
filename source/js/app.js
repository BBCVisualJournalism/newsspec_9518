define(['lib/news_special/bootstrap', 'lib/news_special/share_tools/controller'], function (news, shareTools) {

    // news.setStaticIframeHeight(2000);

    // news.hostPageSetup(function () {
    //     window.alert('sending instructions to the host page');
    //     document.body.style.background = 'red';
    // });

    // setTimeout(function () {
    //     news.pubsub.emit('istats', ['panel-clicked', 'newsspec-interaction', 3]);
    // }, 500);
    // setTimeout(function () {
    //     news.pubsub.emit('istats', ['quiz-end', 'newsspec-interaction', true]);
    // }, 2000);
    
    shareTools.init('.tempShareToolsHolder', {
        storyPageUrl: document.referrer,
        header:       'Share this page',
        message:      'Custom message',
        hashtag:      'BBCNewsGraphics',
        template:     'dropdown' // 'default' or 'dropdown'
    });

    news.sendMessageToremoveLoadingImage();
});