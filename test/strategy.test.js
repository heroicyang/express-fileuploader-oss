/**
 * Module dependencies
 */
var express = require('express');
var mutilpart = require('connect-multiparty');
var request = require('supertest');
var test = require('tape');
var uploader = require('express-fileuploader');
var OssStrategy = require('../lib/strategy');

test('initialize', function(t) {
  t.plan(2);

  t.throws(function() {
    var strategy = new OssStrategy({
      clientOptions: {
        accessKeyId: 'key',
        accessKeySecret: 'secret',
        host: 'region.aliyuncs.com',
        bucket: 'bucket name'
      }
    });
  }, '"uploadPath" option is required');

  t.throws(function() {
    var strategy = new OssStrategy({
      uploadPath: 'uploads'
    });
  }, '"clientOptions" option is required');
});

test('upload', function(t) {
  var app = express();
  app.use('/upload/image', mutilpart());

  uploader.use(new OssStrategy({
    uploadPath: 'test-oss-strategy/uploads',
    clientOptions: {
      accessKeyId: '9BEMD2aTsxg9mFJK',
      accessKeySecret: 'oWadlaZ6TecruAACKSpjtSasEHWB5y',
      host: 'oss-cn-qingdao.aliyuncs.com',
      bucket: 'kloud'
    }
  }));

  app.post('/upload/image', function(req, res) {
    uploader.upload('oss', req.files.avatar, function(err, files) {
      if (err) {
        return res.send({
          error: err
        });
      }
      res.send(files);
    });
  });

  request(app)
    .post('/upload/image')
    .attach('avatar', 'test/fixtures/heroic.jpg')
    .expect(200)
    .end(function(err, res) {
      t.error(err, 'should not throw an error');
      t.ok(res.body, 'should upload file ok');
      t.end();
    });
});
