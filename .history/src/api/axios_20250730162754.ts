import axios from 'axios';

// 1. Axios instance oluşturuyoruz, böylece tüm isteklerde aynı baseURL kullanılır
const api = axios.create({
  baseURL: 'https://taskifybackendapi-production.up.railway.app', // Backend adresin, kendi projenin URL'si
});

// 2. İstek gönderilmeden önce çalışacak interceptor ekliyoruz
api.interceptors.request.use(config => {
  // 3. localStorage'dan token'ı alıyoruz
  const token = localStorage.getItem('token');

  // 4. Eğer token varsa, istek header'ına ekliyoruz
  if (token!== null) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 5. İsteği geri döndür, böylece axios devam edebilir
  return config;
}, error => {
  // 6. Hata varsa burada yakalayabiliriz
  return Promise.reject(error);
  console.error("Axios request error:", error);
});

export default api;