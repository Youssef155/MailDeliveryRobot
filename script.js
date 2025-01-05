/* <===================================================================>
    - This program simulates a mail delivery robot in a small village
    that takes parcels and deliver it to it's distenation
    -------------------------------------------------------------------
    - The program idea from (Eloquent JavaScript) book.
    <===================================================================>
*/

// roads represents each road, the robot can take 
// the roads are bidirectional
const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];


/*  <====================================================>
    mailRoute: defines a systematic path that our robot will take 
    this fixed path'll guarantee that the robot'll visit 
    all locations in the village
    <====================================================>
*/ 
const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
];

/*  <======================================================>
    buildGraph(edges): builds the village graph from the roads and
    returns an object contains each node with it's neighbours 
    which represnts the graph's edges
    <======================================================>
*/
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
        memory = action.memory;
        console.log(`Moved to ${action.direction}`);
    }
}

function randomRobot(state) {
    return { direction: randomPick(roadGraph[state.place]) };
}

/*  <=====================================================>
    routeRobot makes sure that the robot along our predefined route
    that improve the robot's efficiency
    <=====================================================>
*/
function routeRobot(state, memory) {
    if(memory.length == 0) {
        memory = mailRoute;
    }
    return {direction: memory[0], memory: memory.slice(1)};
}

function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

/*  <=====================================================>
    randomParcels(count): takes a number to return a different random parcels
    it returns an object of {place, address}
    <=====================================================>
*/
function randomParcels(count) {
    let parcels = [];
    for (let i = 0; i < count; i++) {
        let place = randomPick(locations);
        let address;
        do {
            address = randomPick(locations);
        } while (address === place);
        parcels.push({ place, address });
    }
    return parcels;
}


let initialState = {
    place: "Post Office",
    parcels: randomParcels(5) // [{ place: "Post Office", address: "Alice's House" }]
};

// runRobot(initialState, randomPick)
runRobot(initialState, routeRobot, []);
