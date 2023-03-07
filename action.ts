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

    let n = 0;
    let m = 0;
    let isLastEqual = false;

    while (n < input.length) {
        while (m < required.length) {
            const a = input[n];
            const b = required[m];

            m++;

            if (a !== b) {
                unpinActions.push({
                    type: "unpin",
                    title: b
                });
                isLastEqual = false;
            } else {
                isLastEqual = true;
                break;
            }

            /*
                方針は、 input の要素を順番に見て、その要素と一致しない required の要素は一度 unpin する必要がある。という考えに基づく。
                たとえば、 
                    c b a e d
                と並んだページを
                    a b c d e
                と並べたいときは、c と b は一度 unpin する必要があることがわかる。なぜなら、 a の前にこの2つは来てはいけないから。

                このことを、 a と一致するまで required の要素を見て、 a と一致したら次は b を使って required の要素を見る、というコードで表現する。


                そして、unpin をする手順は上に書いたルールさえ守れば自由です。問題は pin をする手順です。
                pin をする手順の作り方は、 unpin した手順を、input に従ってソートすることです。
                例えば、 c, b, e, d を unpin したなら、 pin する手順は b, c, d, e である必要があります。

                これはスライスを使って表現します。

                上の例では、 input が最後に順番どおりであったのは a でした。
                現在のコードは、requiredのループが最後まで回るとinputのループも終わって、 n = 1 となるようにかかれています。

                そして、c, b, e, d は unpin されますが、このとき pin の手順は、input.slice(1)に等しいです。
                これは意味的には、unpin されるもの、すなわち pin すべきものは順番どおりにならなかったものであり、input.slice(n)がこれに対応するからです。


                input のうち、required の中に一致する要素が見つかったものは、順番どおりになっている要素が required に存在するということです。
                これらに対して pin を考える必要はありません。

                しかし、最後まで一致することのなかった要素と、それ以降の input の要素は、あとで pin する必要があります。
                これは、input.slice(n)に等しいです。
            */
        }
        
        if (m === required.length) {
            /*
                もし、最後に見た required の要素が、 input と一致していたなら、実際に pin が必要なのはその次の要素であるから、n++ は必要。
                しかし、一致していなかったなら、その input の要素も含めて pin が必要だから、 n++ が必要ない。
            */

            console.log(input[n], required[m - 1]);

            if (isLastEqual) {
                console.log("一致した")
                n++;
            }
            break;
        } else {
            n++;
        }

    }

    console.log(n);

    const pinActions: PinAction[] = input.slice(n).map(title => ({
        type: "pin",
        title  
    }));

    return [...unpinActions, ...pinActions];
}