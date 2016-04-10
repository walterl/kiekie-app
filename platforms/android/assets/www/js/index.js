/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
