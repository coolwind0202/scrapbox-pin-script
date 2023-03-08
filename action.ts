export type Title = string;

type UnpinAction = {
    type: "unpin",
    title: string
};

type PinAction = {
    type: "pin",
    title: string
};

type Action = UnpinAction | PinAction;

export const getActions = (current: Title[], input: Title[]): Action[] => {
    /*
        まず、input になくて、current にはあるものは、unpin して、後で pin し直す必要もありません。
    */

    const unpinActions: UnpinAction[] = current.filter(title => !input.includes(title)).map(title => ({ type: "unpin", title }));

    /*
        そして、不要になったページを除いたリストを作成します。
    */

    const required = current.filter(title => input.includes(title));

    let tmp = [...required];

    /* 
        入力されたページについて考えます。

        input をループして、漸次的に現在ピン留めしたいページを考えます。

        ページAをピン留めする際は、 tmp (処理に利用するrequiredの暫定的なコピー)を順番に見て、Aより前にあるものを unpin します。
        すなわち、tmp でループして、Aでないものを unpin します。このとき、 tmp からAでないものを削除します。

        tmp のループで A が見つかった場合は、それ以前の順番通りでない要素は tmp 内には存在しないことが保証できるため、それ以前の要素は順番通りです。
        つまり、この時点において、A までの tmp と input のスライスは一致することが保証できます。
        したがって、input の次の要素へループを移します。

        tmp のループ変数が最後まで到達していたら、 A を pin します。
    */

    let n = 0;
    let m = 0;
    const pinActions: PinAction[] = [];

    while (n < input.length) {
        if (m === tmp.length) {
            pinActions.push({
                type: "pin",
                title: input[n]
            });

            tmp.push(input[n]);

            console.log(`リストに ${input[n]} を push`);
            console.log(tmp);
        }

        while (m < tmp.length) {
            const a = input[n];
            const b = tmp[m];

            console.log(`a = ${a}, b = ${b}`)

            if (a !== b) {
                unpinActions.push({
                    type: "unpin",
                    title: b
                });

                console.log(`リストから ${b} を削除： ${tmp.slice(0, m)} + ${tmp.slice(m + 1)} (n = ${n}, m = ${m})`);
                
                tmp = tmp.slice(0, m).concat(tmp.slice(m + 1));

                console.log(tmp);
            } else {
                /*
                    m 以前の tmp の要素と、n 以前の input の要素は一致していることが保証できます。
                */

                console.log(`${tmp}, ${input}, (n = ${n}, m = ${m})`)

                console.log(`一致しているか？：${tmp.slice(0, m + 1)}, ${input.slice(0, n + 1)}`)

                n++;
                m++;
            }
        }
    }

    console.log(n);

    return [...unpinActions, ...pinActions];
}