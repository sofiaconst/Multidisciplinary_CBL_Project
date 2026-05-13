<script lang="ts">
import { Scale } from '$lib/scale.svelte'
import { Chart, type ChartDataset, registerables } from 'chart.js'

const scale = Scale.getInstance()

let chartNode: HTMLCanvasElement
let chartObject: Chart<'scatter'> | undefined

const chartDataset = $derived<ChartDataset<'scatter'>>({
	label: 'Live weight',
	backgroundColor: '#63e792',
	borderColor: '#63e792',
	fill: false,
	showLine: true,
	tension: 0,
	pointRadius: 0,
	pointBorderWidth: undefined,
	borderCapStyle: 'round',
	data: scale.chartData,
})

$effect(() => {
	Chart.register(...registerables)
	chartObject = new Chart(chartNode, {
		type: 'scatter',
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				x: {
					title: { display: true, text: 'Time (s)' },
					ticks: {
						stepSize: 5,
					},
					beginAtZero: true,
				},
				y: {
					title: { display: true, text: 'Weight (g)' },
				},
			},
			plugins: {
				legend: { display: false },
			},
		},
		data: {
			datasets: [],
		},
	})

	return () => {
		chartObject?.destroy()
		chartObject = undefined
	}
})

$effect(() => {
	if (!chartObject) return
	const latestX = scale.chartData.length > 0 ? (scale.chartData[scale.chartData.length - 1].x ?? 0) : 0
	chartObject.data.datasets[0] = $state.snapshot(chartDataset) as ChartDataset<'scatter'>
	if (chartObject.options.scales?.x) {
		chartObject.options.scales.x.min = Math.max(0, latestX - scale.chartWindowSeconds)
		chartObject.options.scales.x.max = Math.max(scale.chartWindowSeconds, latestX)
	}
	chartObject.update('none')
})
</script>

<div class="p-2 w-full h-screen relative">
  <canvas bind:this={chartNode}></canvas>
</div>
