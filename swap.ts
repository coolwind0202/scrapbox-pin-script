import * as std from "https://raw.githubusercontent.com/takker99/scrapbox-userscript-std/main/mod.ts";
import { INTERVAL_PIN } from "./config.ts";
import type { Title } from "./action.ts";
import { getActions } from "./action.ts";


const sleep = (ms: number) => {
    const promise = new Promise<null>(resolve => {
        setTimeout(() => {
            resolve(null);
        }, ms);
    });

    return promise;
}

export const executeSwap = async (projectName: string, current: Title[], input: Title[], socket: Awaited<ReturnType<typeof std.makeSocket>>) => {
    const actions = getActions(current, input);
    console.log(actions);

    for (const action of actions) {
        if (action.type === "pin") {
            console.log(`${action.title} を pin`);
            await std.pin(projectName, action.title, { socket });
        } else if (action.type === "unpin") {
            console.log(`${action.title} を unpin`);
            await std.unpin(projectName, action.title, { socket });
        }
        console.log(`${INTERVAL_PIN}ms 待機します`)
        await sleep(INTERVAL_PIN);
        console.log("待機しました");
    }

    console.log("終わりました");
}