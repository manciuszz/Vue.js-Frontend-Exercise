const virtualscroller = {
	props: ['items'],
	template: `
		<div class="container__tableBody" @scroll="updateTable">
			<table>
				<tbody :style="containerStyle">
					<tr v-for="car in visibleCars" :key="car.id" >
						<td>{{car.id}}</td>
						<td>{{car.brand}}</td>
						<td>{{car.model}}</td>
						<td>{{car.year}}</td>
						<td>{{car.drive}}</td>
					</tr>
				</tbody>
			</table>
		</div>
	`,
	data: () => ({
		visibleCars: [],
		containerStyle: null,
		itemHeight: 35
	}),
	methods: {
		updateTable: function() {
			let tableBody = this.$el;
						
			let startIndex = ~~(tableBody.scrollTop / this.itemHeight);
			let endIndex = -~((tableBody.scrollTop + tableBody.clientHeight) / this.itemHeight);
			this.visibleCars = this.items.slice(startIndex, endIndex);
			this.containerStyle = {
				paddingTop: startIndex * this.itemHeight + 'px',
				height: this.items.length * this.itemHeight + 'px',
			}
			this.$emit("tablebody-scrolltop", tableBody.scrollTop); // This doesn't work with camelCase? really!? ....
		},	
	},
	mounted: function() {
		this.itemHeight = this.$parent.$refs.firstRow.clientHeight;
		this.updateTable();
	},
};