let responses = JSON.parse(localStorage.getItem('responses')) || [];
let eventInfo = JSON.parse(localStorage.getItem('eventInfo')) || {
    date: "15 Disember 2023",
    time: "7:00 PM",
    location: "Dewan Seri Melati, Kuala Lumpur"
};
let maxRsvp = JSON.parse(localStorage.getItem('maxRsvp')) || 100; // Nilai lalai 100

const ADMIN_PASSWORD = "admin123";
let sortDirection = 1;
let sortColumn = 'name';

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('eventDate').textContent = eventInfo.date;
    document.getElementById('eventTime').textContent = eventInfo.time;
    document.getElementById('eventLocation').textContent = eventInfo.location;
    changeTheme(); // Muat tema lalai
});

function togglePartnerOption() {
    const attendance = document.getElementById('attendance').value;
    const partnerOption = document.getElementById('partnerOption');
    partnerOption.style.display = attendance === 'Hadir' ? 'block' : 'none';
}

function toggleEditPartnerOption() {
    const attendance = document.getElementById('editAttendance').value;
    const partnerOption = document.getElementById('editPartnerOption');
    partnerOption.style.display = attendance === 'Hadir' ? 'block' : 'none';
}

document.getElementById('attendanceForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const attendance = document.getElementById('attendance').value;
    const partner = attendance === 'Hadir' ? document.getElementById('partner').value : '-';
    const timestamp = new Date().toLocaleString();

    if (!/^[A-Za-z\s]+$/.test(name)) {
        alert('Nama hanya boleh mengandungi huruf dan ruang.');
        return;
    }

    if (responses.some(r => r.name.toLowerCase() === name.toLowerCase())) {
        alert('Nama ini telah digunakan. Sila gunakan nama lain atau hubungi admin.');
        return;
    }

    if (responses.length >= maxRsvp) {
        alert(`Had RSVP (${maxRsvp}) telah dicapai. Sila hubungi admin untuk maklumat lanjut.`);
        return;
    }

    const response = { name, attendance, partner, timestamp };
    responses.push(response);
    localStorage.setItem('responses', JSON.stringify(responses));

    document.getElementById('thankYouMessage').style.display = 'block';
    document.getElementById('attendanceForm').reset();
    togglePartnerOption();

    alert('Terima kasih atas respons anda!');
});

function showAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'block';
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'none';
}

document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;

    if (password === ADMIN_PASSWORD) {
        document.getElementById('adminLoginModal').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('maxRsvp').value = maxRsvp; // Papar nilai semasa
        renderSummary();
        renderCharts();
        renderTable();
        updateProgressBar();
    } else {
        alert('Kata laluan salah!');
    }
});

function adminLogout() {
    document.getElementById('adminPanel').style.display = 'none';
    alert('Anda telah log keluar.');
}

function deleteAllData() {
    if (confirm('Adakah anda pasti mahu memadam semua maklumat? Tindakan ini tidak boleh dibatalkan.')) {
        responses = [];
        localStorage.setItem('responses', JSON.stringify(responses));
        eventInfo = { date: "15 Disember 2023", time: "7:00 PM", location: "Dewan Seri Melati, Kuala Lumpur" };
        localStorage.setItem('eventInfo', JSON.stringify(eventInfo));
        maxRsvp = 100; // Tetapkan semula ke lalai
        localStorage.setItem('maxRsvp', JSON.stringify(maxRsvp));
        document.getElementById('eventDate').textContent = eventInfo.date;
        document.getElementById('eventTime').textContent = eventInfo.time;
        document.getElementById('eventLocation').textContent = eventInfo.location;
        document.getElementById('maxRsvp').value = maxRsvp;
        renderSummary();
        renderCharts();
        renderTable();
        updateProgressBar();
        alert('Semua maklumat telah dipadam dan ditetapkan semula.');
    }
}

function deleteResponse(index) {
    if (confirm('Adakah anda pasti mahu memadam respons ini?')) {
        responses.splice(index, 1);
        localStorage.setItem('responses', JSON.stringify(responses));
        renderSummary();
        renderCharts();
        renderTable();
        updateProgressBar();
        alert('Respons telah dipadam.');
    }
}

function openEditResponseModal(index) {
    const response = responses[index];
    document.getElementById('editResponseIndex').value = index;
    document.getElementById('editName').value = response.name;
    document.getElementById('editAttendance').value = response.attendance;
    document.getElementById('editPartner').value = response.partner === '-' ? 'Dengan Pasangan' : response.partner;
    toggleEditPartnerOption();
    document.getElementById('editResponseModal').style.display = 'block';
}

