'use strict';

var isProduction = true;
var urlBase = 'http://' + (isProduction ? 'api.baristawars2016.com' : '192.168.2.50:3600');

var app = new Vue({
    el: '#app',
    data: {
        isLogin: true,
        form: {
            method: 'POST',
            href: '/login',
            username: '',
            password: ''
        }
    },
    methods: {
        onLogin: function onLogin(event) {
            var form = event.target;
            console.log(this.form, form.getAttribute('action'), form.getAttribute('method'));
            axios.post('' + urlBase + form.getAttribute('action'), {
                username: this.form.username,
                password: this.form.password
            }).then(function (res) {
                console.log(res);
            }).catch(function (err) {
                console.log(err);
            });
        }
    }
});