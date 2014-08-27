express-fileuploader-oss
===================
![NPM version](http://img.shields.io/npm/v/express-fileuploader-oss.svg?style=flat-square)&nbsp;
![Build Status](http://img.shields.io/travis/heroicyang/express-fileuploader-oss.svg?style=flat-square)&nbsp;
![Dependency Status](http://img.shields.io/david/heroicyang/express-fileuploader-oss.svg?style=flat-square)

> `OssStrategy` for [express-fileuploader](https://github.com/heroicyang/express-fileuploader). Use this strategy to upload files to aliyun OSS(Open Storage Service).

## Install

```bash
npm install express-fileuploader-oss --save
```

## Usage

```javascript
var http = require('http');
var express = require('express');
var mutilpart = require('connect-multiparty');
var uploader = require('express-fileuploader');
var OssStrategy = require('express-fileuploader-oss');

var app = express();
app.use('/upload/image', mutilpart());

uploader.use(new OssStrategy({
  uploadPath: 'uploads',
  clientOptions: {
    accessKeyId: 'your access key id',
    accessKeySecret: 'your access key secret',
    host: 'region.aliyuncs.com'
    bucket: 'your bucket name'
  }
}));

app.post('/upload/image', function(req, res, next) {
  uploader.upload('oss', req.files['images'], function(err, files) {
    if (err) {
      return next(err);
    }
    res.send(JSON.stringify(files));
  });
});

http.createServer(app).listen(8000);
```

## Options

- **uploadPath**    file destination path
- **clientOptions**       OSS client options
  - **accessKeyId**         access key
  - **accessKeySecret**     access key secret
  - **host**                your bucket host
  - **bucket**              your bucket name
