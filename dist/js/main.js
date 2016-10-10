'use strict';

var isProduction = true;
var urlBase = 'http://' + (isProduction ? 'api.baristawars2016.com/public' : '192.168.2.50:8080');

axios.defaults.baseURL = urlBase;

var app = new Vue({
    el: '#app',
    data: {
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
        $('body > .spinner').addClass('hide');
        $('#app.hide').removeClass('hide');

        var elGender = $('.card--gender');
        var JwtAxios = axios.create({
            baseURL: urlBase,
            // timeout: 1000,
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (elGender.length > 0) {
            JwtAxios.get('/dashboard/chart/gender/value').then(function (res) {
                console.log(res);

                google.charts.load('current', { 'packages': ['corechart'] });
                google.charts.setOnLoadCallback(drawChart);

                function drawChart() {
                    // var data = google.visualization.arrayToDataTable([
                    //     ['Task', 'Hours per Day'],
                    //     ['Work',     11],
                    //     ['Eat',      2],
                    //     ['Commute',  2],
                    //     ['Watch TV', 2],
                    //     ['Sleep',    7]
                    // ]);
                    var data = google.visualization.arrayToDataTable([['gender', 'value'], ['male', res.data.male], ['female', res.data.female]]);
                    var options = {
                        // title: 'My Daily Activities'
                        title: '',
                        // legend: 'none',
                        // pieSliceText: 'label',
                        slices: { 1: { offset: 0.2 } }
                    };

                    var chart = new google.visualization.PieChart(document.getElementById('genderChart'));

                    chart.draw(data, options);
                }
            }).catch(function (err) {});
        }
    },

    computed: {
        profileName: function profileName() {
            return JSON.parse(localStorage.getItem('profile')).username;
        }
    },
    watch: {},
    methods: {
        isGuest: function isGuest() {
            return !localStorage.getItem('token');
        },
        onLogout: function onLogout() {
            console.log('onLogout');
            localStorage.removeItem('token');
            localStorage.removeItem('profile');

            this.credentials = {
                username: '',
                password: ''
            };
            window.location.reload();
        },
        onLogin: function onLogin(event) {
            var form = event.target;
            var buttonSubmit = $(form).find('[type=submit]');
            var progress = $('.progress');
            var cardContent = $('.card-content');
            var cardValidateRow = cardContent.find('.row:nth-child(4)');
            var cardValidate = cardValidateRow.find('div.validate');
            var vm = this;

            buttonSubmit.attr('disabled', true);
            progress.removeClass('hide');
            cardValidateRow.addClass('hide');
            cardValidate.removeClass('invalid valid');

            axios.post('' + urlBase + form.getAttribute('action'), this.credentials).then(function (res) {
                // console.log(res);
                if (res.data.status) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('profile', JSON.stringify(res.data.profile));

                    window.location.reload();
                } else {
                    if (res.data.element !== '') {
                        $('[name=' + res.data.element + ']').addClass('invalid').siblings('label').attr('data-error', res.data.message);
                    } else {
                        cardValidateRow.removeClass('hide');
                        cardValidate.addClass('invalid').siblings('label').attr('data-error', res.data.message);
                    }
                }
                buttonSubmit.attr('disabled', false);
                progress.addClass('hide');
            }).catch(function (err) {
                buttonSubmit.attr('disabled', false);
                progress.addClass('hide');

                cardValidateRow.removeClass('hide');
                cardValidate.addClass('invalid').siblings('label').attr('data-error', err);
            });
        }
    }
});