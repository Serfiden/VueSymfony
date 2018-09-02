<template>
	<div class = "menuContainer">
		<ul v-for="(category, key) in items" class = "menuSection">
			<li style = "margin-bottom:20px" v-for="item in category" class = "menuItem">
				{{item.name}} {{item.price}} <br>
				<img :src="item.src" style = "width:60px;height:auto">
				<button v-on:click="onAddClick(item.name, key)"> + </button>
			</li>
		</ul>
	</div>
</template>