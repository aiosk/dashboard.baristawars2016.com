'use strict';

var isProduction = true;
var urlBase = 'http://' + (isProduction ? 'api.baristawars2016.com/public' : '192.168.2.50:8080');

var app = new Vue({
    el: '#app',
    data: {
        isGuest: true,
        form: {
            method: 'POST',
            href: '/dashboard/token'
        },
        credentials: {
            username: '',
            password: ''
        }
    },
    mounted: function mounted() {
        $('.spinner').addClass('hide');
        $('#app.hide').removeClass('hide');
    },

    computed: {},
    watch: {
        isGuest: function isGuest() {
            return !localStorage.getItem('token');
        }
    },
    methods: {
        onLogout: function onLogout() {
            localStorage.removeItem('token');
            localStorage.removeItem('profile');
            this.isGuest = true;
        },
        onLogin: function onLogin(event) {
            var _this = this;

            var form = event.target;
            // console.log(this.form, form.getAttribute('action'), form.getAttribute('method'));
            var formField = this.credentials;

            axios.post('' + urlBase + form.getAttribute('action'), this.form.field).then(function (res) {
                // console.log(res);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('profile', JSON.stringify(res.data.profile));
                _this.isGuest = false;
            }).catch(function (err) {
                console.log(err);
            });
        }
    }
});