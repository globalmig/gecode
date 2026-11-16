type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** JSON-LD 구조화 데이터를 <head>에 안전하게 주입하는 공통 컴포넌트. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
