<template>
	<div id = "cartContainer">
		<p>Your current order:</p>
		<li v-for="item in items" v-if="item.quantity > 0">
			{{createOutput(item)}}
		</li>
		<button v-on:click="orderSubmit">Place order</button>
	</div>
</template>