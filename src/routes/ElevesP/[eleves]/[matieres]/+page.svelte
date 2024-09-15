<script>
	import { scaleLinear } from 'd3-scale';
    import { currentUser } from '../../../../stores/currentUser.js';

    export let data
    // console.log(data.donnees[0].eleve_id);
    let userData = $currentUser

	let points = [];

    for (let i = 0; i < data.donnees.length; i++) {
        let json = {}
        json.date = data.donnees[i].date
        json.note = data.donnees[i].note
        points.push(json)
        console.log(points);
        
    }
    const an = ["jan","fév","mar","avril", "mai", "juin", "juil","aou","sep","oct","nov","déc" ]

    // console.log(data.donnees[0].date.split('-')[2]+'/'+an[data.donnees[0].date.split('-')[1][1] -1]);

	let xTicks = [];

    for (let i = 0; i < data.donnees.length; i++) {
        
        let json = ""
        // json = data.donnees[i].date.split('-')[2]+'/'+an[data.donnees[0].date.split('-')[1][1] -1]
        json = data.donnees[i].date.split()
        xTicks.push(json)
        console.log("tricks",xTicks);
        
        
    }

	const yTicks = [0, 3, 5, 7, 10];
	const padding = { top: 20, right: 15, bottom: 20, left: 25 };

	let width = 500;
	let height = 200;

	function formatMobile(tick) {
		return "'" + tick.toString().slice(-2);
	}

	$: xScale = scaleLinear()
		.domain([0, xTicks.length])
		.range([padding.left, width - padding.right]);

	$: yScale = scaleLinear()
		.domain([0, Math.max.apply(null, yTicks)])
		.range([height - padding.bottom, padding.top]);

	$: innerWidth = width - (padding.left + padding.right);
	$: barWidth = innerWidth / xTicks.length;

    function retour() {
        location.replace('/DashboardParent/'+userData.id+'/'+data.donnees[0].eleve_id)
    }
</script>

<div class="h-screen">
    <h1 class="text-center font-bold text-3xl underline uppercase">smart learning</h1>
    <div class="flex">
        <button on:click={retour} class=" w-[40%] font-size-[1.5rem] bg-blue-700 text-white border-none mx-auto mt-2 hover:bg-transparent rounded-lg cursor-pointer p-1" type="button">Retour</button>
    </div>

    <h1 class="text-center font-bold">{data.donnees[0].eleves.nom}</h1>
    <h1 class="text-center font-serif underline">{data.donnees[0].matieres.nom}</h1>

    <div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
        <svg>
            <!-- y axis -->
            <g class="axis y-axis">
                {#each yTicks as tick}
                    <g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
                        <line x2="100%" />
                        <text y="-4">{tick} {tick === 20 ? ' per 1,000 population' : ''}</text>
                    </g>
                {/each}
            </g>
    
            <!-- x axis -->
            <g class="axis x-axis">
                {#each points as point, i}
                    <g class="tick" transform="translate({xScale(i)},{height})">
                        <text x={barWidth / 2} y="-4">{width > 380 ? point.date : formatMobile(point.date)}</text>
                    </g>
                {/each}
            </g>
    
            <g class="bars">
                {#each points as point, i}
                    <rect
                        x={xScale(i) + 2}
                        y={yScale(point.note)}
                        width={barWidth - 4}
                        height={yScale(0) - yScale(point.note)}
                    />
                {/each}
            </g>
        </svg>
    </div>
</div>

<style>

	.chart {
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
	}

	svg {
		position: relative;
		width: 100%;
		height: 200px;
	}

	.tick {
		font-family: Helvetica, Arial;
		font-size: 0.725em;
		font-weight: 200;
	}

	.tick line {
		stroke: #e2e2e2;
		stroke-dasharray: 2;
	}

	.tick text {
		fill: #ccc;
		text-anchor: start;
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}

	.x-axis .tick text {
		text-anchor: middle;
	}

	.bars rect {
		fill: #a11;
		stroke: none;
		opacity: 0.65;
	}
</style>
