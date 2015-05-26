[![Build Status](https://travis-ci.org/fiddus/express-format-response.svg?branch=master)](https://travis-ci.org/fiddus/express-format-response)

## Overview

Middleware for formatting responses, in order to include some default fields.

Works with [Express](https://github.com/visionmedia/express).

## Usage

This middleware sends the data defined in the configuration template as JSON. For this to work, this must be the last
middleware used, and no middleware before it can send the response before (unless thats desired, in case of errors or
authentications problems, for example).

The template format object can access properties both from the `request` object and from `response` object.

If you want to send data that is not in these objects, you must add them to one of the two before calling this middleware.

```javascript
var express = require('express'),
    app = express(),
    responseFormatter = require('express-format-response'),

    template = {
        info: '<%= res.info %>'
        data: '<%= res.data %>',
        method: '<%= req.method %>'
    };

    app.get('/', function (req, res, next) {
        res.info = 'this informaton will be in the response';
        res.data = {
            arr: ['This', 'array', 'will', 'also'],
            nested: {
                prop: 'so will this nested property'
            }
        };
        // req.method is already in the request object, so no need to add it here.

    }, responseFormatter(template));

```

## TODO

- Improve template parser
- Add support to response status setting
- Add support to error

## Contributing

Feel free to fork and mess with this code. But, before opening PRs, be sure that you adhere to the Code Style and Conventions
(run `grunt lint`) and add as many tests as needed to ensure your code is working as expected, or correct tests if wrong.

## License

The MIT License (MIT)

[![Fiddus Tecnologia](http://fiddus.com.br/assets/img/logo-site.png)](http://fiddus.com.br)

Copyright (c) 2015 Vinicius Teixeira vinicius0026@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.