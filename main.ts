import { getActions }  from "./action.ts";

console.log(getActions(["c", "b", "a", "e", "d"],["a", "b", "c", "d", "e"]))
console.log(getActions(["2"], ["2", "unpin1"]));
console.log(getActions(["2"], ["2"]))