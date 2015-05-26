/* global describe, it */

'use strict';

var express = require('express'),
    request = require('supertest'),
    expect = require('chai').expect,
    responseFormatter = require('./index');

describe('express-format-response tests', function () {
    it('should include fields in the response, as per format object', function (done) {
        var format = {
            response: {
                info: '<%= res.info %>'
            }
        };

        var app = express();
        app.get('/', function (req, res, next) {
            res.info = 'test passing!';
            next();
        }, responseFormatter(format));

        request(app)
            .get('/')
            .expect(200)
            .expect(function (res) {
                expect(res.body.response).to.be.an('object');
                expect(res.body.response.info).to.equal('test passing!');
            })
            .end(done);
    });

    it('should allow to use deep nested attributes in the format object', function (done) {
        var format = {
            response: {
                info: '<%= res.fiddus.info %>'
            }
        };

        var app = express();

        app.get('/', function (req, res, next) {
            res.fiddus = {info: 'test passing!'};
            next();
        }, responseFormatter(format));

        request(app)
            .get('/')
            .expect(200)
            .expect(function (res) {
                expect(res.body.response).to.be.an('object');
                expect(res.body.response.info).to.equal('test passing!');
            })
            .end(done);
    });

    it('should be able to create format objects using both req and res objects', function (done) {
        var format = {
            response: {
                info: '<%= res.info %>',
                method: '<%= req.method =>'
            }
        };

        var app = express();

        app.get('/', function (req, res, next) {
            res.info = 'test passing!';
            next();
        }, responseFormatter(format));

        request(app)
            .get('/')
            .expect(200)
            .expect(function (res) {
                expect(res.body.response).to.be.an('object');
                expect(res.body.response.info).to.equal('test passing!');
                expect(res.body.response.method).to.equal('GET');
            })
            .end(done);

    });
});