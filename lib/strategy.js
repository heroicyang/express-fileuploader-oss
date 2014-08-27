/**
 * express-fileuploader-oss
 *
 * Upload files to aliyun OSS: http://www.aliyun.com/product/oss
 *
 * @author HeroicYang <me@heroicyang.com>
 */

/**
 * Module dependencies
 */
var path = require('path');
var Strategy = require('express-fileuploader').Strategy;
var kloud = require('kloud');

/**
 * OssStrategy for express-fileuploader.
 *
 * Examples:
 *
 *    var uploader = require('express-fileuploader');
 *    var OssStrategy = require('express-fileuploader-oss');
 *
 *    uploader.use(new OssStrategy({
 *      uploadPath: 'uploads',
 *      clientOptions: {
 *        accessKeyId: 'your access key id',
 *        accessKeySecret: 'your access key secret',
 *        host: 'region.aliyuncs.com'
 *        bucket: 'your bucket name'
 *      }
 *    }));
 *
 * @param {Object}  options
 *  - {String} uploadPath      required
 *  - {Object} clientOptions   required
 *    - {String} accessKeyId     required
 *    - {String} accessKeySecret required
 *    - {String} host            required
 *    - {String} bucket          required
 *
 * @return {Strategy}
 */
module.exports = exports = Strategy.extend({
  name: 'oss',

  constructor: function(options) {
    options = options || {};

    if (!options.uploadPath) {
      throw new Error('OssStrategy#uploadPath required');
    }
    if (!options.clientOptions) {
      throw new Error('OssStrategy#clientOptions required');
    }
    if (!options.clientOptions.accessKeyId || !options.clientOptions.accessKeySecret ||
        !options.clientOptions.host || !options.clientOptions.bucket) {
      throw new Error('OssStrategy#clientOptions "accessKeyId", "accessKeySecret", "host", "bucket" required');
    }

    this.uploadPath = options.uploadPath;
    this.clientOptions = options.clientOptions;
  },

  upload: function(file, callback) {
    var self = this;
    var client = kloud.createClient(this.clientOptions);
    var dest = path.join(this.uploadPath, file.name);

    client.putFile(file.path, dest, function(err, res) {
      if (err) {
        return callback(err);
      }

      if (res.statusCode !== 200) {
        err = new Error('request error');
        err.status = res.statusCode;
        return callback(err);
      }

      file.url = 'http://' + self.clientOptions.host + '/' +
          self.clientOptions.bucket + '/' + self.uploadPath + '/' + file.name;
      callback(null, file);
    });
  }
});
