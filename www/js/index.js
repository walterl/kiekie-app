/* jshint esversion: 6 */

import $ from 'jquery';

class App {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        $(document).bind('deviceready', this.onDeviceReady.bind(this));
    }

    status(s) {
        var $el = $('#status');
        if (!s) {
            return $el.html();
        }
        $el.html(s);
    }

    takePicture() {
        var me = this;

        me.status('Taking picture...');
        navigator.camera.getPicture(function(picData) {
            $('#picture').append($('<img>', {src: picData}));
            me.status('Picture taken');
        }, function() {
            me.status('Failed taking picture');
        });
    }

    // Event handlers //
    onDeviceReady() {
        this.status('Device ready');
        $('#btnPic').click(this.takePicture.bind(this));
    }
}

new App();
