'use strict';

var isProduction = true;
var urlBase = 'http://' + (isProduction ? 'api.baristawars2016.com/public' : '192.168.2.50:8080');

axios.defaults.baseURL = urlBase;

var chartSetter = function chartSetter() {
    var JwtAxios = axios.create({
        baseURL: urlBase,
        // timeout: 1000,
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });

    var elGender = $('.card--gender');
    if (elGender.length > 0) {
        (function () {
            var elChart = $('#genderChart');

            JwtAxios.get('/dashboard/chart/gender').then(function (res) {
                // elChart.html(JSON.stringify(res.data));

                google.charts.load('current', { 'packages': ['corechart'] });
                google.charts.setOnLoadCallback(drawChart);

                function drawChart() {
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
            }).catch(function (err) {
                elChart.html(err);
            });
        })();
    }

    var elAge = $('.card--age');
    if (elAge.length > 0) {
        (function () {
            var elChart = $('#ageChart');

            JwtAxios.get('/dashboard/chart/age').then(function (res) {
                elChart.html(res.data.average);
            }).catch(function (err) {
                elChart.html(err);
            });
        })();
    }

    var elPosition = $('.card--position');
    if (elPosition.length > 0) {
        (function () {
            var elChart = $('#positionChart');

            JwtAxios.get('/dashboard/chart/position').then(function (res) {
                // elChart.html(JSON.stringify(res.data));

                google.charts.load('current', { 'packages': ['corechart'] });
                google.charts.setOnLoadCallback(drawChart);

                function drawChart() {
                    var data = google.visualization.arrayToDataTable([['position', 'male', 'female'], ['barista', res.data.barista.items.male, res.data.barista.items.female], ['owner', res.data.owner.items.male, res.data.owner.items.female], ['individu', res.data.individu.items.male, res.data.individu.items.female]]);
                    var view = new google.visualization.DataView(data);
                    view.setColumns([0, 1, { calc: "stringify",
                        sourceColumn: 1,
                        type: "string",
                        role: "annotation" }, 2]);

                    var options = {
                        // title: '',
                        // legend: 'none',
                        // pieSliceText: 'label',
                        isStacked: true,
                        bars: 'horizontal'
                    };

                    var chart = new google.visualization.ColumnChart(document.getElementById('positionChart'));

                    chart.draw(data, options);
                }
            }).catch(function (err) {
                elChart.html(err);
            });
        })();
    }
    var elMaps = $('.card--maps');
    if (elMaps.length > 0) {
        (function () {
            var elChart = $('#mapsChart');

            JwtAxios.get('/dashboard/chart/maps').then(function (res) {
                elChart.html(JSON.stringify(res.data));
            }).catch(function (err) {
                elChart.html(err);
            });
        })();
    }
};

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

        chartSetter();
    },

    computed: {
        profileName: function profileName() {
            var username = void 0;
            try {
                username = JSON.parse(localStorage.getItem('profile')).username;
            } catch (e) {
                username = 'user';
            }
            return username;
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