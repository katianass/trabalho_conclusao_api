import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Recebe o caminho do JSON como argumento
const jsonFile = process.argv[2]

if (!jsonFile) {
	console.error('❌ Uso: node generate-html-report.js <caminho-do-json>')
	process.exit(1)
}

console.log(`📊 Gerando relatório HTML de: ${jsonFile}`)

// Lê o arquivo JSON
const jsonPath = path.resolve(jsonFile)
if (!fs.existsSync(jsonPath)) {
	console.error(`❌ Arquivo não encontrado: ${jsonPath}`)
	process.exit(1)
}

const rawData = fs.readFileSync(jsonPath, 'utf-8')
const lines = rawData.trim().split('\n')

// Processa métricas
const metrics = {}
const checks = []
const thresholds = {}
let testName = 'K6 Performance Test'

lines.forEach((line) => {
	try {
		const data = JSON.parse(line)

		if (data.type === 'Metric' && data.data) {
			if (!metrics[data.metric]) {
				metrics[data.metric] = []
			}
			metrics[data.metric].push(data.data)
		}

		if (data.type === 'Point' && data.data) {
			if (!metrics[data.metric]) {
				metrics[data.metric] = []
			}
			metrics[data.metric].push(data.data)
		}
	} catch (e) {
		// Ignora linhas inválidas
	}
})

// Calcula estatísticas
function calculateStats(metricData) {
	if (!metricData || metricData.length === 0) {
		return { count: 0, min: 0, max: 0, avg: 0, med: 0, p90: 0, p95: 0 }
	}

	const values = metricData
		.map((d) => d.value)
		.filter((v) => v !== undefined && v !== null)
		.sort((a, b) => a - b)

	if (values.length === 0) {
		return { count: 0, min: 0, max: 0, avg: 0, med: 0, p90: 0, p95: 0 }
	}

	const sum = values.reduce((a, b) => a + b, 0)
	const count = values.length
	const avg = sum / count
	const min = values[0]
	const max = values[count - 1]
	const med = values[Math.floor(count / 2)]
	const p90 = values[Math.floor(count * 0.9)]
	const p95 = values[Math.floor(count * 0.95)]

	return {
		count,
		min: min.toFixed(2),
		max: max.toFixed(2),
		avg: avg.toFixed(2),
		med: med.toFixed(2),
		p90: p90.toFixed(2),
		p95: p95.toFixed(2),
	}
}

// Gera HTML
const vusValues =
	metrics['vus']
		?.map((d) => d.value)
		.filter((v) => v !== undefined && v !== null) || []
const maxVus = vusValues.length > 0 ? Math.max(...vusValues) : 0

const stats = {
	http_req_duration: calculateStats(metrics['http_req_duration']),
	http_reqs: metrics['http_reqs']?.length || 0,
	vus: maxVus,
	iterations: metrics['iterations']?.length || 0,
	http_req_failed: calculateStats(metrics['http_req_failed']),
	login_duration: calculateStats(metrics['login_duration']),
	create_product_duration: calculateStats(metrics['create_product_duration']),
	list_users_duration: calculateStats(metrics['list_users_duration']),
}

