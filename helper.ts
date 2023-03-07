import * as std from "https://raw.githubusercontent.com/takker99/scrapbox-userscript-std/main/mod.ts";

export const browser = {
    getPageName() {
        const match = window.location.href.match(/https:\/\/scrapbox.io\/.+\/(.*)/);
        if (match === null) return null;

        return match[1] || null;
    },

    getProjectName() {
        const match = window.location.href.match(/https:\/\/scrapbox.io\/(.+)\/.*/);

        if (match === null) return null;

        return match[1] || null;
    }
}

export const fetchPinPages = async (projectName: string) => {
    const pages = await std.listPages(projectName);

    if (!pages.ok) throw new Error("listPages failed");

    return pages.value.pages.filter(page => page.pin);
}

export const trimLineTexts = (texts: string[]) => {
    /*
        1行目と空行を削除する
    */

    const contents = texts.slice(1);

    return contents.filter(content => content !== "");
}