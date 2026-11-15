Vue.component('ba-stock-table', {
    template: '#tpl-stock',
    props: {
        items: { type: Array, required: true },
        upbjjList: { type: Array, required: true },
        kategoriList: { type: Array, required: true }
    },
    data() {
        return {
            filters: {
                upbjj: '',
                kategori: '',
                onlyReorder: false
            },
            sortBy: 'judul',
            formError: '',
            editError: '',
            formBaru: {
                kode: '',
                judul: '',
                upbjj: '',
                kategori: '',
                qty: 10,
                safety: 5,
                harga: 75000,
                lokasiRak: 'Rak A-01'
            },
            editingItem: null
        };
    },
    computed: {
        filteredStokList() {
            return this.items
                .filter(item => {
                    const matchUpbjj = !this.filters.upbjj || item.upbjj === this.filters.upbjj;
                    const matchKategori = !this.filters.kategori || item.kategori === this.filters.kategori;
                    const matchReorder = !this.filters.onlyReorder || (item.qty < item.safety || item.qty === 0);
                    return matchUpbjj && matchKategori && matchReorder;
                })
                .sort((a, b) => {
                    if (this.sortBy === 'judul') {
                        return a.judul.localeCompare(b.judul);
                    } else if (this.sortBy === 'qty') {
                        return a.qty - b.qty;
                    } else if (this.sortBy === 'harga') {
                        return a.harga - b.harga;
                    }
                    return 0;
                });
        }
    },
    watch: {
        'filters.upbjj'(newVal) {
            if (!newVal) {
                this.filters.kategori = '';
            }
            this.$emit('notify', `Filter UT-Daerah diubah menjadi: ${newVal || 'Semua Daerah'}`);
        },
        'filters.onlyReorder'(newVal) {
            if (newVal) {
                this.$emit('notify', 'Menampilkan hanya bahan ajar dengan stok menipis atau kosong.');
            }
        }
    },
    methods: {
        resetFilters() {
            this.filters.upbjj = '';
            this.filters.kategori = '';
            this.filters.onlyReorder = false;
            this.sortBy = 'judul';
        },
        tambahStok() {
            this.formError = '';
            if (!this.formBaru.kode || !this.formBaru.judul || !this.formBaru.upbjj || !this.formBaru.kategori) {
                this.formError = 'Kode, Judul, UT-Daerah, dan Kategori wajib diisi!';
                return;
            }
            if (this.formBaru.qty < 0 || this.formBaru.safety < 1) {
                this.formError = 'Qty minimal 0 dan Safety Stock minimal 1!';
                return;
            }

            const newItem = {
                id: Date.now(),
                ...this.formBaru,
                catatanHTML: '<em>Data baru ditambahkan</em>'
            };

            this.items.push(newItem);
            this.$emit('notify', `Berhasil menambah bahan ajar: ${newItem.judul}`);

            this.formBaru = {
                kode: '',
                judul: '',
                upbjj: '',
                kategori: '',
                qty: 10,
                safety: 5,
                harga: 75000,
                lokasiRak: 'Rak A-01'
            };
        },
        startEdit(item) {
            this.editError = '';
            this.editingItem = JSON.parse(JSON.stringify(item));
        },
        simpanEdit() {
            this.editError = '';
            if (!this.editingItem.judul || this.editingItem.qty < 0 || this.editingItem.safety < 1) {
                this.editError = 'Pastikan judul terisi, Qty >= 0, dan Safety >= 1!';
                return;
            }

            const index = this.items.findIndex(i => i.id === this.editingItem.id);
            if (index !== -1) {
                Vue.set(this.items, index, { ...this.editingItem });
                this.$emit('notify', `Data ${this.editingItem.judul} berhasil diperbarui.`);
            }
            this.editingItem = null;
        },
        requestDelete(item) {
            this.$emit('confirm-delete', item);
        }
    }
});