const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>K6 Performance Test Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .content {
            padding: 40px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .metric-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 25px;
            border-left: 4px solid #667eea;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .metric-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .metric-card h3 {
            color: #667eea;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        .metric-card .value {
            font-size: 2.5em;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        .metric-card .unit {
            color: #7f8c8d;
            font-size: 0.9em;
        }
        .section {
            margin-bottom: 40px;
        }
        .section h2 {
            color: #2c3e50;
            font-size: 1.8em;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 0.5px;
        }
        td {
            padding: 15px;
            border-bottom: 1px solid #ecf0f1;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .success { color: #27ae60; font-weight: bold; }
        .warning { color: #f39c12; font-weight: bold; }
        .danger { color: #e74c3c; font-weight: bold; }
        .badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: bold;
        }
        .badge-success { background: #d4edda; color: #155724; }
        .badge-warning { background: #fff3cd; color: #856404; }
        .badge-danger { background: #f8d7da; color: #721c24; }
        .footer {
            text-align: center;
            padding: 30px;
            background: #f8f9fa;
            color: #7f8c8d;
            font-size: 0.9em;
        }
        .summary {
            background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            border-left: 5px solid #27ae60;
        }
        .summary h3 {
            color: #27ae60;
            margin-bottom: 15px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .summary-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
        }
        .summary-item .label {
            color: #7f8c8d;
            font-size: 0.85em;
            margin-bottom: 5px;
        }
        .summary-item .value {
            font-size: 1.5em;
            font-weight: bold;
            color: #2c3e50;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 K6 Performance Test Report</h1>
            <p>Relatório de Testes de Performance - ${new Date().toLocaleString(
							'pt-BR'
						)}</p>
            <p><strong>Arquivo:</strong> ${path.basename(jsonFile)}</p>
        </div>

        <div class="content">
            <!-- Summary -->
            <div class="summary">
                <h3>📈 Resumo Executivo</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <div class="label">Total de Requisições</div>
                        <div class="value">${stats.http_reqs}</div>
                    </div>
                    <div class="summary-item">
                        <div class="label">Usuários Virtuais (Max)</div>
                        <div class="value">${stats.vus}</div>
                    </div>
                    <div class="summary-item">
                        <div class="label">Iterações</div>
                        <div class="value">${stats.iterations}</div>
                    </div>
                    <div class="summary-item">
                        <div class="label">Tempo Médio (P95)</div>
                        <div class="value">${
													stats.http_req_duration.p95
												}ms</div>
                    </div>
                </div>
            </div>

            <!-- Key Metrics -->
            <div class="section">
                <h2>🎯 Métricas Principais</h2>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <h3>Tempo de Resposta (Avg)</h3>
                        <div class="value">${stats.http_req_duration.avg}</div>
                        <div class="unit">milissegundos</div>
                    </div>
                    <div class="metric-card">
                        <h3>Tempo de Resposta (P95)</h3>
                        <div class="value">${stats.http_req_duration.p95}</div>
                        <div class="unit">milissegundos</div>
                    </div>
                    <div class="metric-card">
                        <h3>Tempo de Resposta (Max)</h3>
                        <div class="value">${stats.http_req_duration.max}</div>
                        <div class="unit">milissegundos</div>
                    </div>
                    <div class="metric-card">
                        <h3>Total de Requisições</h3>
                        <div class="value">${stats.http_reqs}</div>
                        <div class="unit">requisições</div>
                    </div>
                </div>
            </div>

            <!-- HTTP Request Duration -->
            <div class="section">
                <h2>⏱️ Tempos de Resposta HTTP</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Métrica</th>
                            <th>Min</th>
                            <th>Média</th>
                            <th>Mediana</th>
                            <th>P90</th>
                            <th>P95</th>
                            <th>Max</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>http_req_duration</strong></td>
                            <td>${stats.http_req_duration.min}ms</td>
                            <td>${stats.http_req_duration.avg}ms</td>
                            <td>${stats.http_req_duration.med}ms</td>
                            <td>${stats.http_req_duration.p90}ms</td>
                            <td class="${
															parseFloat(stats.http_req_duration.p95) < 500
																? 'success'
																: 'danger'
														}">${stats.http_req_duration.p95}ms</td>
                            <td>${stats.http_req_duration.max}ms</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Custom Trends -->
            ${
							stats.login_duration.count > 0 ||
							stats.create_product_duration.count > 0 ||
							stats.list_users_duration.count > 0
								? `
            <div class="section">
                <h2>📊 Métricas Customizadas (Trends)</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Métrica</th>
                            <th>Count</th>
                            <th>Min</th>
                            <th>Média</th>
                            <th>P95</th>
                            <th>Max</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${
													stats.login_duration.count > 0
														? `
                        <tr>
                            <td><strong>Login Duration</strong></td>
                            <td>${stats.login_duration.count}</td>
                            <td>${stats.login_duration.min}ms</td>
                            <td>${stats.login_duration.avg}ms</td>
                            <td>${stats.login_duration.p95}ms</td>
                            <td>${stats.login_duration.max}ms</td>
                        </tr>
                        `
														: ''
												}
                        ${
													stats.create_product_duration.count > 0
														? `
                        <tr>
                            <td><strong>Create Product Duration</strong></td>
                            <td>${stats.create_product_duration.count}</td>
                            <td>${stats.create_product_duration.min}ms</td>
                            <td>${stats.create_product_duration.avg}ms</td>
                            <td>${stats.create_product_duration.p95}ms</td>
                            <td>${stats.create_product_duration.max}ms</td>
                        </tr>
                        `
														: ''
												}
                        ${
													stats.list_users_duration.count > 0
														? `
                        <tr>
                            <td><strong>List Users Duration</strong></td>
                            <td>${stats.list_users_duration.count}</td>
                            <td>${stats.list_users_duration.min}ms</td>
                            <td>${stats.list_users_duration.avg}ms</td>
                            <td>${stats.list_users_duration.p95}ms</td>
                            <td>${stats.list_users_duration.max}ms</td>
                        </tr>
                        `
														: ''
												}
                    </tbody>
                </table>
            </div>
            `
								: ''
						}

            <!-- Performance Summary -->
            <div class="section">
                <h2>✅ Avaliação de Performance</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Critério</th>
                            <th>Objetivo</th>
                            <th>Resultado</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Tempo de Resposta (P95)</td>
                            <td>&lt; 500ms</td>
                            <td>${stats.http_req_duration.p95}ms</td>
                            <td>
                                ${
																	parseFloat(stats.http_req_duration.p95) < 500
																		? '<span class="badge badge-success">✓ PASSOU</span>'
																		: '<span class="badge badge-danger">✗ FALHOU</span>'
																}
                            </td>
                        </tr>
                        <tr>
                            <td>Taxa de Erro</td>
                            <td>&lt; 10%</td>
                            <td>${stats.http_req_failed.avg}%</td>
                            <td>
                                ${
																	parseFloat(stats.http_req_failed.avg) < 10
																		? '<span class="badge badge-success">✓ PASSOU</span>'
																		: '<span class="badge badge-danger">✗ FALHOU</span>'
																}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="footer">
            <p>Relatório gerado automaticamente por K6 Performance Testing</p>
            <p>© 2025 - API Performance Tests</p>
        </div>
    </div>
</body>
</html>
`

// Salva o HTML na pasta html/
const jsonFileName = path.basename(jsonPath, '.json')
const jsonDir = path.dirname(jsonPath) // ex: test/k6/reports/json/
const reportsDir = path.join(path.dirname(jsonDir), 'html') // ex: test/k6/reports/html/
const htmlPath = path.join(reportsDir, `${jsonFileName}.html`)

// Garante que a pasta html existe
if (!fs.existsSync(reportsDir)) {
	fs.mkdirSync(reportsDir, { recursive: true })
}

fs.writeFileSync(htmlPath, html, 'utf-8')

console.log(`✅ Relatório HTML gerado com sucesso!`)
console.log(`📄 Arquivo: ${htmlPath}`)
console.log(
	`\n🌐 Abra o arquivo no navegador para visualizar o relatório completo.`
)
