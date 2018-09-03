<template>
	<div id = "baristaViewContainer">
		<button @click='startShift'>Start shift</button>
		<button @click='endShift'>End shift</button>
		<p> {{this.status}} </p>
		<div id = "currentOrder" v-if='Object.keys(order).length !== 0' style = 'margin-top:30px'>
			Current order
			<button @click='acceptOrder' v-if='!hasJob'>Accept</button>
			<button @click='declineOrder' v-if='!hasJob'>Decline</button>
			<li v-for='(item, key) in order' style = 'margin-top:10px'>
				{{item.name}} x {{item.quantity}} 
				<button v-if='hasJob' @click='productReady(key)'>Done</button> 
			</li>
		</div>
	</div>
</template>