# nodemcudht11-firebase
# cara pemakaian 

<p>1. konfigurasi firebase seperti biasa.<p>
   2. Buat real time data base seperti bisa
  
  WAJIB DIGANTI RULES PADA DATABASE NYA SEPERTI DI BAWAH INI </p>


```{
  "rules": {
    "Hasil_Pembacaan": {
      ".read": true,
      ".write": true
    },
    "relay": {
      ".read": true,
      ".write": true
    },
    "chat": {
      ".read": true,
      ".write": true
    }
  }
}
