import * as std from "https://raw.githubusercontent.com/takker99/scrapbox-userscript-std/main/mod.ts";
import type { Scrapbox, BasePage } from "https://raw.githubusercontent.com/scrapbox-jp/types/0.3.6/userscript.ts";
import { browser, fetchPinPages, trimLineTexts } from "./helper.ts";
import { executeSwap } from "./swap.ts";

const main = (scrapbox: Scrapbox) => {
    scrapbox.PageMenu.addItem({
        title: "ピン留めの一覧ページを作る",
        onClick: () => {
            const projectName = browser.getProjectName();

            if (projectName === null) {
                alert("プロジェクト名の取得に失敗しました。");
                return;
            }

            fetchPinPages(projectName)
                .then(pages => {
                    std.open(projectName, `ピン留め一覧/${new Date().valueOf()}`, {
                        newTab: true,
                        body: pages.map(page => page.title).join("\n")
                    });
                })
                .catch (() => {
                    alert("ページの一覧の取得に失敗しました。");
                    return;
                });
        }
    });

    scrapbox.PageMenu.addItem({
        title: "ピン留め一覧ページの編集を完了する",
        onClick: async () => {
            const projectName = browser.getProjectName();
            const pageName = browser.getPageName();

            if (projectName === null) {
                alert("プロジェクト名の取得に失敗しました。");
                return;
            }

            if (pageName === null || decodeURI(pageName).match(/ピン留め一覧%2F\d+/) === null) {
                alert("まずは、「ピン留めの一覧ページを作る」ボタンを先に押してください。\nまた、このボタンは作成したピン留め一覧ページで押してください。");
                return;
            }

            const lines = scrapbox.Page.lines?.map(line => line.text);

            // Q. lines にタイトル行は含まれるの？
            // A. 含まれます。空行も、含まれます。

            if (lines === undefined) {
                alert("ページ内容の取得に失敗しました。");
                return;
            }

            const inputs = trimLineTexts(lines);

            const permitted = confirm("これからピン留めの入れ替えを始めます。よろしいですか？");

            if (!permitted) return;

            const socket = await std.makeSocket();
            await socket.connect();

            let pages: BasePage[];
            
            try {
                pages = await fetchPinPages(projectName);
            } catch {
                alert("ピン留めの一覧の取得に失敗しました。");
                return;
            }

            try {
                await executeSwap(projectName, pages.map(page => page.title), inputs, socket);
            } catch {
                alert("ピン留めの入れ替えに失敗しました。");
                return;
            }
            
            const willDelete = confirm("入れ替えが完了しました。入れ替えに使用したピン留め一覧のページを削除しますか？");

            if (!willDelete) return;

            try {
                await std.deletePage(projectName, pageName, { socket });
            } catch {
                alert("入れ替えに使用したピン留め一覧のページの削除に失敗しました。");
                return;
            }

            alert("入れ替えに使用したピン留め一覧のページの削除が完了しました。")

        }
    });

}

{/* @ts-ignore */}
main(scrapbox);