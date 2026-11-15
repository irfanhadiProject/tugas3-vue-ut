// Service untuk mengambil dummy data dari file JSON
const ApiService = {
    async fetchBahanAjarData() {
        try {
            const response = await fetch('data/dataBahanAjar.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Gagal memuat dataBahanAjar.json:', error);
            throw error;
        }
    }
};