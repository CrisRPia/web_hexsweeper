<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	let tweenedPercent = tweened(0, {
		duration: 400,
		easing: cubicOut
	});
	let tweenedProgress = tweened(0, {
		duration: 400,
		easing: cubicOut
	});

	export let total = 100;
    export let progress = 0;
	$: {
		tweenedPercent.set(progress / total * 100);
        tweenedProgress.set(total - progress);
	}
</script>

<div class="text-lg w-20 h-20 z-10">
	<div class="absolute w-20 h-20 flex justify-center items-center">
		<h2
			class="h2 text-white absolute flex items-center justify-center bottom-0 top-0 z-50"
		>
			{(total - progress).toFixed(0)}
		</h2>
	</div>

	<svg
		width="100%"
		height="100%"
		viewBox="0 0 212 216"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g id="Mask group">
			<mask
				id="mask0_7_20"
				style="mask-type:alpha"
				maskUnits="userSpaceOnUse"
				x="14"
				y="0"
				width="100%"
				height="100%"
			>
				<path
					id="Base"
					d="M106 0L197.799 54V162L106 216L14.2013 162V54L106 0Z"
					fill="#D9D9D9"
				/>
			</mask>
			<g mask="url(#mask0_7_20)">
				<path
					id="Background"
					d="M106 0L197.799 54V162L106 216L14.2013 162V54L106 0Z"
					fill="#1C588E"
				/>
				<path
					id="Green"
					transform="translate(0 {Math.max(
						($tweenedPercent * -216) / 100,
						-216
					) + 216})"
					d="M106 0L197.799 54V162L106 216L14.2013 162V54L106 0Z"
					class="fill-success-500"
				/>
				<path
					id="Red"
					transform="translate(0 {Math.max(
						($tweenedPercent * -216) / 100 + 216,
						-216
					) + 216})"
					d="M106 0L197.799 54V162L106 216L14.2013 162V54L106 0Z"
					class="fill-error-500"
				/>
			</g>
		</g>
	</svg>
</div>
