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
        onLogin(event){
            const form = event.target;
            console.log(this.form, form.getAttribute('action'), form.getAttribute('method'));
            axios.post(`${urlBase}${form.getAttribute('action')}`, {
                username: this.form.username,
                password: this.form.password
            })
                .then((res)=> {
                    console.log(res);
                })
                .catch((err)=> {
                    console.log(err);
                })

        }
    }
});
