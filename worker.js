export default {
  async fetch(request, env) {

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === 'GET') {
      return new Response(JSON.stringify({ status: 'ok', keyExists: !!env.ANTHROPIC_API_KEY }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    try {
      const body = await request.json();
      const { input, cases } = body;

      if (!env.ANTHROPIC_API_KEY) {
        return new Response(JSON.stringify({ error: 'API 키 없음' }), {
          status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const caseText = (cases || []).slice(0, 30).map(function(c) {
        return `법원:${c.court} 나이:${c.age_group} 사유:${c.reason||'-'} 소득:${c.income||'-'}만 채무:${c.debt||'-'}만 탕감률:${c.relief_rate}%`;
      }).join('\n');

      const prompt = `당신은 개인회생 전문 AI 진단 시스템입니다. 실제 판결문 데이터를 분석해 탕감률을 예측하세요.

[실제 판결문 ${(cases||[]).length}건]
${caseText}

[채무자 정보]
- 채무액: ${input.debt}만원
- 월소득: ${input.income}만원
- 나이대: ${input.age}
- 채무유형: ${input.dtype}
- 부양가족: ${input.dep}명
- 채무 사유: ${input.reason || '미입력'}

위 판결문 데이터에서 유사한 사례를 찾아 탕감률을 예측하세요.
특히 채무 사유가 "${input.reason || '미입력'}"인 사례를 중점 참고하세요.

반드시 아래 JSON 형식으로만 답하세요:
{"ratio":예상탕감률숫자,"range":"최소~최대%","reason":"근거 한줄","similar":유사사례건수}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 200,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();

      if (!data.content || !data.content[0]) {
        return new Response(JSON.stringify({ error: 'Claude 응답 오류', raw: JSON.stringify(data) }), {
          status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, '').trim();
      const result = JSON.parse(clean);

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};
