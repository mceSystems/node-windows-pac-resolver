const rewire = require("rewire");
const pacResolver = rewire("../../index");

const { expect } = require("chai");


/* eslint-disable  func-names, prefer-arrow-callback */
describe("#toPACUri", function () {
	before(function __before() {
		this.toPACUri = pacResolver.__get__("toPACUri");
	})
	it("should return an empty string with no param is given", function () {
		expect(this.toPACUri()).to.be.a("string").that.is.empty;
	});
	it("should return a valid pac uri for a valid string param", function () {
		const pacURI = this.toPACUri("http://proxy.local/test.pac");
		expect(pacURI).to.be.a("string");
		expect(pacURI).to.equal("pac+http://proxy.local/test.pac");
	});
	it("should return a valid pac uri with forward slashes for a valid string param with backslashes", function () {
		const pacURI = this.toPACUri("http://proxy.local\\test.pac");
		expect(pacURI).to.be.a("string");
		expect(pacURI).to.equal("pac+http://proxy.local/test.pac");
	});
});

describe("#extractProxyAddress", function () {
	before(function __before() {
		this.extractProxyAddress = pacResolver.__get__("extractProxyAddress");
	});

	it("should return an empty string when a non string param", function () {
		expect(this.extractProxyAddress()).to.be.a("string").that.is.empty;
	});	
	it("should return an empty string when an empty string is given as an argument", function () {
		expect(this.extractProxyAddress("")).to.be.a("string").that.is.empty;
	});	
	it("should return a value equal to the param provided without a port number if not provided with a proxy-by-protocol list", function () {
		const proxyAddressParam = "127.0.0.1";
		const proxyAddress = this.extractProxyAddress(proxyAddressParam);

		expect(proxyAddress).to.be.a("string");
		expect(proxyAddress).to.equal(proxyAddressParam);
	});	
	it("should return a value equal to the param provided with a port number if not provided with a proxy-by-protocol list", function () {
		const proxyAddressParam = "127.0.0.1:8080";
		const proxyAddress = this.extractProxyAddress(proxyAddressParam);

		expect(proxyAddress).to.be.a("string");
		expect(proxyAddress).to.equal(proxyAddressParam);
	});	
	it("should return an object with a key for each protocol if a proxy-by-protocol list is provided", function () {		
		const proxyAddress = this.extractProxyAddress("http=127.0.0.1:8081;https=127.0.0.1:8082;ftp=127.0.0.1:8083");

		expect(proxyAddress).to.be.a("object");
		expect(proxyAddress).to.have.all.keys("http", "https", "ftp");	
		expect(proxyAddress.http).to.equal("127.0.0.1:8081");
		expect(proxyAddress.https).to.equal("127.0.0.1:8082");
		expect(proxyAddress.ftp).to.equal("127.0.0.1:8083");
	});	
	it("should return an object with a key for each protocol if a proxy-by-protocol list is provided, with only one protocol", function () {
		const proxyAddress = this.extractProxyAddress("http=127.0.0.1:8080");

		expect(proxyAddress).to.be.a("object");
		expect(proxyAddress).to.have.all.keys("http");
		expect(proxyAddress.http).to.equal("127.0.0.1:8080");		
	});	
});