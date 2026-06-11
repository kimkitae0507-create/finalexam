<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Supabase Security & Database Rules

- 테이블을 생성하거나 액세스할 때, `anon`과 `authenticated` 역할(Role)이 PostgREST API를 통해 이 테이블에 접근할 수 있도록 명시적인 **GRANT SQL 문**(SELECT, INSERT, UPDATE, DELETE 등)을 반드시 포함해야 합니다.
- 테이블에는 **RLS(Row Level Security)**를 항상 활성화해야 하며, 인증된 사용자(`authenticated`)가 본인의 데이터만 읽고 쓸 수 있도록 필터링하는 **Policy**를 함께 작성해야 합니다.
