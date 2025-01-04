const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];


function buildGraph(edges) {
    let graph = Object.create(null);

    function addEdge(from, to) {
        if (from in graph) {
            graph[from].push(to);
        } else {
            graph[from] = [to]
        }
    }

    for (let [from, to] of edges.map(r => r.split("-"))) {
        // Making the graph bidirectional.
        addEdge(from, to);
        addEdge(to, from);
    }

    return graph;
}

const roadGraph = buildGraph(roads);
// console.log(roadGraph);

const locations = Object.keys(roadGraph);
// console.log(locations);

function move(state, destination) {
    if (!roadGraph[state.place].includes(destination)) {
        return state; 
    } else {
        let parcels = state.parcels.map(p => {
            if (p.place !== state.place) return p; 
            return { place: destination, address: p.address }; 
        }).filter(p => p.place !== p.address);
        return { place: destination, parcels };
    }
}


function runRobot(state, robot, memory) {
    for (let turn = 0; ; turn++) {
        if (state.parcels.length === 0) {
            console.log(`Done in ${turn} turns`);
            break;
        }
        let action = robot(state, memory);
        state = move(state, action.direction);
        console.log(`Moved to ${action.direction}`);
    }
}

function randomRobot(state) {
    return { direction: randomPick(roadGraph[state.place]) };
}

function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

let initialState = {
    place: "Post Office",
    parcels: [{ place: "Post Office", address: "Alice's House" }]
};

runRobot(initialState, randomRobot);
