document.addEventListener("DOMContentLoaded",async()=>{
    const res = await fetch("http://127.0.0.1:5001/api/progress");
    const data = await res.json();
    //logout
    document.querySelector(".fa-right-from-bracket").addEventListener("click", () => {
    localStorage.removeItem("token"); // remove auth
    window.location.href = "/login.html";
});

    document.querySelector(".streak p").innerText = data.streak;
        document.getElementById("sessions-count").innerText = data.sessions;
        document.getElementById("accuracy-percent").innerText = data.accuracy + "%";
        document.getElementById("improvement-level").innerText = data.improvement;
        const ctx = document.getElementById('progressChart').getContext('2d');

const progressChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{
            label: 'Accuracy %',
            data: [70, 75, 80, 85,data.accuracy],
            borderColor: '#4a90e2',
            backgroundColor: 'rgba(74, 144, 226, 0.2)',
            fill: true,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: true }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});

})
