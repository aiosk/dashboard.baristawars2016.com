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
        $('body > .spinner').addClass('hide');
        $('#app.hide').removeClass('hide');

        chartSetter()
    },
    computed: {
        profileName(){
            let username;
            try{
                username = JSON.parse(localStorage.getItem('profile')).username
            }catch(e) {
                username = 'user'
            }
            return username;
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
        },
        onDownload(event){
            console.log(event);
        }
    }
});
