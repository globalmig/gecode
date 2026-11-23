type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** JSON-LD 구조화 데이터를 <head>에 안전하게 주입하는 공통 컴포넌트. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      // </script> 등으로 스크립트 컨텍스트를 탈출하는 것을 막기 위해 "<"를 유니코드 이스케이프한다.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
