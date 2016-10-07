var app = new Vue({
    el: '#app',
    data: {
        isGuest: true,
        form: {
            method: 'POST',
            href: '/dashboard/token',
        },
        credentials: {
            username: '',
            password: ''
        }
    },
    mounted(){
        $('.spinner').addClass('hide');
        $('#app.hide').removeClass('hide');
    },
    computed: {},
    watch: {
        isGuest(){
            return !localStorage.getItem('token');
        },
    },
    methods: {
        onLogout(){
            localStorage.removeItem('token');
            localStorage.removeItem('profile');
            this.isGuest = true;
        },
        onLogin(event){
            const form = event.target;
            // console.log(this.form, form.getAttribute('action'), form.getAttribute('method'));
            const formField = this.credentials;

            axios.post(`${urlBase}${form.getAttribute('action')}`, this.form.field)
                .then((res)=> {
                    // console.log(res);
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('profile', JSON.stringify(res.data.profile));
                    this.isGuest = false;
                })
                .catch((err)=> {
                    console.log(err);
                })
        }
    }
});
