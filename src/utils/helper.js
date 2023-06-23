export const wrapEmojisInHtmlTag = (messageText) => {
    const regexEmoji = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu; // regex to match all Unicode emojis
    return messageText.replace(regexEmoji, (match) => {
        return `<span style="font-size:1.5em;margin:0 2px;position:relative;top:2px">${match}</span>`;
    });
};