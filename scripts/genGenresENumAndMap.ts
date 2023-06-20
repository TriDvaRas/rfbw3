import _ from "lodash";
import globalConfig from "../src/globalConfig";
import fs from "fs";
const all = globalConfig.genres.games.concat(globalConfig.genres.anime).concat(globalConfig.genres.movies);

const pairs = _.uniq(all).map((genre, index) => {
    return [genre.toLowerCase().replace(/[/\\_ -]+/g, '_'), genre]
})

const code = `
import { ContentGenre } from "@prisma/client"
export const genreIds = [
${pairs.map(x => `    "${x[0]}",`).join(`\n`)}
] as const
export type GenreId = typeof genreIds[number]
export const genreIdToName = new Map<ContentGenre,string>([
${pairs.map((pair) => `    ["${pair[0]}", "${pair[1]}"],`).join("\n")}
])
export const genreNameToId = new Map<string,ContentGenre>([
${pairs.map((pair) => `    ["${pair[1]}", "${pair[0]}"],`).join("\n")}
])    
`

fs.writeFileSync("./src/utils/genres.ts", code);
console.log(pairs.map(x => x[0]).sort().join("\n"));
