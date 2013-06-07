/**
 * jasmine unit test
 */
describe("framework demo", function() {

	var model;

	beforeEach(function() {
		model = new frameworkModel({
			"name": "backbone",
			"star": 300
		});
	});

	it("should be name is 'backbone'", function() {
		expect(model.get("name")).toEqual("backbone");
	});

	it("should be name is 'backbone'", function() {
		expect(model.get("star")).toEqual(300);
	});
});
