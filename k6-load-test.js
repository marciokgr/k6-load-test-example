import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export let options = {
    vus: 100,
    duration: '1m',
    thresholds: {
      http_req_duration: ['p(95)<500'], // 95% das respostas devem ser mais rápidas que 500ms
      'http_req_duration{staticAsset:yes}': ['p(99)<150'], // 99% dos ativos estáticos devem carregar em menos de 150ms
      'http_req_duration{staticAsset:no}': ['avg<200', 'p(95)<400'], // Tempo médio de resposta deve ser inferior a 200ms, 95% das respostas em menos de 400ms
    },
  };

export default function () {
  let res = http.get('https://k6.io');
  check(res, {
    'status é 200': (r) => r.status === 200,
  });
  sleep(1); // Pausa de 1 segundo entre as requisições
}

// com isso o k6 não fornece mais métricas de saída no console
// gerado arquivo dentro do diretorio do teste executado
export function handleSummary(data) {
    return {
      "report.html": htmlReport(data),
    };
  }