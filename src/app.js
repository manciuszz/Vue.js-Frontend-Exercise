const app = new Vue({
    el: '#app',
	components: {
		virtualscroller
	},
    data: {
        cars: [{ id: "Loading.", brand: "Loading..", model: "Loading...", year: "Loading....", drive: "Loading...." }],
		sort: {
			current: 'id',
			direction: 'asc'
		},
		page: {
			current: 1,
			size: 50,
		},
		lastClicked: {
			cell: null,
			row: null,
		},
    },
    created: function() {
		const controller = new AbortController();
		const signal = controller.signal;
		
		fetch('https://api.myjson.com/bins/qweal', { signal })
		.then(res => res.json())
		.then(res => {
			this.cars = res;
		}).catch( err => {
			this.cars = generateCars(5000); // For extra 'perceived' performance we could generate this earlier...
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
				this.page.current = this.page._current;
				this.page.size = this.page._size;
			} else {
				this.page._current = this.page.current;
				this.page._size = this.page.size;
				
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
			
			if (!this._columnNames) {
				this._rowsArray = [];
				this._columnNames = Object.keys(this.cars[this.cars.length - 1]); // Edge case - What if we have an extra column with duplicate data?... this will fail us eventually.
				this._colorClass = "container__clickedCellData--color";
				this._rowElementClass = ".container__table tr";
			}						
			
			let rowIndex = this._rowsArray.findIndex(row => row.contains(event.target));
			if (rowIndex == -1) { // If we didn't find the row, it probably means our table has new data
				this._rowsArray = Array.from(document.querySelectorAll(this._rowElementClass));
				rowIndex = this._rowsArray.findIndex(row => row.contains(event.target));
			}
			
			let columns = Array.from(this._rowsArray[rowIndex].querySelectorAll('td'));
			let columnIndex = columns.findIndex(column => column == event.target);		
			this.lastClicked.cell = this._columnNames[columnIndex];
			
			if (this.lastClicked.row) {
				this.lastClicked.row.classList.remove(this._colorClass);
				this.lastClicked.row = null;
			}
			
			if (rowIndex != this.lastClicked.row) {
				this.lastClicked.row = this._rowsArray[rowIndex];
				this.lastClicked.row.classList.add(this._colorClass);
			}
		},
		scrollMirror: function(scrollTop) {
			this.$refs.mirrorElement.scrollTo(0, scrollTop);
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
        // pages: function() {
            // let totalPages = ~~(this.cars.length / this.page.size);
			// if (totalPages == 1) totalPages = 0;
            // return [ ...Array(totalPages + 1).keys() ].slice(1);
        // },
		lastClickedCellData: function() {
			return this.sortedCars.map((row) => row[this.lastClicked.cell]); 
		}
    }
})