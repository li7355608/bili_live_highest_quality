// ==UserScript==
// @name         哔哩哔哩直播-自动切换最高画质
// @description  自动切换直播间画质为最高画质。
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @version      1.0
// @license      MIT
// ==/UserScript==

(async function() {
    'use strict';

    // 如果直播流是嵌套的，跳转到实际房间
    setInterval(() => {
        const nestedPage = document.querySelector('iframe[src*=blanc]');
        if (nestedPage) unsafeWindow.location.href = nestedPage.src;
    }, 1000);

    // 隐藏加载动画
    const styleElement = document.createElement('style');
    styleElement.textContent = `.web-player-loading { opacity: 0; }`;
    document.head.appendChild(styleElement);

    // 确保播放器已就绪
    await new Promise(resolve => {
        const timer = setInterval(() => {
            if (
                unsafeWindow.livePlayer
                && unsafeWindow.livePlayer.getPlayerInfo
                && unsafeWindow.livePlayer.getPlayerInfo().playurl
                && unsafeWindow.livePlayer.switchQuality
            ) {
                clearInterval(timer);
                resolve();
            }
        }, 1000);
    });

    // 获取视频源的初始路径名和最高画质编号
    const initialPathname = new URL(unsafeWindow.livePlayer.getPlayerInfo().playurl).pathname;
    const highestQualityNumber = unsafeWindow.livePlayer.getPlayerInfo().qualityCandidates[0].qn;

    // 切换画质
    setInterval(() => {
        const currentPathname = new URL(unsafeWindow.livePlayer.getPlayerInfo().playurl).pathname;
        const currentQualityNumber = unsafeWindow.livePlayer.getPlayerInfo().quality;
        if (currentPathname === initialPathname || currentQualityNumber !== highestQualityNumber) {
            unsafeWindow.livePlayer.switchQuality(highestQualityNumber);
        }
    }, 1000);

})();
