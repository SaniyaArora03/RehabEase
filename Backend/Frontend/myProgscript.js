// Static Chart Data for Now
const ctx = document.getElementById('progressChart').getContext('2d');

const progressChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{
            label: 'Accuracy %',
            data: [70, 75, 80, 85],
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
