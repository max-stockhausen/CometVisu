/* ResizeHandler.js 
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


/*
 * Make sure everything looks right when the window gets resized. This is
 * necessary as the scroll effect requires a fixed element size
 */
/**
 * Manager for all resizing issues. It ensures that the real resizing
 * calculations are only done as often as really necessary.
 *
 */
qx.Class.define('cv.ui.layout.ResizeHandler', {
  type: 'static',

  /*
  ******************************************************
    STATICS
  ******************************************************
  */
  statics: {
    states: new cv.ui.layout.States(),

    $pageSize: null,
    $navbarTop: null,
    $navbarBottom: null,
    width: 0,
    height: 0,
    __initial: true,

    __backdropRetries: 0,

    validationQueue: [],

    reset: function() {
      this.states.resetAll();
      this.$pageSize = null;
      this.$navbarTop = null;
      this.$navbarBottom = null;
      this.width = 0;
      this.height = 0;
    },

    __request : null,

    getPageSize: function (noCache) {
      if (!this.$pageSize || noCache === true) {
        this.$pageSize = document.querySelector('#pageSize');
      }
      return this.$pageSize;
    },

    getNavbarTop: function (noCache) {
      if (!this.$navbarTop || noCache === true) {
        this.$navbarTop = document.querySelector('#navbarTop');
      }
      return this.$navbarTop;
    },

    getNavbarBottom: function (noCache) {
      if (!this.$navbarBottom || noCache === true) {
        this.$navbarBottom = document.querySelector('#navbarBottom');
      }
      return this.$navbarBottom;
    },

    queueJob: function(callback) {
      if (this.validationQueue.indexOf(callback) === -1) {
        this.validationQueue.push(callback);
      }
      if (!this.__request) {
        this.__request = qx.bom.AnimationFrame.request(this.flush, this);
      }
    },

    flush: function() {
      while (this.validationQueue.length) {
        const job = this.validationQueue.shift();
        job.apply(this);
      }
      this.__request = null;
    },

    makeAllSizesValid : function() {
      if (this.states.isPageSizeInvalid()) {
        this.makePagesizeValid();
      } // must be first due to dependencies
      if (this.states.isNavbarInvalid()) {
        this.makeNavbarValid();
      }
      if (this.states.isRowspanInvalid()) {
        this.makeRowspanValid();
      }
      if (this.states.isBackdropInvalid()) {
        this.makeBackdropValid();
      }
    },

    makeBackdropValid: function () {
      this.queueJob(this.__makeBackdropValid);
    },

    __makeBackdropValid: function () {
      qx.log.Logger.debug(this, 'makeBackdropValid');
      // TODO: this is structure.pure specific and should be handled by the structure itself
      const templateEngine = cv.TemplateEngine.getInstance();
      const page = templateEngine.getCurrentPage();
      if (!page) {
        return;
      }
      // TODO use page object

      if (page.getPageType() === '2d') {
        const cssPosRegEx = /(\d*)(.*)/;
        const backdrop = page.getDomElement().querySelector('div > ' + page.getBackdropType());
        try {
          const backdropSVG = page.getBackdropType() === 'embed' ? backdrop.getSVGDocument() : null;
          const backdropBBox = backdropSVG ? backdropSVG.children[0].getBBox() : {};
          const backdropNWidth = backdrop.naturalWidth || backdropBBox.width || this.width;
          const backdropNHeight = backdrop.naturalHeight || backdropBBox.height || this.height;
          const backdropFixed = page.getSize() === 'fixed';
          const backdropScale = backdropFixed ? 1 : Math.min(this.width / backdropNWidth, this.height / backdropNHeight);
          const backdropWidth = backdropNWidth * backdropScale;
          const backdropHeight = backdropNHeight * backdropScale;
          const backdropPos = page.getBackdropAlign().split(' ');
          const backdropLeftRaw = backdropPos[0].match(cssPosRegEx);
          const backdropTopRaw = backdropPos[1].match(cssPosRegEx);
          const backdropLeft = backdropLeftRaw[2] === '%' ? (((this.width - backdropWidth) * (+backdropLeftRaw[1]) / 100)) : +backdropLeftRaw[1];
          const backdropTop = backdropTopRaw[2] === '%' ? (this.height > backdropHeight ? ((this.height - backdropHeight) * (+backdropTopRaw[1]) / 100) : 0) : +backdropTopRaw[1];
          const uagent = navigator.userAgent.toLowerCase();

          if (backdrop.complete === false ||
            (page.getBackdropType() === 'embed' && backdropSVG === null) ||
            (backdropBBox.width === 0 && backdropBBox.height === 0) ||
            (this.width === 0 && this.height === 0)
          ) {
            // backdrop not available yet - reload
            qx.event.Timer.once(this.invalidateBackdrop, this, 100);
            return;
          }

          // backdrop available
          if (
            page.getSize() === 'scaled' && page.getBackdropType() === 'embed' &&
            backdropSVG &&
            backdropSVG.children[0].getAttribute('preserveAspectRatio') !== 'none'
          ) {
            backdropSVG.children[0].setAttribute('preserveAspectRatio', 'none');
          }

          // Note 1: this here is a work around for older browsers that can't use
          // the object-fit property yet.
          // Currently (26.05.16) only Safari is known to not support
          // object-position although object-fit itself does work
          // Note 2: The embed element always needs it
          if (
            (page.getBackdropType() === 'embed' ||
            (uagent.indexOf('safari') !== -1 && uagent.indexOf('chrome') === -1)) &&
            page.getSize() !== 'scaled'
          ) {
            backdrop.style.width = backdropWidth + 'px';
            backdrop.style.height = backdropHeight + 'px';
            backdrop.style.left = backdropLeft + 'px';
            backdrop.style.top = backdropTop + 'px';
          }

          if (backdropFixed && !backdropSVG) {
            if (this.height < backdropHeight) {
              backdrop.style.height = backdropHeight + 'px';
            } else {
              backdrop.style.height = '100%';
            }
          }

          page.getDomElement().querySelectorAll('.widget_container').forEach(function (widgetContainer) {
            const widget = cv.ui.structure.WidgetFactory.getInstanceById(widgetContainer.id);
            let value;
            const layout = widget.getResponsiveLayout();
            let scale = backdropScale;
            if (layout) {
              // this assumes that a .widget_container has only one child and this
              // is the .widget itself
              const style = widgetContainer.children[0].style;
              if (layout.scale === 'false') {
                scale = 1.0;
              }

              if ('x' in layout) {
                value = layout.x.match(cssPosRegEx);
                if (value[2] === 'px') {
                  style.left = (backdropLeft + value[1] * scale) + 'px';
                } else {
                  style.left = layout.x;
                }
              }

              if ('y' in layout) {
                value = layout.y.match(cssPosRegEx);
                if (value[2] === 'px') {
                  style.top = (backdropTop + value[1] * scale) + 'px';
                } else {
                  style.top = layout.y;
                }
              }

              if ('width' in layout) {
                style.width = layout.width;
              }

              if ('height' in layout) {
                style.height = layout.height;
              }
            }
          }, this);
          this.__backdropRetries = 0;
        } catch (e) {
          if (e.name === 'NotSupportedError') {
            if (this.__backdropRetries <= 5) {
              qx.bom.AnimationFrame.request(this.__makeBackdropValid, this);
              this.__backdropRetries++;
            }
          }
          qx.log.Logger.error(this, e);
        }
      }

      this.states.setBackdropInvalid(false);
    },

    makeNavbarValid: function () {
      this.queueJob(this.__makeNavbarValid);
    },

    __makeNavbarValid: function() {
      qx.log.Logger.debug(this, 'makeNavbarValid');
      if (cv.ui.layout.Manager.adjustColumns()) {
        // the amount of columns has changed -> recalculate the widgets widths
        cv.ui.layout.Manager.applyColumnWidths();
      }
      this.states.setNavbarInvalid(false);
    },

    makePagesizeValid: function () {
      if (this.__initial === true) {
        // do not queue -> call now
        this.__initial = false;
        this.__makePagesizeValid();
      } else {
        this.queueJob(this.__makePagesizeValid);
      }
    },

    __makePagesizeValid: function() {
      if (!cv.Config.currentPageId) {
        return;
      }
      qx.log.Logger.debug(this, 'makePagesizeValid');
      const page = cv.ui.structure.WidgetFactory.getInstanceById(cv.Config.currentPageId);
      if (page && !page.isInitialized()) {
        page.addListenerOnce('changeInitialized', this.__makePagesizeValid, this);
        return;
      }
      this.width = cv.ui.layout.Manager.getAvailableWidth();
      this.height = cv.ui.layout.Manager.getAvailableHeight();
      const pageSizeElement = this.getPageSize();

      if (pageSizeElement) {
        pageSizeElement.innerHTML = '#main,.page{width:' + this.width + 'px;height:' + this.height + 'px;}';
      }

      this.states.setPageSizeInvalid(false);
    },

    makeRowspanValid: function () {
      this.queueJob(this.__makeRowspanValid);
    },

    __makeRowspanValid: function () {
      qx.log.Logger.debug(this, 'makeRowspanValid');
      let elem = document.querySelector('#calcrowspan');
      if (!elem) {
        elem = qx.dom.Element.create('div', {
          'class': 'clearfix',
          'id': 'calcrowspan',
          'html': '<div id="containerDiv" class="widget_container"><div class="widget clearfix text" id="innerDiv"></div>'
        });
        document.body.appendChild(elem);
      }
      // use the internal div for height as in mobile view the elem uses the full screen height
      this.__updateRowHeight(elem.querySelector('#containerDiv'));
    },

    __updateRowHeight: function(elem) {
      const rect = elem.getBoundingClientRect();
      const height = Math.round(rect.bottom - rect.top);
      if (height === 0) {
        // not ready try again
        const self = this;
        window.requestAnimationFrame(() => {
          self.__updateRowHeight(elem);
        });
        return;
      }
      let styles = '';

      for (let rowspan in cv.Config.configSettings.usedRowspans) {
        styles += '.rowspan.rowspan' + rowspan + ' { height: ' + Math.round(rowspan * height) + 'px;}\n';
      }
      const calcrowspan = document.querySelector('#calcrowspan');
      if (calcrowspan) {
        calcrowspan.parentNode.removeChild(calcrowspan);
      }

      // set css style
      const rowSpanStyle = document.querySelector('#rowspanStyle');
      if (rowSpanStyle) {
        rowSpanStyle.innerHTML = styles;
      }
      this.states.setRowspanInvalid(false);
    },

    invalidateBackdrop: function () {
      qx.log.Logger.debug(this, 'backdrop');
      this.states.setBackdropInvalid(true);
      this.makeAllSizesValid();
    },
    invalidateNavbar: function () {
      qx.log.Logger.debug(this, 'invalidateNavbar');
      this.states.setNavbarInvalid(true);
      this.states.setPageSizeInvalid(true);
      this.makeAllSizesValid();
    },
    invalidateRowspan: function () {
      this.states.setRowspanInvalid(true);
      this.makeAllSizesValid();
    },
    invalidateScreensize: function () {
      qx.log.Logger.debug(this, 'invalidateScreensize');
      this.states.set({
        pageSizeInvalid: true,
        rowspanInvalid: true,
        navbarInvalid: true,
        backdropInvalid: true
      });
      this.makeAllSizesValid();
    }
  }
});
