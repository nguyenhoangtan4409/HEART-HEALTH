/// <reference types="chart.js" />
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('username');

let globalData;
const labelH = [];
const dataH = {
  labels: labelH,
  datasets: [
    {
      label: 'Nhịp tim',
      data: [],
      backgroundColor: 'rgba(255, 0, 0, 0.9)',
      borderColor: '#f82323',
      pointRadius: 15,
      tension: 0.4
    }
  ]
};
const labelS = [];
const dataS = {
  labels: labelS,
  datasets: [
    {
      label: 'SpO2',
      backgroundColor: 'rgba(134, 205, 13, 0.9)',
      borderColor: '#86cd0d',
      pointRadius: 15,
      data: [],
      tension: 0.4,
    }
  ]
};
const configH = {
  type: 'line',
  data: dataH,
  options: {
    scales: {
      x: {
        ticks: {
          display: true,
          pointRadius: 4,
          font: {
            size: 16,
            weight: 'bold',
          },
        },
      },
      y: {
        ticks: {
          display: true,
          pointRadius: 4,
          font: {
            size: 16,
            weight: 'bold',
          },
        },
      },
    },
  },
};

const configS = {
  type: 'line',
  data: dataS,
  options: {
    scales: {
      x: {
        ticks: {
          display: true,
          pointRadius: 4,
          font: {
            size: 16,
            weight: 'bold',
          },
        },
      },
      y: {
        ticks: {
          display: true,
          pointRadius: 4,
          font: {
            size: 16,
            weight: 'bold',
          },
        },
      },
    },
  },
};

// Chart.defaults.color = '#484459';
// Chart.defaults.borderColor = '#484459';

const canvasH = document.getElementById('canvasH');
const canvasS = document.getElementById('canvasS');
const chartH = new Chart(canvasH, configH);
const chartS = new Chart(canvasS, configS);

let currentIndex = 0;
let end = 0;
let lastTimestamp = null;

function updateChart() {
  chartH.update();
  chartS.update();
}

function updateData(index) {
  dataH.datasets[0].data.push(globalData[index].heartbeat);
  dataS.datasets[0].data.push(globalData[index].sp02);
  updateChart();
}

function fetchDataAndInitializeChart() {
fetch(`/api/v1/user/getuser/${username}`)
  .then(response => response.json())
  .then(data => {
      if (data.success) {
        idUser = data.data._id;
        console.log(`idUser for ${username}: ${idUser}`);
        fetch(`/api/v1/sensor/${idUser}`)
          .then(response => response.json())
          .then(data => {
            globalData = data;
            labelH.push(...data.map(item => item.timing.substring(11, 19)));
            labelS.push(...data.map(item => item.timing.substring(11, 19)));
            lastTimestamp = data[data.length - 1].timing;
            currentIndex = globalData.length - 5;
            end = globalData.length - 1;
            updateChartConfiguration();
          })
        .catch(error => {
          console.error('Lỗi khi lấy dữ liệu sensor:', error);
        });
        }
      else{
        console.log("Get user không thành công");
      }
  })
  .catch(error => {
    console.error('Lỗi khi gọi API get user by username:', error);
  });
}

const socket = io();

socket.on('newData', function (data) {
  globalData.push(data);
  currentIndex = globalData.length - 5;
  end = globalData.length - 1;
  labelH.push(data.timing.substring(11, 19));
  labelS.push(data.timing.substring(11, 19));
  updateData(globalData.length - 1);
  lastTimestamp = data.timing;
  updateChartConfiguration();
});

fetchDataAndInitializeChart();

let predict = 0;
function updateChartConfiguration() {
  const displayedLabelH = labelH.slice(currentIndex, end + 1);
  const displayedLabelS = labelS.slice(currentIndex, end + 1);

  console.log('Displayed labels H:', displayedLabelH);
  console.log('Displayed labels S:', displayedLabelS);

  chartH.config.options.scales.x.max = displayedLabelH.length - 1;
  chartS.config.options.scales.x.max = displayedLabelS.length - 1;
  chartH.config.data.labels = displayedLabelH;
  chartS.config.data.labels = displayedLabelS;

  const heartbeatData = globalData
    .slice(currentIndex, end + 1)
    .map(item => item.heartbeat);
  const sp02Data = globalData
    .slice(currentIndex, end + 1)
    .map(item => item.sp02);

  chartH.config.data.datasets[0].data = heartbeatData;
  chartS.config.data.datasets[0].data = sp02Data;

  console.log("end: " + end + "current: " + currentIndex);
  socket.emit('updateEndCurrent', { end, currentIndex });
  socket.on('prediction', function (data) {
    predict = data.prediction;
    document.dispatchEvent(new Event('dataUpdated'));
  });
  chartH.update();
  chartS.update();
}

});

