// Data structure with both 50% and 80% horizons
// Time horizons are in minutes
// Data from METR: https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/
const modelData = {
    frontier: [
        { name: 'GPT-5', horizon50: 8239.1, horizon80: 1582.3, date: '2025-08-07' },
        { name: 'Grok-4', horizon50: 6604.5, horizon80: 894.7, date: '2025-07-09' },
        { name: 'o3', horizon50: 5530.7, horizon80: 1223.4, date: '2025-04-16' },
        { name: 'Claude 3.7 Sonnet', horizon50: 3253.6, horizon80: 909.4, date: '2025-02-24' },
        { name: 'o1-elicited', horizon50: 2352.4, horizon80: 358.4, date: '2024-12-05' },
        { name: 'Claude 3.5 Sonnet 20241022', horizon50: 1738.9, horizon80: 278.8, date: '2024-10-22' },
        { name: 'o1-preview', horizon50: 1325.7, horizon80: 277.2, date: '2024-09-12' },
        { name: 'Claude 3.5 Sonnet', horizon50: 1092.9, horizon80: 191.9, date: '2024-06-20' },
        { name: 'GPT-4o', horizon50: 550.2, horizon80: 101.4, date: '2024-05-13' },
        { name: 'GPT-4 1106', horizon50: 513.4, horizon80: 87.2, date: '2023-11-06' },
        { name: 'GPT-4', horizon50: 321.8, horizon80: 57.9, date: '2023-03-14' },
        { name: 'GPT-3.5 Turbo Instruct', horizon50: 36.3, horizon80: 10.4, date: '2022-03-15' },
        { name: 'davinci-002', horizon50: 8.9, horizon80: 2.0, date: '2020-05-28' },
        { name: 'GPT-2', horizon50: 2.4, horizon80: 0.3, date: '2019-02-14' }
    ],
    nonFrontier: [
        { name: 'Claude Sonnet 4.5', horizon50: 6798.2, horizon80: 1209.1, date: '2025-09-29' },
        { name: 'Claude 4.1 Opus', horizon50: 6329.9, horizon80: 1265.3, date: '2025-08-05' },
        { name: 'Claude 4 Opus', horizon50: 4791.8, horizon80: 1218.0, date: '2025-05-22' },
        { name: 'o4-mini', horizon50: 4654.1, horizon80: 902.8, date: '2025-04-16' },
        { name: 'Claude 4 Sonnet', horizon50: 4062.5, horizon80: 999.6, date: '2025-05-22' },
        { name: 'GPT-OSS-120B', horizon50: 2519.0, horizon80: 397.9, date: '2025-08-05' },
        { name: 'Gemini 2.5 Pro Preview', horizon50: 2324.1, horizon80: 551.8, date: '2025-06-05' },
        { name: 'DeepSeek R1 0528', horizon50: 1870.1, horizon80: 225.0, date: '2025-05-28' },
        { name: 'DeepSeek R1', horizon50: 1615.9, horizon80: 259.9, date: '2025-01-20' },
        { name: 'DeepSeek V3 0324', horizon50: 1387.0, horizon80: 318.3, date: '2025-03-24' },
        { name: 'DeepSeek V3', horizon50: 1108.3, horizon80: 231.6, date: '2024-12-26' },
        { name: 'GPT-4 Turbo', horizon50: 394.0, horizon80: 91.4, date: '2024-04-09' },
        { name: 'Claude 3 Opus', horizon50: 385.4, horizon80: 67.5, date: '2024-03-04' },
        { name: 'GPT-4 0125', horizon50: 321.9, horizon80: 71.8, date: '2024-01-25' },
        { name: 'Qwen 2.5 72B', horizon50: 309.9, horizon80: 56.0, date: '2024-09-19' },
        { name: 'Qwen 2 72B', horizon50: 134.6, horizon80: 25.5, date: '2024-06-07' }
    ]
};

let currentScale = 'logarithmic';
let currentProbability = '50';
let showTrendline = true;
let chart;

