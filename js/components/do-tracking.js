Vue.component('do-tracking', {
    template: '#tpl-tracking',
    props: {
        data: { type: Array, required: true }
    },
    data() {
        return {
            searchInput: '',
            activeQuery: '',
            newProgress: {}
        };
    },
    computed: {
        filteredTracking() {
            if (!this.activeQuery) return this.data;
            const q = this.activeQuery.toLowerCase();
            return this.data.filter(item =>
                item.nomorDO.toLowerCase().includes(q) ||
                item.nim.toLowerCase().includes(q)
            );
        }
    },
    methods: {
        executeSearch() {
            this.activeQuery = this.searchInput.trim();
        },
        resetSearch() {
            this.searchInput = '';
            this.activeQuery = '';
        },
        tambahProgress(doItem) {
            const ket = (this.newProgress[doItem.nomorDO] || '').trim();
            if (!ket) return;

            // Format waktu lokal menggunakan Date
            const now = new Date();
            const waktuFormatted = now.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }) + ', ' + now.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            });

            if (!doItem.perjalanan) {
                Vue.set(doItem, 'perjalanan', []);
            }

            doItem.perjalanan.push({
                waktu: waktuFormatted,
                keterangan: ket
            });

            Vue.set(this.newProgress, doItem.nomorDO, '');
            this.$emit('notify', `Progress pengiriman untuk ${doItem.nomorDO} ditambahkan.`);
        }
    }
});