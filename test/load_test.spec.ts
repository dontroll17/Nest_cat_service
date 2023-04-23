import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '30s', target: 30 },
    { duration: '60s', target: 60 },
  ],
};

export default () => {
  const res = http.get('http://localhost:3000/cats');
  check(res, { 'status was 200': (res) => res.status === 200 });
  sleep(1);
};