function closeEditResponseModal() {
    document.getElementById('editResponseModal').style.display = 'none';
}

document.getElementById('editResponseForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const index = document.getElementById('editResponseIndex').value;
    const name = document.getElementById('editName').value.trim();
    const attendance = document.getElementById('editAttendance').value;
    const partner = attendance === 'Hadir' ? document.getElementById('editPartner').value : '-';
    const timestamp = responses[index].timestamp;

    if (!/^[A-Za-z\s]+$/.test(name)) {
        alert('Nama hanya boleh mengandungi huruf dan ruang.');
        return;
    }

    if (responses.some((r, i) => r.name.toLowerCase() === name.toLowerCase() && i !== parseInt(index))) {
        alert('Nama ini telah digunakan oleh respons lain.');
        return;
    }

    responses[index] = { name, attendance, partner, timestamp };
    localStorage.setItem('responses', JSON.stringify(responses));
    closeEditResponseModal();
    renderSummary();
    renderCharts();
    renderTable();
    updateProgressBar();
    alert('Respons telah dikemas kini!');
});

document.getElementById('updateEventForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newEventDate = document.getElementById('newEventDate').value.trim();
    const newEventTime = document.getElementById('newEventTime').value.trim();
    const newEventLocation = document.getElementById('newEventLocation').value.trim();

    if (newEventDate && newEventTime && newEventLocation) {
        eventInfo = { date: newEventDate, time: newEventTime, location: newEventLocation };
        localStorage.setItem('eventInfo', JSON.stringify(eventInfo));
        document.getElementById('eventDate').textContent = eventInfo.date;
        document.getElementById('eventTime').textContent = eventInfo.time;
        document.getElementById('eventLocation').textContent = eventInfo.location;
        alert('Maklumat majlis telah dikemas kini!');
        document.getElementById('updateEventForm').reset();
    } else {
        alert('Sila isi semua medan.');
    }
});

document.getElementById('maxRsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newMaxRsvp = parseInt(document.getElementById('maxRsvp').value);
    if (newMaxRsvp < responses.length) {
        alert('Had maksimum tidak boleh kurang daripada jumlah respons semasa (' + responses.length + ').');
        return;
    }
    if (newMaxRsvp < 1) {
        alert('Had maksimum mestilah sekurang-kurangnya 1.');
        return;
    }

    maxRsvp = newMaxRsvp;
    localStorage.setItem('maxRsvp', JSON.stringify(maxRsvp));
    updateProgressBar();
    alert(`Had maksimum RSVP telah ditetapkan kepada ${maxRsvp}.`);
});

