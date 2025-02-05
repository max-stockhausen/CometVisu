/* FileWorker.js 
 * 
 * copyright (c) 2010-2022, Christian Mayer and the CometVisu contributers.
 * 
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; either version 3 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA
 */


/**
 * Worker script that handles file related operations like modification checking or xml validation
 */
qx.Class.define('cv.data.FileWorker', {
  extend: qx.core.Object,
  type: 'singleton',

  /*
  ***********************************************
    CONSTRUCTOR
  ***********************************************
  */
  construct: function () {
    this.base(arguments);
    this._files = [];
    this._worker = new Worker(qx.util.ResourceManager.getInstance().toUri('manager/worker.js'));
    this._worker.onmessage = this._onMessage.bind(this);
    this._validationCallbacks = {};
  },

  /*
  ***********************************************
    EVENTS
  ***********************************************
  */
  events: {
    message: 'qx.event.type.Data'
  },

  /*
  ***********************************************
    MEMBERS
  ***********************************************
  */
  members: {
    _worker: null,
    _validationCallbacks: null,
    _counter: 0,

    postMessage: function (msg) {
      this._worker.postMessage(msg);
    },

    validateConfig: function (url) {
      return new Promise(function (resolve, reject) {
        // check if there is already one validation request ongoing
        if (!Object.prototype.hasOwnProperty.call(this._validationCallbacks, url)) {
          this._validationCallbacks[url] = [resolve];
          this._worker.postMessage(['validateConfig', {
            path: url
          }]);
        } else {
          this._validationCallbacks[url].push(resolve);
        }
      }.bind(this));
    },

    validateXmlConfig: function(code) {
      return new Promise(function (resolve, reject) {
        const id = this._counter++;
          this._validationCallbacks[id] = [resolve];
          this._worker.postMessage(['validateXmlConfig', id, code, true]);
      }.bind(this));
    },

    _onMessage: function (e) {
      let topic = e.data.shift();
      let data = e.data.shift();
      let path = e.data.shift();
      switch (topic) {
        case 'validationResult':
          if (Object.prototype.hasOwnProperty.call(this._validationCallbacks, path)) {
            const callbacks = this._validationCallbacks[path];
            delete this._validationCallbacks[path];
            callbacks.forEach(function(cb) {
              cb(data);
            });
          }
          break;
      }
      this.fireDataEvent('message', {
        topic: topic,
        data: data,
        path: path
      });
    }
  },

  /*
  ***********************************************
    DESTRUCTOR
  ***********************************************
  */
  destruct: function () {
    this._worker = null;
  }
});
