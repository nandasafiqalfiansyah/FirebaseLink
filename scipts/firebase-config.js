// Mendapatkan referensi ke form dan inputan
var configForm = document.getElementById("config-form");
var apiKeyInput = document.getElementById("apiKey");
var authDomainInput = document.getElementById("authDomain");
var databaseURLInput = document.getElementById("databaseURL");
var projectIdInput = document.getElementById("projectId");
var storageBucketInput = document.getElementById("storageBucket");
var messagingSenderIdInput = document.getElementById("messagingSenderId");
var appIdInput = document.getElementById("appId");

// Mengisi inputan dengan data dari Local Storage (jika ada)
var savedConfig = localStorage.getItem("firebaseConfig");
if (savedConfig) {
  var firebaseConfig = JSON.parse(savedConfig);
  apiKeyInput.value = firebaseConfig.apiKey;
  authDomainInput.value = firebaseConfig.authDomain;
  databaseURLInput.value = firebaseConfig.databaseURL;
  projectIdInput.value = firebaseConfig.projectId;
  storageBucketInput.value = firebaseConfig.storageBucket;
  messagingSenderIdInput.value = firebaseConfig.messagingSenderId;
  appIdInput.value = firebaseConfig.appId;
}
// Menambahkan event listener pada form
configForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Mencegah refresh halaman

  // Mengambil nilai dari inputan
  var apiKey = apiKeyInput.value;
  var authDomain = authDomainInput.value;
  var databaseURL = databaseURLInput.value;
  var projectId = projectIdInput.value;
  var storageBucket = storageBucketInput.value;
  var messagingSenderId = messagingSenderIdInput.value;
  var appId = appIdInput.value;

  // Konfigurasi Firebase
  var firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    databaseURL: databaseURL,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
  };

  // Menyimpan konfigurasi Firebase ke Local Storage
  localStorage.setItem("firebaseConfig", JSON.stringify(firebaseConfig));

  // Menginisialisasi Firebase
  firebase.initializeApp(firebaseConfig);

  // Mengakses Firebase Database
  var database = firebase.database();

  // Mendengarkan perubahan data pada node 'sensor'
  database.ref("Hasil_Pembacaan").on("value", function (snapshot) {
    var data = snapshot.val();
    var suhu = data ? data.suhu : null;
    var kelembapan = data ? data.kelembapan : null;

    document.getElementById("suhu").innerHTML =
      suhu !== null ? suhu + " °C" : "-";
    document.getElementById("kelembapan").innerHTML =
      kelembapan !== null ? kelembapan + " %" : "-";

    // Menggambar grafik lingkaran
    var chartData = {
      labels: ["Suhu", "Kelembapan"],
      datasets: [
        {
          data: [suhu, kelembapan],
          backgroundColor: ["#0088cc", "#ffaa00"],
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    };

    var chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: "bottom",
        labels: {
          fontColor: "#333333",
        },
      },
    };

    var ctx = document.getElementById("chart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "pie",
      data: chartData,
      options: chartOptions,
    });
  });

  // Mendapatkan nilai relay dari database
  var relayRef = database.ref("relay");

  // Fungsi untuk mengubah status relay
  function toggleRelay() {
    relayRef.once("value", function (snapshot) {
      var relayStatus = snapshot.val();
      relayRef.set(!relayStatus);
    });
  }

  // Memantau perubahan pada relay di database
  relayRef.on("value", function (snapshot) {
    var relayStatus = snapshot.val();
    var btnToggle = document.getElementById("btn-toggle");
    var notification = document.getElementById("notification");

    if (relayStatus) {
      btnToggle.innerHTML = "Matikan Relay";
      btnToggle.classList.remove("off");
      showNotification(notification, "Relay telah hidup 😇", "success");
    } else {
      btnToggle.innerHTML = "Hidupkan Relay";
      btnToggle.classList.add("off");
      showNotification(notification, "Relay telah mati 😵", "error");
    }
  });

  // Fungsi untuk menampilkan notifikasi
  function showNotification(element, message, type) {
    element.innerHTML = message;
    element.classList.add("show");
    element.classList.add(type);

    setTimeout(function () {
      element.classList.remove("show");
      element.classList.remove(type);
    }, 1000);
  }
  var btnToggle = document.getElementById("btn-toggle");
  btnToggle.addEventListener("click", toggleRelay);

  // Mendapatkan referensi elemen-elemen chat
  var chatForm = document.getElementById("chat-form");
  var chatInput = document.getElementById("chat-input");
  var chatMessages = document.getElementById("chat-messages");

  // Menambahkan event listener pada form chat
  chatForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Menghindari refresh halaman

    var message = chatInput.value.trim(); // Menghapus spasi di awal dan akhir pesan

    if (message !== "") {
      sendMessage(message);
      chatInput.value = ""; // Mengosongkan input chat
    }
  });

  // Mengirim pesan ke database
  function sendMessage(message) {
    var timestamp = Date.now(); // Mendapatkan timestamp saat ini

    database.ref("chat/" + timestamp).set({
      message: message,
    });
  }

  // Mendapatkan data pesan dari database
  database.ref("chat").on("child_added", function (snapshot) {
    var message = snapshot.val().message;
    var timestamp = snapshot.key;

    displayMessage(message, timestamp);
  });

  // Menampilkan pesan ke elemen chat
  function displayMessage(message, timestamp) {
    var chatMessage = document.createElement("div");
    chatMessage.classList.add("chat-message");

    var chatTimestamp = document.createElement("span");
    chatTimestamp.classList.add("chat-timestamp");
    chatTimestamp.textContent = formatTimestamp(timestamp);

    var chatContent = document.createElement("p");
    chatContent.textContent = message;

    chatMessage.appendChild(chatTimestamp);
    chatMessage.appendChild(chatContent);

    chatMessages.appendChild(chatMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll ke bawah
  }

  // Format timestamp menjadi format yang lebih mudah dibaca
  function formatTimestamp(timestamp) {
    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return hours + ":" + minutes + ":" + seconds;
  }

  var deleteMessageButton = document.getElementById("delete-message-button");
  deleteMessageButton.addEventListener("click", function () {
    // Menghapus semua pesan dari Firebase Database
    var chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = "";

    // Menghapus semua pesan dari Firebase Realtime Database
    firebase.database().ref("chat").remove();
  });

  // // Mengosongkan inputan setelah konfigurasi di set
  // apiKeyInput.value = "";
  // authDomainInput.value = "";
  // databaseURLInput.value = "";
  // projectIdInput.value = "";
  // storageBucketInput.value = "";
  // messagingSenderIdInput.value = "";
  // appIdInput.value = "";

  alert("Konfigurasi Firebase berhasil di set!");
});

// Mendapatkan tombol hapus dari Local Storage
var deleteButton = document.getElementById("delete-button");

// Menambahkan event listener pada tombol hapus
deleteButton.addEventListener("click", function () {
  // Menghapus konfigurasi Firebase dari Local Storage
  localStorage.removeItem("firebaseConfig");

  // Mengosongkan inputan
  apiKeyInput.value = "";
  authDomainInput.value = "";
  databaseURLInput.value = "";
  projectIdInput.value = "";
  storageBucketInput.value = "";
  messagingSenderIdInput.value = "";
  appIdInput.value = "";

  // ...
});
