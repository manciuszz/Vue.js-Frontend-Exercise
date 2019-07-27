let generateCars = (function() {
	let random = (function() {
		let defaultBrands = ["Acura", "Alfa Romeo", "Audi", "BMW", "Bentley", "Buick", "Cadillac", "Chevrolet", "Chrysler", "Dodge", "Fiat", "Ford", "GMC", "Genesis", "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", "Land Rover", "Lexus"];
		let defaultModels = ["Tank", "Silver Edge", "Elvira", "Calm Tram", "Demigod", "Betty", "Inferno", "Jack rabbit", "Speedy Pie", "Death Proof", "Dumpster Fire", "Toronado", "Unicorn Rider", "Pandora", "Desert Fox", "KARR", "Chill Mobile"];
		
		let getRandomInt = function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};
		
		return {
			trueOrFalse: function() {
				return getRandomInt(0, 1);
			},
			brandName: function(brandArr = defaultBrands) {
				return brandArr[getRandomInt(0, brandArr.length - 1)];
			},
			modelName: function(modelArr = defaultModels) {
				return modelArr[getRandomInt(0, modelArr.length - 1)];
			},
			year: function(min, max) {
				return getRandomInt(min, max);
			}
		}
	})();
	
	return function(total = 5000) {
		let results = [];
		for (let i = 0; i < total; i++) {
			results.push({
				id: i + 1,
				brand: random.brandName(),
				model: random.modelName(),
				year: random.year(1995, 2019),
				drive: random.trueOrFalse() ? 'FWD' : 'BWD',
			});
		}
		return results;
	};
})();

const app = new Vue({
    el: '#app',
    data: {
        cars: [{ id: "Loading.", brand: "Loading..", model: "Loading...", year: "Loading....", drive: "Loading...." }],
		sort: {
			current: 'id',
			direction: 'asc'
		},
		page: {
			current: 1,
			size: 20,
			cache: { current: null, size: null },
		},
		lastClicked: {
			cell: null,
			row: null,
			cache: { 
				rowsArray: [],
				columnNames: []
			}
		}
    },
    created: function() {
		const controller = new AbortController();
		const signal = controller.signal;
		
		fetch('https://api.myjson.com/bins/qweal', { signal })
		.then(res => res.json())
		.then(res => {
			this.cars = res;
		}).catch( err => {
			this.cars = generateCars(); // For extra performance we could generate this earlier...
		});
		
		setTimeout(() => { controller.abort() }, 1000); // Fetch was too slow and we care about performance...
    },
    methods: {
        sortBy: function(s) {
            if (s === this.sort.current) {
                this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc';
            }
            this.sort.current = s;
        },
        prevPage: function() {
            if (this.page.current > 1) 
				this.page.current--;
        },
		nextPage: function() {
            if ((this.page.current * this.page.size) < this.cars.length) 
				this.page.current++;
        },
        loadPage: function(n) {
            this.page.current = n;
        },
		toggleShowAll: function() {
			if (this.page.size == this.cars.length) {
				this.page.current = this.page.cache.current;
				this.page.size = this.page.cache.size;
			} else {
				this.page.cache.current = this.page.current;
				this.page.cache.size = this.page.size;
				
				this.page.current = 1;
				this.page.size = this.cars.length;
			}
		},
		trackTable: function(event) {
			if (event.target.tagName == "TH") { // We clicked on the sort buttons
				this.lastClicked.cell = this.sort.current;
				return;
			} else if (event.target.tagName != "TD") // What if we drag select stuff from table rows?
				return;
			
			if (!this.lastClicked.cache.columnNames.length)
				this.lastClicked.cache.columnNames = Object.keys(this.cars[this.cars.length - 1]); // Edge case - What if we have an extra column with duplicate data?... this will fail us eventually.
			
			let rowIndex = this.lastClicked.cache.rowsArray.findIndex(row => row.contains(event.target));
			if (rowIndex == -1) { // If we didn't find the row, it probably means our table has new data
				this.lastClicked.cache.rowsArray = Array.from(document.querySelectorAll('.container__table tr'));
				rowIndex = this.lastClicked.cache.rowsArray.findIndex(row => row.contains(event.target));
			}
			
			let columns = Array.from(this.lastClicked.cache.rowsArray[rowIndex].querySelectorAll('td'));
			let columnIndex = columns.findIndex(column => column == event.target);		
			this.lastClicked.cell = this.lastClicked.cache.columnNames[columnIndex];
			
			if (this.lastClicked.row) {
				this.lastClicked.cache.rowsArray[this.lastClicked.row].classList.remove("container__clickedCellData--color");
				this.lastClicked.row = null;
			}
			
			if (rowIndex != this.lastClicked.row) {
				this.lastClicked.cache.rowsArray[rowIndex].classList.add("container__clickedCellData--color");
				this.lastClicked.row = rowIndex;
			}
		}
    },
    computed: {
        sortedCars: function() {
			let start = (this.page.current - 1) * this.page.size;
			let end = this.page.current * this.page.size;
			
			let modifier = (this.sort.direction === 'asc') ? 1 : -1;
			
            return this.cars.sort((a, b) => {
                if (a[this.sort.current] > b[this.sort.current]) 
					return 1 * modifier;
                if (a[this.sort.current] < b[this.sort.current]) 
					return -1 * modifier;
                return 0;
            }).filter((row, index) => (index >= start && index < end));
        },
        pages: function() {
            let totalPages = ~~(this.cars.length / this.page.size);
			if (totalPages == 1) totalPages = 0;
            return [ ...Array(totalPages + 1).keys() ].slice(1);
        },
		lastClickedCellData: function() {
			return this.sortedCars.map((row) => row[this.lastClicked.cell]); 
		}
    }
})