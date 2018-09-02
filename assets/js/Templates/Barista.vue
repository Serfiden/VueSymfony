<template>
	<div id = "baristaViewContainer">
		<button @click='startShift'>Start shift</button>
		<button @click='endShift'>End shift</button>
		<div id = "currentOrder" v-if='Object.keys(order).length !== 0' style = 'margin-top:30px'>
			Current order
			<button @click='receiveOrder'>Accept</button>
			<button @click='declineOrder'>Decline</button>
			<li v-for='(item, key) in order'>
				{{item.name}} x {{item.quantity}} 
			</li>
		</div>
	</div>
</template>