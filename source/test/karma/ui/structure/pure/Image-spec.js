/* Image-spec.js 
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
 * Unit tests for image widget
 *
 * @author Tobias Bräutigam
 * @since 2016
 */
describe('testing a image widget', function() {
  var Con;
  var spiedTimer;

  beforeEach(function () {
    Con = qx.event.Timer;

    spyOn(qx.event, 'Timer').and.callFake(function () {
      spiedTimer = new Con();
      spyOn(spiedTimer, 'start');
      return spiedTimer;
    });

    qx.event.Timer.once = Con.once;
  });

  afterEach(function () {
    qx.event.Timer = Con;
    this.spiedTimer = null;
  });

  it('should test the image creator', function () {
    const [widget, element] = this.createTestWidgetString('image', {
      src: '/source/resource/icons/comet_64_ff8000.png',
      flavour: 'potassium'
    }, '<label>Test</label>');

    expect(element).toHaveClass('image');
    expect(element).toHaveLabel('Test');
    expect(widget.getPath()).toBe('id_0');
    expect(element.querySelector('img').getAttribute('src')).toBe('/source/resource/icons/comet_64_ff8000.png');
    expect(element.querySelector('img').getAttribute('style')).toBe('width:100%;');
  });

  it('should test the image creator and refreshing', function() {
    var res = this.createTestElement('image', {
      src: '',
      width: '50%',
      height: '51%',
      refresh: 5
    });
    var widget = res.getDomElement();
    qx.event.message.Bus.dispatchByName('setup.dom.finished');

    expect(spiedTimer.start).toHaveBeenCalled();
    expect(widget.querySelector('img').getAttribute('style')).toBe('width:50%;height:51%;');
  });

  it('should test the image creator width size', function() {
    var res = this.createTestElement('image', {
      src: '',
      widthfit: 'true'
    });
    var widget = res.getDomElement();

    expect(widget.querySelector('img').getAttribute('style')).toBe('width:100%;max-width:100%;');
  });

  it('should test the image placeholder src mode', function() {
    var res = this.createTestElement('image', {
      src: '/source/resource/icons/comet_64_ff8000.png',
      placeholder: 'src'
    }, null, 'TestItem', {
      transform: 'OH:string'
    });
    var widget = res.getDomElement();

    expect(widget.querySelector('img').getAttribute('src')).toBe('/source/resource/icons/comet_64_ff8000.png');

    res.update('TestItem', '/source/resource/qx/static/blank.gif');

    expect(widget.querySelector('img').getAttribute('src')).toBe('/source/resource/qx/static/blank.gif');

    res.update('TestItem', '');

    expect(widget.querySelector('img').getAttribute('src')).toBe('/source/resource/icons/comet_64_ff8000.png');
  });

  it('should test the image placeholder hide mode', function() {
    var res = this.createTestElement('image', {
      src: '',
      placeholder: 'hide'
    }, null, 'TestItem', {
      transform: 'OH:string'
    });
    var widget = res.getDomElement();

    expect(widget.querySelector('img').getAttribute('src').endsWith('qx/static/blank.gif')).toBeTruthy();

    res.update('TestItem', '/source/resource/icons/comet_64_ff8000.png');

    expect(widget.querySelector('img').getAttribute('src')).toBe('/source/resource/icons/comet_64_ff8000.png');

    res.update('TestItem', '');

    expect(widget.querySelector('img').getAttribute('src').endsWith('qx/static/blank.gif')).toBeTruthy();
  });

  it('should test the image placeholder exclude mode', function() {
    var res = this.createTestElement('image', {
      src: '',
      placeholder: 'exclude'
    }, null, 'TestItem', {
      transform: 'OH:string'
    });
    var widget = res.getDomElement();

    expect(widget.querySelector('img').getAttribute('style')).toBe('width:100%;display:none;');

    res.update('TestItem', '/source/resource/icons/comet_64_ff8000.png');

    expect(widget.querySelector('img').getAttribute('style')).toBe('width: 100%; display: inline;');

    res.update('TestItem', '');

    expect(widget.querySelector('img').getAttribute('style')).toBe('width: 100%; display: none;');
  });
});

describe('testing the refresh caching of the image widget', function() {
  it('should test refreshing with full cache control', function(done) {
    var widget = this.createTestElement('image', {
      src: '/source/resource/icons/comet_64_ff8000.png',
      width: '50%',
      height: '51%',
      refresh: 1,
      cachecontrol: 'full'
    });
    this.initWidget(widget);
    var domElement = widget.getDomElement();

    expect(domElement.querySelector('img').getAttribute('src')).toBe('/source/resource/icons/comet_64_ff8000.png');

    qx.event.Timer.once(function() {
      expect(domElement.querySelector('img').getAttribute('src')).toMatch(/^\/source\/resource\/icons\/comet_64_ff8000.png\?/);

      // cleanup
      widget.dispose();
      done();
    }, this, 1200);
  });

  it('should test refreshing with weak cache control', function(done) {
    var widget = this.createTestElement('image', {
      src: '/source/resource/icons/comet_64_ff8000.png',
      width: '50%',
      height: '51%',
      refresh: 1,
      cachecontrol: 'weak'
    });
    this.initWidget(widget);
    var domElement = widget.getDomElement();

    expect(domElement.querySelector('img').getAttribute('src')).toBe('/source/resource/icons/comet_64_ff8000.png');
    widget.setVisible(true);

    qx.event.Timer.once(function() {
      expect(domElement.querySelector('img').getAttribute('src')).toMatch(/^\/source\/resource\/icons\/comet_64_ff8000.png#/);

      // cleanup
      widget.dispose();
      done();
    }, this, 1200);
  });

  it('should test refreshing with no cache control', function(done) {
    var widget = this.createTestElement('image', {
      src: '/source/resource/icons/comet_64_ff8000.png',
      width: '50%',
      height: '51%',
      refresh: 1,
      cachecontrol: 'none'
    });
    qx.event.message.Bus.dispatchByName('setup.dom.finished');
    var domElement = widget.getDomElement();

    expect(domElement.querySelector('img').getAttribute('src')).toBe('/source/resource/icons/comet_64_ff8000.png');

    qx.event.Timer.once(function() {
      expect(domElement.querySelector('img').getAttribute('src')).toBe('/source/resource/icons/comet_64_ff8000.png');

      // cleanup
      widget.dispose();
      done();
    }, this, 1200);
  });

  it('should test refreshing with no cache control and long refresh time', function(done) {
    var widget = this.createTestElement('image', {
      src: '/source/resource/icons/comet_64_ff8000.png',
      width: '50%',
      height: '51%',
      refresh: 10,
      cachecontrol: 'none'
    });
    qx.event.message.Bus.dispatchByName('setup.dom.finished');
    var domElement = widget.getDomElement();

    expect(domElement.querySelector('img').getAttribute('src')).toBe('/source/resource/icons/comet_64_ff8000.png');

    qx.event.Timer.once(function() {
      expect(domElement.querySelector('img').getAttribute('src')).toBe('/source/resource/icons/comet_64_ff8000.png');

      // cleanup
      widget.dispose();
      done();
    }, this, 1200);
  });
});
