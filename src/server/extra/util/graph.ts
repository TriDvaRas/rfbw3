import _ from "lodash";
import mazeEdges from "./mazeEdges.json";
export interface MazeEdge {
    from: [number, number];
    to: [number, number];
}
export interface MazeNode {
    key: string
    edges: MazeEdge[]
    childrenKeys: string[]
    isChildrenFound: boolean
}

const mazeSize = [300, 200]

const mazeGraph = new Map<string, MazeEdge[]>()
const mazeNodesChildrenMap = new Map<string, string[]>()

for (const edge of mazeEdges as MazeEdge[]) {
    if (!mazeGraph.has(`${edge.from.join(',')}`))
        mazeGraph.set(`${edge.from.join(',')}`, [])
    mazeGraph.get(`${edge.from.join(',')}`)!.push(edge)
    if (!mazeGraph.has(`${edge.to.join(',')}`))
        mazeGraph.set(`${edge.to.join(',')}`, [])
    mazeGraph.get(`${edge.to.join(',')}`)!.push(edge)
}


for (const vertexEdges of mazeGraph.values()) {
    const key = vertexEdges[0]!.from.join(',')
    const children = vertexEdges.map(x => x.from.join(`,`) == key ? x.to.join(',') : x.from.join(','))
    mazeNodesChildrenMap.set(key, children)
}
for (const vertexEdges of mazeGraph.values()) {
    const key = vertexEdges[0]!.to.join(',')
    if (mazeNodesChildrenMap.has(key)) continue

    const children = vertexEdges.map(x => x.from.join(`,`) == key ? x.to.join(',') : x.from.join(','))
    mazeNodesChildrenMap.set(key, children)
}
//delete duplicates from every mazeNodesChildrenMap items
for (const [key, value] of mazeNodesChildrenMap.entries()) {
    mazeNodesChildrenMap.set(key, _.uniq(value))
}

// console.log(mazeNodesChildrenMap.get('48,48'))
// console.log(getMazeNodes(48, 48, 5))
function findChildren(nodes: MazeNode[], depth: number): MazeNode[] {
    if (depth === 0) return nodes
    for (const node of nodes.filter(x => x.isChildrenFound === false)) {
        const children = mazeNodesChildrenMap.get(node.key)!
        const childrenNodes = children.filter(key => !nodes.some(x => x.key == key)).map((key) => ({
            key,
            childrenKeys: mazeNodesChildrenMap.get(key) ?? [],
            edges: mazeGraph.get(key)!,
            isChildrenFound: false,
        }))
        node.isChildrenFound = true
        nodes.push(...childrenNodes)
    }
    return findChildren(nodes, depth - 1)
}

export function getMazeNodes(rootX: number, rootY: number, depth: number): MazeNode[] {
    const key = `${rootX},${rootY}`
    const rootNode = {
        key,
        childrenKeys: mazeNodesChildrenMap.get(key) ?? [],
        edges: mazeGraph.get(key)!,
        isChildrenFound: false
    }
    const nodes: MazeNode[] = findChildren([rootNode], depth)
    return nodes
}



