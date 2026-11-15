Vue.component('app-modal', {
    template: '#tpl-modal',
    data() {
        return {
            isOpen: false,
            title: 'Konfirmasi',
            message: '',
            onConfirmCallback: null
        };
    },
    methods: {
        open(title, message, onConfirm) {
            this.title = title;
            this.message = message;
            this.onConfirmCallback = onConfirm;
            this.isOpen = true;
        },
        close() {
            this.isOpen = false;
            this.onConfirmCallback = null;
        },
        confirm() {
            if (typeof this.onConfirmCallback === 'function') {
                this.onConfirmCallback();
            }
            this.close();
        }
    }
});