function updateProgressBar() {
    const totalResponses = responses.length;
    const percentage = (totalResponses / maxRsvp) * 100;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    if (progressFill && progressText) { // Pastikan hanya dipanggil dalam panel admin
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${percentage.toFixed(1)}% (${totalResponses}/${maxRsvp})`;
    }
}

function changeTheme() {
    const theme = document.getElementById('themeSelect') ? document.getElementById('themeSelect').value : 'green';
    let primaryColor, secondaryColor;
    switch (theme) {
        case 'blue':
            primaryColor = '#2196F3';
            secondaryColor = '#1976D2';
            break;
        case 'purple':
            primaryColor = '#9C27B0';
            secondaryColor = '#7B1FA2';
            break;
        case 'green':
        default:
            primaryColor = '#4CAF50';
            secondaryColor = '#45a049';
            break;
    }
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
}

function renderSummary() {
    const totalResponses = responses.length;
    const totalHadir = responses.filter(r => r.attendance === 'Hadir').length;
    const totalTidakHadir = responses.filter(r => r.attendance === 'Tidak Hadir').length;
    const totalTertunda = responses.filter(r => r.attendance === 'Tertunda').length;
    const countDenganPasangan = responses.filter(r => r.attendance === 'Hadir' && r.partner === 'Dengan Pasangan').length;
    const countTanpaPasangan = responses.filter(r => r.attendance === 'Hadir' && r.partner === 'Tanpa Pasangan').length;
    const totalIndividuDenganPasangan = countDenganPasangan * 2;
    const totalIndividuTanpaPasangan = countTanpaPasangan;
    const totalIndividuHadir = totalIndividuDenganPasangan + totalIndividuTanpaPasangan;

    const percentHadir = totalResponses > 0 ? ((totalHadir / totalResponses) * 100).toFixed(1) : 0;
    const percentTidakHadir = totalResponses > 0 ? ((totalTidakHadir / totalResponses) * 100).toFixed(1) : 0;
    const percentTertunda = totalResponses > 0 ? ((totalTertunda / totalResponses) * 100).toFixed(1) : 0;
    const percentDenganPasangan = totalHadir > 0 ? ((totalIndividuDenganPasangan / totalIndividuHadir) * 100).toFixed(1) : 0;
    const percentTanpaPasangan = totalHadir > 0 ? ((totalIndividuTanpaPasangan / totalIndividuHadir) * 100).toFixed(1) : 0;

    document.getElementById('totalResponses').textContent = totalResponses;
    document.getElementById('totalHadir').textContent = `${totalHadir} (${percentHadir}%)`;
    document.getElementById('totalTidakHadir').textContent = `${totalTidakHadir} (${percentTidakHadir}%)`;
    document.getElementById('totalTertunda').textContent = `${totalTertunda} (${percentTertunda}%)`;
    document.getElementById('totalDenganPasangan').textContent = `${totalIndividuDenganPasangan} (${percentDenganPasangan}%)`;
    document.getElementById('totalTanpaPasangan').textContent = `${totalIndividuTanpaPasangan} (${percentTanpaPasangan}%)`;
    document.getElementById('totalIndividuHadir').textContent = totalIndividuHadir;
}

function renderCharts() {
    const totalHadir = responses.filter(r => r.attendance === 'Hadir').length;
    const totalTidakHadir = responses.filter(r => r.attendance === 'Tidak Hadir').length;
    const totalTertunda = responses.filter(r => r.attendance === 'Tertunda').length;
    const countDenganPasangan = responses.filter(r => r.attendance === 'Hadir' && r.partner === 'Dengan Pasangan').length;
    const countTanpaPasangan = responses.filter(r => r.attendance === 'Hadir' && r.partner === 'Tanpa Pasangan').length;
    const totalIndividuDenganPasangan = countDenganPasangan * 2;
    const totalIndividuTanpaPasangan = countTanpaPasangan;
    const totalIndividuHadir = totalIndividuDenganPasangan + totalIndividuTanpaPasangan;

    const chartUnit = document.getElementById('chartUnit').value;
    const attendanceCanvas = document.getElementById('attendanceChart');
    const partnerCanvas = document.getElementById('partnerChart');
    attendanceCanvas.getContext('2d').clearRect(0, 0, attendanceCanvas.width, attendanceCanvas.height);
    partnerCanvas.getContext('2d').clearRect(0, 0, partnerCanvas.width, partnerCanvas.height);

    if (responses.length === 0) {
        attendanceCanvas.getContext('2d').font = '16px Arial';
        attendanceCanvas.getContext('2d').fillStyle = '#666';
        attendanceCanvas.getContext('2d').textAlign = 'center';
        attendanceCanvas.getContext('2d').fillText('Tiada Data Kehadiran', attendanceCanvas.width / 2, attendanceCanvas.height / 2);
    } else {
        const attendanceData = chartUnit === 'pekerja' ? 
            [totalHadir, totalTidakHadir, totalTertunda] : 
            [totalIndividuHadir, totalTidakHadir, totalTertunda];
        new Chart(attendanceCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Hadir', 'Tidak Hadir', 'Tertunda'],
                datasets: [{
                    data: attendanceData,
                    backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top', labels: { font: { size: 14 }, color: '#333' } },
                    title: { display: true, text: `Perbandingan Kehadiran (${chartUnit === 'pekerja' ? 'Pekerja' : 'Individu'})`, font: { size: 18 }, color: '#333' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                const total = chartUnit === 'pekerja' ? (totalHadir + totalTidakHadir + totalTertunda) : (totalIndividuHadir + totalTidakHadir + totalTertunda);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                if (label === 'Hadir' && chartUnit === 'individu') {
                                    return `${label}: ${value} individu (${totalHadir} pekerja, ${percentage}%)`;
                                }
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    },
                    datalabels: {
                        display: true,
                        color: '#fff',
                        font: { size: 14, weight: 'bold' },
                        formatter: (value, context) => {
                            const total = chartUnit === 'pekerja' ? (totalHadir + totalTidakHadir + totalTertunda) : (totalIndividuHadir + totalTidakHadir + totalTertunda);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${value} (${percentage}%)`;
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    if (responses.length === 0 || totalHadir === 0) {
        partnerCanvas.getContext('2d').font = '16px Arial';
        partnerCanvas.getContext('2d').fillStyle = '#666';
        partnerCanvas.getContext('2d').textAlign = 'center';
        partnerCanvas.getContext('2d').fillText('Tiada Data Kehadiran', partnerCanvas.width / 2, partnerCanvas.height / 2);
    } else {
        const partnerData = chartUnit === 'pekerja' ? [countDenganPasangan, countTanpaPasangan] : [totalIndividuDenganPasangan, totalIndividuTanpaPasangan];
        new Chart(partnerCanvas, {
            type: 'bar',
            data: {
                labels: ['Dengan Pasangan', 'Tanpa Pasangan'],
                datasets: [{
                    label: `Bilangan ${chartUnit === 'pekerja' ? 'Pekerja' : 'Individu'}`,
                    data: partnerData,
                    backgroundColor: '#2196F3',
                    borderColor: '#1976D2',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: `Bilangan ${chartUnit === 'pekerja' ? 'Pekerja' : 'Individu'}`, font: { size: 14 } } },
                    x: { title: { display: true, text: 'Kategori Kehadiran', font: { size: 14 } } }
                },
                plugins: {
                    legend: { position: 'top', labels: { font: { size: 14 }, color: '#333' } },
                    title: { display: true, text: `Pecahan Kehadiran (${chartUnit === 'pekerja' ? 'Pekerja' : 'Individu'})`, font: { size: 18 }, color: '#333' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                const total = chartUnit === 'pekerja' ? (countDenganPasangan + countTanpaPasangan) : totalIndividuHadir;
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                if (label === 'Dengan Pasangan') {
                                    return `${label}: ${value} ${chartUnit === 'pekerja' ? 'pekerja' : 'individu'} (${percentage}%)`;
                                }
                                return `${label}: ${value} ${chartUnit === 'pekerja' ? 'pekerja' : 'individu'} (${percentage}%)`;
                            }
                        }
                    },
                    datalabels: {
                        display: true,
                        color: '#fff',
                        font: { size: 14, weight: 'bold' },
                        anchor: 'end',
                        align: 'top',
                        formatter: (value) => value
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }
}

function sortTable(column) {
    sortColumn = column;
    sortDirection *= -1;
    responses.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];
        if (column === 'timestamp') {
            valA = new Date(valA);
            valB = new Date(valB);
        }
        return (valA < valB ? -1 : valA > valB ? 1 : 0) * sortDirection;
    });
    renderTable();
}