// Calculate exponential trend line based on 7-month doubling time
function calculateTrendLine() {
    const horizonKey = currentProbability === '50' ? 'horizon50' : 'horizon80';

    // Combine all models and sort by date
    const allModels = [
        ...modelData.frontier.map(m => ({ ...m, type: 'frontier' })),
        ...modelData.nonFrontier.map(m => ({ ...m, type: 'nonFrontier' }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Find the best fit exponential curve through the data
    // Using the doubling time of 7 months mentioned in METR research
    const doublingTimeMonths = 7;
    const doublingTimeDays = doublingTimeMonths * 30.44; // Average days per month

    // Use a recent frontier model as reference point
    const referenceModel = modelData.frontier.find(m => m.name === 'GPT-5');
    const referenceDate = new Date(referenceModel.date);
    const referenceValue = referenceModel[horizonKey];

    // Generate trend line from 2019 to 2030
    const trendPoints = [];
    const startDate = new Date('2019-01-01');
    const endDate = new Date('2030-01-01');

    // Generate points at 3-month intervals
    for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 3)) {
        const daysDiff = (date - referenceDate) / (1000 * 60 * 60 * 24);
        const doublings = daysDiff / doublingTimeDays;
        const projectedValue = referenceValue * Math.pow(2, doublings);

        trendPoints.push({
            x: date.getTime(),
            y: projectedValue
        });
    }

    return trendPoints;
}

function prepareChartData() {
    const horizonKey = currentProbability === '50' ? 'horizon50' : 'horizon80';

    // Combine all models
    const allModels = [
        ...modelData.frontier.map(m => ({ ...m, type: 'frontier' })),
        ...modelData.nonFrontier.map(m => ({ ...m, type: 'nonFrontier' }))
    ];

    // Create datasets
    const frontierPoints = [];
    const nonFrontierPoints = [];

    allModels.forEach((model) => {
        const point = {
            x: new Date(model.date).getTime(),
            y: model[horizonKey],
            label: model.name,
            date: model.date
        };

        if (model.type === 'frontier') {
            frontierPoints.push(point);
        } else {
            nonFrontierPoints.push(point);
        }
    });

    const datasets = [
        {
            label: 'Frontier Models',
            data: frontierPoints,
            backgroundColor: 'rgba(39, 174, 96, 0.8)',
            borderColor: 'rgba(39, 174, 96, 1)',
            borderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 10,
            showLine: false
        },
        {
            label: 'Non-Frontier Models',
            data: nonFrontierPoints,
            backgroundColor: 'rgba(149, 165, 166, 0.8)',
            borderColor: 'rgba(149, 165, 166, 1)',
            borderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 10,
            showLine: false
        }
    ];

    // Add trend line if enabled
    if (showTrendline) {
        datasets.push({
            label: 'Exponential Trend (7-month doubling)',
            data: calculateTrendLine(),
            borderColor: 'rgba(52, 152, 219, 0.6)',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            borderWidth: 3,
            borderDash: [10, 5],
            pointRadius: 0,
            pointHoverRadius: 0,
            showLine: true,
            fill: false,
            tension: 0.4
        });
    }

    return { datasets };
}

function createChart() {
    const ctx = document.getElementById('taskChart').getContext('2d');
    const chartData = prepareChartData();

    chart = new Chart(ctx, {
        type: 'scatter',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        title: function(context) {
                            return context[0].raw.label || 'Trend Line';
                        },
                        label: function(context) {
                            if (!context.raw.label) {
                                // Trend line point
                                const date = new Date(context.parsed.x);
                                const minutes = context.parsed.y;
                                const hours = (minutes / 60).toFixed(1);
                                const days = (hours / 24).toFixed(1);
                                return [
                                    `Date: ${date.toLocaleDateString()}`,
                                    `Projected: ${minutes.toFixed(0)} min (${hours} hrs / ${days} days)`
                                ];
                            }

                            const minutes = context.parsed.y;
                            const hours = (minutes / 60).toFixed(1);
                            const days = (hours / 24).toFixed(1);
                            return [
                                `${currentProbability}% Success Horizon: ${minutes.toFixed(1)} min`,
                                `= ${hours} hours / ${days} days`,
                                `Release: ${context.raw.date}`
                            ];
                        }
                    }
                },
                title: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'year',
                        displayFormats: {
                            year: 'yyyy'
                        },
                        tooltipFormat: 'MMM yyyy'
                    },
                    title: {
                        display: true,
                        text: 'Year',
                        font: { size: 14, weight: 'bold' }
                    },
                    min: new Date('2019-01-01').getTime(),
                    max: new Date('2030-12-31').getTime(),
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    type: currentScale,
                    title: {
                        display: true,
                        text: 'Task Completion Time Horizon (minutes)',
                        font: { size: 14, weight: 'bold' }
                    },
                    min: currentScale === 'logarithmic' ? 0.1 : 0,
                    ticks: {
                        callback: function(value) {
                            if (currentScale === 'logarithmic') {
                                if (value >= 1000) {
                                    return (value / 60 / 24).toFixed(0) + ' days';
                                } else if (value >= 60) {
                                    return (value / 60).toFixed(0) + ' hrs';
                                }
                                return value.toFixed(0) + ' min';
                            }
                            if (value >= 1000) {
                                return (value / 60 / 24).toFixed(0) + ' days';
                            } else if (value >= 60) {
                                return (value / 60).toFixed(0) + ' hrs';
                            }
                            return value + ' min';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

function setScale(scale) {
    currentScale = scale;

    // Update button states
    document.getElementById('btnLinear').classList.toggle('active', scale === 'linear');
    document.getElementById('btnLog').classList.toggle('active', scale === 'logarithmic');

    // Update chart
    chart.options.scales.y.type = scale;
    chart.options.scales.y.min = scale === 'logarithmic' ? 0.1 : 0;
    chart.update();
}

function setProbability(probability) {
    currentProbability = probability;

    // Update button states
    document.getElementById('btn50').classList.toggle('active', probability === '50');
    document.getElementById('btn80').classList.toggle('active', probability === '80');

    // Update chart data
    chart.data = prepareChartData();
    chart.update();
}

function toggleTrendline() {
    showTrendline = !showTrendline;

    // Update button state
    document.getElementById('btnTrend').classList.toggle('active', showTrendline);

    // Update chart data
    chart.data = prepareChartData();
    chart.update();
}

// Initialize chart on load
window.addEventListener('load', createChart);
