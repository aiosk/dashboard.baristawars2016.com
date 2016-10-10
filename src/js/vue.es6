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
    mounted(){
        $('.spinner').addClass('hide');
        $('#app.hide').removeClass('hide');

        const elGender = $('.card--gender');
        const JwtAxios = axios.create({
            baseURL: urlBase,
            // timeout: 1000,
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        });
        if (elGender.length > 0) {
            JwtAxios.get('/dashboard/chart/gender/value')
                .then((res)=> {
                    console.log(res);

                    google.charts.load('current', {'packages': ['corechart']});
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
                        const data = google.visualization.arrayToDataTable([
                            ['gender', 'value'],
                            ['male', res.data.male],
                            ['female', res.data.female]
                        ]);
                        var options = {
                            // title: 'My Daily Activities'
                            title: '',
                            // legend: 'none',
                            // pieSliceText: 'label',
                            slices: {1: {offset: 0.2},}
                        };

                        var chart = new google.visualization.PieChart(document.getElementById('genderChart'));

                        chart.draw(data, options);
                    }
                })
                .catch((err)=> {
                })
        }
    },
    computed: {
        profileName(){
            return JSON.parse(localStorage.getItem('profile')).username;
        }
    },
    watch: {},
    methods: {
        isGuest(){
            return !localStorage.getItem('token');
        },
        onLogout(){
            console.log('onLogout');
            localStorage.removeItem('token');
            localStorage.removeItem('profile');

            this.credentials = {
                username: '',
                password: ''
            };
            window.location.reload();

        },
        onLogin(event){
            const form = event.target;
            const buttonSubmit = $(form).find('[type=submit]');
            const progress = $('.progress');
            const cardContent = $('.card-content');
            const cardValidateRow = cardContent.find('.row:nth-child(4)');
            const cardValidate = cardValidateRow.find('div.validate');
            const vm = this;

            buttonSubmit.attr('disabled', true);
            progress.removeClass('hide');
            cardValidateRow.addClass('hide');
            cardValidate.removeClass('invalid valid');

            axios.post(`${urlBase}${form.getAttribute('action')}`, this.credentials)
                .then((res)=> {
                    // console.log(res);
                    if (res.data.status) {
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('profile', JSON.stringify(res.data.profile));

                        window.location.reload()
                    } else {
                        if (res.data.element !== '') {
                            $(`[name=${res.data.element}]`).addClass('invalid')
                                .siblings('label').attr('data-error', res.data.message)
                        } else {
                            cardValidateRow.removeClass('hide');
                            cardValidate.addClass('invalid')
                                .siblings('label').attr('data-error', res.data.message)
                        }
                    }
                    buttonSubmit.attr('disabled', false);
                    progress.addClass('hide');
                })
                .catch((err)=> {
                    buttonSubmit.attr('disabled', false);
                    progress.addClass('hide');

                    cardValidateRow.removeClass('hide');
                    cardValidate.addClass('invalid')
                        .siblings('label').attr('data-error', err)
                })
        }
    }
});
