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
	
	return function(total = 15000) {
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
        cars: [],
		sort: {
			current: 'id',
			direction: 'asc'
		},
		page: {
			current: 1,
			size: 25,
		}
    },
    created: function() {
        this.cars = generateCars();
    },
    methods: {
        sortBy: function(s) {
            if (s === this.sort.current) {
                this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc';
            }
            this.sort.current = s;
        },
        nextPage: function() {
            if ((this.page.current * this.page.size) < this.cars.length) this.page.current++;
        },
        prevPage: function() {
            if (this.page.current > 1) this.page.current--;
        },
        loadPage: function(n) {
            this.page.current = n;
        }
    },
    computed: {
        sortedCars: function() {
			let modifier = (this.sort.direction === 'asc') ? 1 : -1;
            return this.cars.sort((a, b) => {
                if (a[this.sort.current] > b[this.sort.current]) return 1 * modifier;
                if (a[this.sort.current] < b[this.sort.current]) return -1 * modifier;
                return 0;
            }).filter((row, index) => {
                let start = (this.page.current - 1) * this.page.size;
                let end = this.page.current * this.page.size;
                if (index >= start && index < end) return true;
            });
        },
        pages: function() {
            let totalPages = Math.ceil(this.cars.length / this.page.size);
            return [ ...Array(totalPages + 1).keys() ].slice(1);
        }
    }
})