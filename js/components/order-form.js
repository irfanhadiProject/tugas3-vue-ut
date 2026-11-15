Vue.component('order-form', {
    template: '#tpl-order',
    props: {
        paket: { type: Array, required: true },
        ekspedisi: { type: Array, required: true },
        trackingList: { type: Array, required: true }
    },
    data() {
        const today = new Date().toISOString().split('T')[0];
        return {
            errorMsg: '',
            form: {
                nim: '',
                nama: '',
                ekspedisi: '',
                kodePaket: '',
                tanggalKirim: today
            }
        };
    },
    computed: {
        generatedDoNumber() {
            const currentYear = new Date().getFullYear();
            const sequence = String(this.trackingList.length + 1).padStart(3, '0');
            return `DO${currentYear}-${sequence}`;
        },
        selectedPaketDetail() {
            return this.paket.find(p => p.kodePaket === this.form.kodePaket) || null;
        },
        calculatedTotalHarga() {
            return this.selectedPaketDetail ? this.selectedPaketDetail.harga : 0;
        }
    },
    watch: {
        'form.kodePaket'(newVal) {
            if (newVal) {
                console.log(`Paket dipilih: ${newVal}`);
            }
        }
    },
    methods: {
        submitOrder() {
            this.errorMsg = '';
            if (!this.form.nim || !this.form.nama || !this.form.ekspedisi || !this.form.kodePaket || !this.form.tanggalKirim) {
                this.errorMsg = 'Semua field wajib diisi sebelum menyimpan Delivery Order!';
                return;
            }

            const now = new Date();
            const waktuAwal = now.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }) + ', ' + now.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            });

            const newDO = {
                nomorDO: this.generatedDoNumber,
                nim: this.form.nim,
                nama: this.form.nama,
                ekspedisi: this.form.ekspedisi,
                kodePaket: this.form.kodePaket,
                namaPaket: this.selectedPaketDetail.namaPaket,
                tanggalKirim: this.form.tanggalKirim,
                totalHarga: this.calculatedTotalHarga,
                status: 'Di-packing',
                perjalanan: [
                    {
                        waktu: waktuAwal,
                        keterangan: 'Delivery Order dibuat dan sedang dalam proses packing'
                    }
                ]
            };

            this.$emit('created', newDO);

            this.form.nim = '';
            this.form.nama = '';
            this.form.ekspedisi = '';
            this.form.kodePaket = '';
        }
    }
});