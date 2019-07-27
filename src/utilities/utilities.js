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