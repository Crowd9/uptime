/**
 * Module dependencies.
 */

var exec = require('child_process').exec;

var util = require('util');
var BasePoller = require('./base');

/**
 * Poller constructor
 *
 * @param {Mixed} Poller Target (e.g. URL)
 * @param {Number} Poller timeout in milliseconds. Without response before this duration, the poller stops and executes the error callback.
 * @param {Function} Error/success callback
 * @api   public
 */
function PingPoller(target, timeout, callback) {
  PingPoller.super_.call(this, target, timeout, callback);
}

util.inherits(PingPoller, BasePoller);

PingPoller.prototype.initialize = function() {
//  if (typeof(this.target) == 'string') {
//    this.target = url.parse(this.target);
//  }
}

/**
 * Launch the actual polling
 *
 * @api   public
 */
PingPoller.prototype.poll = function() {
  PingPoller.super_.prototype.poll.call(this);
  var that = this;

  this.debug("Pinging " + this.target);

  this.request = exec("ping -c 1 "+this.target, this.execCallback.bind(this))
}

/**
 * Ping exec callback
 *
 * @api   private
 */
PingPoller.prototype.execCallback = function (err, stdout, stderr) {
  if(err === null) {
    this.onResponseCallback.bind(this)();
  } else {
    PingPoller.super_.onErrorCallback.bind(this)();
  }
}

/**
 * Response callback
 *
 * Note that all responses may not be successful, as some return non-200 status codes,
 * and others return too slowly.
 * This method handles redirects.
 *
 * @api   private
 */
PingPoller.prototype.onResponseCallback = function() {
  var poller = this;

  this.debug(this.getTime() + "ms - Ping OK");
  poller.debug(poller.getTime() + "ms - Request Finished");
  poller.callback(undefined, poller.getTime(), undefined);
  poller.timer.stop();
}

/**
 * Timeout callback
 *
 * @api   private
 */
PingPoller.prototype.timeoutReached = function() {
  PingPoller.super_.prototype.timeoutReached.call(this);
}

module.exports = PingPoller;
