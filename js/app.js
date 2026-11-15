// Filter Currency Rupiah
Vue.filter('currencyRp', function (value) {
    if (value === null || value === undefined) return 'Rp 0';
    return 'Rp ' + Number(value).toLocaleString('id-ID');
});

// Filter Satuan Buah
Vue.filter('satuanBuah', function (value) {
    if (value === null || value === undefined) return '0 buah';
    return `${value} buah`;
});

// Filter Format Tanggal Indonesia (Contoh: 25 Agustus 2025)
Vue.filter('formatTanggalIndo', function (dateStr) {
    if (!dateStr) return '-';
    const bulanIndo = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const tahun = parts[0];
    const bulan = bulanIndo[parseInt(parts[1], 10) - 1];
    const tanggal = parseInt(parts[2], 10);
    return `${tanggal} ${bulan} ${tahun}`;
});


new Vue({
    el: '#app',
    data: {
        tab: 'stok',
        isLoading: true,
        notification: '',
        state: {
            upbjjList: [],
            kategoriList: [],
            pengirimanList: [],
            stok: [],
            paket: [],
            tracking: []
        }
    },
    async created() {
        try {
            const data = await ApiService.fetchBahanAjarData();
            this.state.upbjjList = data.upbjjList || [];
            this.state.kategoriList = data.kategoriList || [];
            this.state.pengirimanList = data.pengirimanList || [];
            this.state.stok = data.stok || [];
            this.state.paket = data.paket || [];
            this.state.tracking = data.tracking || [];
        } catch (err) {
            this.notification = 'Gagal memuat data JSON. Pastikan aplikasi dijalankan melalui Local Server (mis. Live Server).';
        } finally {
            this.isLoading = false;
        }
    },
    methods: {
        showNotification(msg) {
            this.notification = msg;
        },
        openDeleteConfirm(item) {
            this.$refs.modal.open(
                'Konfirmasi Hapus Data',
                `Apakah Anda yakin ingin menghapus bahan ajar "${item.kode} - ${item.judul}"?`,
                () => {
                    this.state.stok = this.state.stok.filter(i => i.id !== item.id);
                    this.notification = `Bahan ajar ${item.judul} berhasil dihapus.`;
                }
            );
        },
        handleNewDO(newDO) {
            this.state.tracking.push(newDO);
            this.notification = `Delivery Order ${newDO.nomorDO} berhasil dibuat!`;
            this.tab = 'tracking';
        }
    }
});