function searchTable() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const filteredResponses = responses.filter(response => 
        response.name.toLowerCase().includes(input)
    );
    const tableBody = document.getElementById('responseTableBody');
    tableBody.innerHTML = '';
    filteredResponses.forEach((response, index) => {
        const originalIndex = responses.indexOf(response);
        const rowClass = response.attendance === 'Hadir' ? 'hadir' : 
                         response.attendance === 'Tidak Hadir' ? 'tidak-hadir' : 'tertunda';
        const row = `<tr class="${rowClass}">
            <td>${response.name}</td>
            <td>${response.attendance}</td>
            <td>${response.partner}</td>
            <td>${response.timestamp}</td>
            <td>
                <button class="edit-btn" onclick="openEditResponseModal(${originalIndex})">Edit</button>
                <button class="delete-btn" onclick="deleteResponse(${originalIndex})">Padam</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function renderTable() {
    searchTable();
}

function refreshPanel() {
    responses = JSON.parse(localStorage.getItem('responses')) || [];
    eventInfo = JSON.parse(localStorage.getItem('eventInfo')) || {
        date: "15 Disember 2023",
        time: "7:00 PM",
        location: "Dewan Seri Melati, Kuala Lumpur"
    };
    maxRsvp = JSON.parse(localStorage.getItem('maxRsvp')) || 100;
    document.getElementById('eventDate').textContent = eventInfo.date;
    document.getElementById('eventTime').textContent = eventInfo.time;
    document.getElementById('eventLocation').textContent = eventInfo.location;
    document.getElementById('maxRsvp').value = maxRsvp;
    renderSummary();
    renderCharts();
    renderTable();
    updateProgressBar();
    alert('Panel telah dimuat semula.');
}

function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nama,Status Kehadiran,Bersama Pasangan,Tarikh Respons\n";
    responses.forEach(response => {
        const row = `${response.name},${response.attendance},${response.partner},${response.timestamp}`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "respons_kehadiran.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}